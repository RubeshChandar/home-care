/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const app = admin.initializeApp();

type tRequest = {
  startTime: number;
  endTime: number;
  notes: string;
}

// eslint-disable-next-line require-jsdoc
function timeStringToNumber(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
}

export const deleteImages = functions.firestore.document("/{collection}/{id}")
  .onDelete((snap, context) => {
    const path = `${context.params.collection}/${context.params.id}.jpg`;
    console.log(path + " deleted.!");
    const bucket = app.storage().bucket();
    return bucket.file(path).delete();
  });

export const addRequest = functions.https.onCall((data, context) => {
  if (context.auth === null) {
    console.error("Not signed in!!?");
    return "Please sign in!";
  }
  let message = "";
  const formartedData = {
    "startTime": timeStringToNumber(data.startTime),
    "endTime": timeStringToNumber(data.endTime),
    "notes": data.notes,
  };

  const ref = admin.firestore().collection(`requests/${data.date}/unassigned`).doc(data.id);
  return ref.get().then((rawReturned): string | void => {
    const returnedData = rawReturned.data();
    if (returnedData?.requested === undefined) {
      ref.set({ requested: [formartedData] });
      message = "Success";
    } else {
      const unsortedRequest = returnedData.requested as tRequest[];
      const requested = unsortedRequest.sort((a, b) => {
        if (a.startTime > b.startTime) return 1;
        if (a.startTime < b.startTime) return -1;
        return 0;
      });
      if (requested.length > 0) {
        const firstrequest = requested[0];
        const lastrequest = requested[(requested.length) - 1];
        const a = lastrequest.endTime < formartedData.startTime;
        const b = firstrequest.startTime < formartedData.endTime;
        const xor = ((a && !b) || (!a && b));
        if (xor) {
          message = "Overlap";
          console.warn("Overlap so not successfull");
          return;
        }
      }
      message = "Success";
      ref.update({ requested: FieldValue.arrayUnion(formartedData) });
    }
  }).then(() => {
    console.debug("Operation Done!!!!");
    return message;
  }).catch((e) => {
    console.error(e);
    return "Failure";
  });
});

// export const checker = functions.https.onRequest((req, res) => {
//   admin.firestore().collection(`requests/${req.query.date}/unassigned`).doc(req.query.id as string)
//     .get().then((items) => {
//       const unsorted = items.data()?.requested as tRequest[];
//       const sorted = unsorted.sort((a, b) => {
//         if (a.startTime > b.startTime) return 1;
//         if (a.startTime < b.startTime) return -1;
//         return 0;
//       });
//       res.send(sorted);
//     });
// });
