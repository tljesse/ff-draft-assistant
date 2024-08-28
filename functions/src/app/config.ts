// import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/* tslint:disable no-var-requires */
const credentials = require("../../credentials.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(credentials.serviceAccount),
    databaseURL: credentials.databaseURL,
    storageBucket: credentials.storageBucket,
  });

  // admin.initializeApp(functions.config().firebase);
} catch (e) {
  console.error(e);
}

export const PROJECT_ID = credentials.serviceAccount.project_id;
export const SA_EMAIL = credentials.serviceAccount.client_email;
