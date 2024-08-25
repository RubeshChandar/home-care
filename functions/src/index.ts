/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { deleteArrayElement, getAvailability, isTimeOutsideRange } from "./helperFunctions";
import { FieldValue } from "firebase-admin/firestore";

const app = admin.initializeApp();
export const firestore = admin.firestore();


export const deleteImages = functions.firestore.document("/{collection}/{id}")
  .onDelete((snap, context) => {
    const path = `${context.params.collection}/${context.params.id}.jpg`;
    console.log(path + " deleted.!");
    const bucket = app.storage().bucket();
    return bucket.file(path).delete();
  });

export const addRequest = functions.https.onCall(async (data, context) => {
  return await (await import("./addRequest")).default(data, context);
});

export const fireTrigger = functions.firestore.document("requests/{date}/unassigned/{id}")
  .onCreate((data, context) => {
    getAvailability(context.params.date);
  });

export const getAvailableCarers = functions.https.onCall(async (unassignedRequest, context) => {
  const availableCarers: { id: string }[] = [];
  if ((await firestore.collection(`requests/${unassignedRequest.date}/schedule`).get()).empty) {
    await getAvailability(unassignedRequest.date);
  }

  const listOfCarers = await firestore.collection(`requests/${unassignedRequest.date}/schedule`)
    .where("startTime", "<=", unassignedRequest.startTime + 0.5)
    .where("endTime", ">=", unassignedRequest.endTime + 0.5)
    .get();

  await Promise.all(listOfCarers.docs.map(async (carer) => {
    const careDoc = await firestore.collection("carer").doc(carer.id).get();
    let skipFlag = false;

    if (carer.data().booked !== undefined) {
      (carer.data().booked as { startTime: number, endTime: number, patient: string }[]).forEach(
        (booking) => {
          if (!isTimeOutsideRange(
            unassignedRequest.startTime,
            unassignedRequest.endTime,
            booking.startTime,
            booking.endTime
          )) skipFlag = true;
        }
      );
    }

    if (skipFlag) return; // skips a carer if a booking overlaps

    if (careDoc.data()) {
      availableCarers.push({ id: careDoc.id, ...careDoc.data() });
    }
  }));

  return availableCarers;
});

export const assignCarer = functions.https.onCall(async (data) => {
  const ref = firestore.collection(`requests/${data.date}/schedule`).doc(data.carerID);
  const refData = (await ref.get()).data();

  if (refData?.booked === undefined || refData.booked.length < 0) {
    await ref.set({
      "startTime": refData!.startTime,
      "endTime": refData!.endTime,
      "booked": [
        { startTime: data.startTime, endTime: data.endTime, patient: data.patientID },
      ],
    });
  } else {
    await ref.update({ "booked": FieldValue.arrayUnion({ startTime: data.startTime, endTime: data.endTime, patient: data.patientID }) });
  }

  const refAssigned = firestore.collection(`requests/${data.date}/assigned`).doc(data.patientID);
  const refAssignedData = (await refAssigned.get()).data();

  if (refAssignedData?.requested === undefined || refAssignedData.requested.length < 0) {
    await refAssigned.set({
      "requested": [{ carerID: data.carerID, carerName: data.carerName, startTime: data.startTime, endTime: data.endTime, notes: data.notes, carerNote: "" }],
    });
  } else {
    await refAssigned.update({
      "requested": FieldValue.arrayUnion({ carerID: data.carerID, carerName: data.carerName, startTime: data.startTime, endTime: data.endTime, notes: data.notes, carerNote: "" }),
    });
  }

  const refUnassigned = firestore.collection(`requests/${data.date}/unassigned`).doc(data.patientID);
  const refUnassignedData = (await refUnassigned.get()).data()!["requested"];

  refUnassigned.update({ requested: deleteArrayElement(refUnassignedData, data) });

  return "Done";
});

export const deleteCarer = functions.https.onCall(async (data) => {
  // write the function to reverse the assignment
  const refAssigned = firestore.collection(`requests/${data.date}/assigned`).doc(data.patientID);
  const refAssignedData = (await refAssigned.get()).data()!["requested"];
  console.log(refAssignedData);
  await refAssigned.update({ requested: deleteArrayElement(refAssignedData, data) });

  const ref = firestore.collection(`requests/${data.date}/schedule`).doc(data.carerID);
  const refData = (await ref.get()).data()!["booked"];

  await ref.update({ "booked": deleteArrayElement(refData, data) });

  return ("done");
});

export const removeEmptyUAreq = functions.firestore.document("requests/{date}/{UA}/{id}")
  .onWrite(async (change, context) => {
    if (context.params.UA === "assigned" || context.params.UA === "unassigned") {
      const afterData = change.after.data();
      const arrayField = afterData?.requested;

      // Check if the field is an array and if it's empty
      if (Array.isArray(arrayField) && arrayField.length === 0) {
        const docRef = change.after.ref;
        try {
          await docRef.delete();
          console.log(`Document ${context.params.id} deleted because array is empty.`);
        } catch (error) {
          console.error(`Failed to delete document ${context.params.id}: `, error);
        }
      }
    }
  });
