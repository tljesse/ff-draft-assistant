import { FirestoreDocument } from "../firestore-document.model";

export interface Account extends FirestoreDocument {
  firstName?: string;
  lastName?: string;
  email?: string;
}