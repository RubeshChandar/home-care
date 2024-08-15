/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import { firestore } from "./index";
import { timeStringToNumber } from "./helperFunctions";
import { FieldValue } from "firebase-admin/firestore";

type tRequest = {
  startTime: number;
  endTime: number;
  notes: string;
}

export default async (data: any, context: any) => {
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

  const ref = firestore.collection(`requests/${data.date}/unassigned`).doc(data.id);
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
    firestore.collection(`patient/${data.id}/dates`).doc(data.date).create({});
    console.debug("Operation Done!!!!");
    return message;
  }).catch((e) => {
    console.error(e);
    return "Failure";
  });
};
