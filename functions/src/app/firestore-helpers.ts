import * as admin from 'firebase-admin';
// import * as functions from 'firebase-functions';

// import { Filter } from 'firebase-admin/firestore';

const db = admin.firestore();
// const auth = admin.auth();

import { QueryVars, QueryVarsWhere } from './_models/query-vars.model';

/**********************************
 *        GET FUNCTIONS
 *********************************/

// Get a single document from a collection
export async function getDocument(collectionName: string, document_id: string) {
  return await db.collection(collectionName).doc(document_id).get().then(doc => {
    if (doc.exists) return doc.data();
    else return null;
  });
}

export async function getDocumentRef(collectionName: string, document_id: string) {
  return await db.collection(collectionName).doc(document_id).get().then(doc => {
    if (doc.exists) return doc;
    else return null;
  });
}

export async function getCollection(collectionName: string) {
  return await db.collection(collectionName).get().then(snapshot => {
    const docs: any[] = [];

    if (snapshot.docs && snapshot.docs.length) {
      snapshot.docs.forEach(doc => {
        docs.push(doc.data());
      });
    }
    return docs;
  });
}

export async function getByField(collection: string, field: string, value: string) {
  return await db.collection(collection).where(field, '==', value).get().then(snapshot => {
    const docs: any[] = [];

    if (snapshot.docs && snapshot.docs.length) {
      snapshot.docs.forEach(doc => {
        docs.push(doc.data());
      });
    }
    return docs;
  });
}

export async function getDocumentGroup(collectionName: string, document_ids: string[]) {
  const promises: any[] = [];

  document_ids.forEach(document_id => {
    promises.push(getDocument(collectionName, document_id));
  });

  return await Promise.all(promises).then(docs => {
    const docsData: any[] = [];

    if (docs) {
      docs.forEach(doc => {
        if (doc.exists) docsData.push(doc.data());
      });

      return docsData;
    }

    return null;
  });
}

export async function getWhere(collectionName: string, queryVars: QueryVars = {}) {
  const collection = db.collection(collectionName);
  let query: any = collection;

  if (queryVars.where && (queryVars.where as QueryVarsWhere[]).length) {
    (queryVars.where as QueryVarsWhere[]).forEach((clause: any) => {
      query = query.where(clause.field, clause.comparator, clause.value);
    });
  }

  if (queryVars.order && queryVars.dir) {
    query = query.orderBy(queryVars.order, queryVars.dir);
  }

  if (queryVars.limit) {
    query = query.limit(queryVars.limit);
  }

  if (queryVars.startAfter) {
    query = query.startAfter(queryVars.startAfter);
  }

  return await query.get().then((snapshot: any) => {
    const docs: any = [];
    if (snapshot && snapshot.size) {
      snapshot.docs.forEach((doc: any) => {
        if (doc.exists) docs.push(doc.data());
      });
    }

    return docs;
  });
}

/**********************************
 *        CREATE FUNCTIONS
 *********************************/

export async function create(collection: string, data: any, id?: string) {
  data.dateCreated = admin.firestore.Timestamp.now();

  let ref_id = id;

  if (!ref_id) {
    const newRef = await db.collection(collection).doc();
    ref_id = newRef.id;
  }
  data._id = ref_id;

  try {
    await db.collection(collection).doc(ref_id).set(data);

    return data;
  } catch (err) {
    console.error(err);
    return;
  }
}

/**********************************
 *        UPDATE FUNCTIONS
 *********************************/

export async function updateDocument(collection: string, doc_id: string, data: any) {
  data.dateUpdated = admin.firestore.Timestamp.now();
  return db.collection(collection).doc(doc_id).update(data);
}

/**********************************
 *        DELETE FUNCTIONS
 *********************************/

export async function deleteDoc(collection: string, id: string) {
  return db.collection(collection).doc(id).delete();
}
