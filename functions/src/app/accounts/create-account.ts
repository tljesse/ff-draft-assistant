import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { updateDocument } from "../firestore-helpers";

/**
 * @todo increment global statistics
 */
export const createAccountDocument = functions.auth.user().onCreate((user) => {
  const userUid = user.uid; // The UID of the user.
  const email = user.email; // The email of the user.

  return admin.firestore().collection("permissions").get()
    .then(async (perms) => {
      const defaultPermissions: any = {};

      if (perms?.size) {
        perms.forEach((p: any) => {
          const data = p.data();
          defaultPermissions[data.key] = {
            isViewAllowed: false,
            isActionAllowed: false,
          };
        });
      }

      const account = {
        _id: userUid,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        email: email,
        explicit_permissions: defaultPermissions,
        effective_permissions: defaultPermissions,
        setInitialPerms: true,
      };

      await admin.firestore().collection("accounts").doc(userUid).set(account);

      await updateDocument('_stats', 'userCount', {
        count: admin.firestore.FieldValue.increment(1),
      });

      return;
    });
});
