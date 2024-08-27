import { Observable } from "rxjs";

import { QueryVars } from "@app/core/models/query-vars.model";

export interface IApiFirestoreService<T> {
  //get(id: string): Promise<any>;
  getData(id: string): Promise<T>
  // getAll(id: string): Promise<any>;
  // getAllData(id: string): Promise<T[]>;
  // getByAccount(account_id: string, order?: string, dir?: string): Promise<T[]>;
  // getGroup(ids: string[]): Promise<T[]>;

  watch(id: string): Observable<T>;
  watchQuery(queryVars: QueryVars): Observable<T[]>;
  // watchAll(): Observable<T[]>

  // getQuery(queryVars: QueryVars);
  // getQueryData(queryVars: QueryVars): Promise<T[]>;

  // getPagination(queryVars: QueryVars);

  // list(): Observable<T[]>;
  // add(item: T): Promise<T>;
  create(data: any): Promise<any>;
  update(id: string, item: T): Promise<void>;
  // delete(id: string): void;
  // getAll(): Promise<T>;
}