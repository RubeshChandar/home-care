import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const app = admin.initializeApp();

export const randomNumber = functions.https.onRequest((req, res) => {
  // const number = Math.round(Math.random() * 100);
  res.send("Hello World");
});

export const ruby = functions.https.onRequest((req, res) => {
  res.status(200).send(req.query);
});

export const sayHello = functions.https.onCall((data, context) => {
  return context.auth;
});

export const deleteImages = functions.firestore.document("/{collection}/{id}")
  .onDelete((snap, context) => {
    const path = `${context.params.collection}/${context.params.id}.jpg`;
    console.log(path + " deleted.!");
    const bucket = app.storage().bucket();
    return bucket.file(path).delete();
  });
