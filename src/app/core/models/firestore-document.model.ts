import { Timestamp } from "@angular/fire/firestore";

export interface FirestoreDocument {
	_id?: string;
	dateCreated?: Timestamp;
	isoDateCreated?: string;
	dateUpdatedTimestamp?: Timestamp;
	isoDateUpdated?: string;
}