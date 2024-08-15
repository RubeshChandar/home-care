/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getDayName, getAvailability } from "./helperFunctions";

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

export const checkAvailability = functions.https.onCall(async (data, context) => {
  const day = getDayName(data.date);
  if ((await firestore.collection(`requests/${data.date}/schedule`).get()).empty) {
    await getAvailability(data.date);
  }
});

export const fireTrigger = functions.firestore.document("requests/{date}/unassigned/{id}")
  .onCreate((data, context) => {
    getAvailability(context.params.date);
  });
