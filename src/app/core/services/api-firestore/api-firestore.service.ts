import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, CollectionReference, doc, docData, updateDoc, setDoc, deleteDoc, serverTimestamp, onSnapshot, query, where, snapToData, QueryConstraint, orderBy, limit, getDocs, startAfter, DocumentSnapshot } from '@angular/fire/firestore';

import { Observable, firstValueFrom } from 'rxjs';

import { QueryVars } from '@app/core/models/query-vars.model';

import { IApiFirestoreService } from './IApiFirestoreService';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiFirestoreService<T> implements IApiFirestoreService<T>  {

  protected _path: string;

  constructor(private path: string,
    protected afs: Firestore) {
    this._path = path;
  }

  update(doc_id: string, data: any) {
    return updateDoc(doc(this.afs, this._path, doc_id), data);
  }

  /**
   * Creates a document
   * 
   * @param data data to be included in the document
   * @param doc_id (optional) ID of the document, if not provided a document ID will be automatically generated
   * @returns ID of the created document
   */
  async create(data: any, doc_id?: string): Promise<string> {
    const docId = doc_id ? doc_id : doc(collection(this.afs, this._path)).id;
    data.dateCreated = serverTimestamp();
    data._id = docId;

    if (!data.isoDateCreated) {
      const today = new Date();
      data.isoDateCreated = today.toISOString().substr(0, 10);
    }

    await setDoc(doc(this.afs, this._path, docId), data);

    return data._id;
  }

  delete(doc_id: string) {
    return deleteDoc(doc(this.afs, this._path, doc_id));
  }

  getAllData(): Promise<T[]> {
    return new Promise<any>((resolve, reject) => {
      getDocs(collection(this.afs, this._path)).then(querySnapshot => {
        let allData: T[] = [];
        querySnapshot.forEach(doc => {
          allData.push(doc.data() as T);
        });
        resolve(allData);
      }).catch(err => {
        console.error('[BaseFirestoreService] getAllData collection: ' + this._path, err);
        reject(err);
      });
    });
  }

  getData(doc_id: string)  {
    return firstValueFrom(docData(doc(this.afs, this._path, doc_id))) as Promise<T>;
  }

  getQueryData(queryVars: QueryVars) {
    return firstValueFrom(this.watchQuery(queryVars));
  }

  watch(doc_id: string) {
    return docData(doc(this.afs, this._path, doc_id)) as Observable<T>;
  }

  /**
   * @todo figure out the return type
   * @param queryVars 
   * @returns 
   */
  watchQuery(queryVars: QueryVars) {
    const appQuery = query(
      collection(this.afs, this._path) as CollectionReference<T[]>,
      ...this.buildQuery(queryVars)
    );

    return collectionData(appQuery) as Observable<T[]>;
  }

  /**
   * Helper to build collection query
   *
   * @since 2.1.0
   */
  private buildQuery(queryVars: QueryVars) {
    const queryConstraints: QueryConstraint[] = [];

    if (queryVars.where && queryVars.where.length) {
      queryVars.where.forEach((clause: any) => {
        queryConstraints.push(where(clause.field, clause.comparator, clause.value));
        // query = query.where(clause.field, clause.comparator, clause.value);
      });
    }
    if (queryVars.order && queryVars.dir) {
      queryConstraints.push(orderBy(queryVars.order, queryVars.dir));
    }
    if (queryVars.limit) {
      queryConstraints.push(limit(queryVars.limit))
    }
    // if (queryVars.startAfter) {
    //   query = query.startAfter(queryVars.startAfter);
    // }
    return queryConstraints;
  }

  paginate(limitVal: number, queryVars: QueryVars = {}): Observable<T[]> {
    return this.watchQuery({ ...queryVars, limit: limitVal });
  }

  async page(limitVal: number, lastItem: string, queryVars: QueryVars = {}): Promise<Observable<T[]>> {
    const lastDoc = await this.getData(lastItem);
    const constraints = this.buildQuery(queryVars);
    constraints.push(limit(limitVal));
    constraints.push(startAfter(lastDoc));

    const queryRef = query(collection(this.afs, this._path) as CollectionReference<T>, ...constraints);
    return collectionData(queryRef) as Observable<T[]>;
  }

  pageRef(limitVal: number, lastItem: DocumentSnapshot<T>, queryVars: QueryVars = {}): Observable<T[]> {
    const constraints = this.buildQuery(queryVars);
    constraints.push(limit(limitVal));
    constraints.push(startAfter(lastItem));

    const queryRef = query(collection(this.afs, this._path) as CollectionReference<T>, ...constraints);
    return collectionData(queryRef) as Observable<T[]>;
  }

}