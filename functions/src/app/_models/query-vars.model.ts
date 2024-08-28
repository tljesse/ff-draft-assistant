export interface QueryVars<T = unknown> {
  order?: string;
  dir?: QUERY_VARS_DIR;
  limit?: number;
  offset?: any;
  where?: QueryVarsWhere[];
  category?: string;
  tag?: string;
  startAfter?: any // DocumentSnapshot<T>;
}

export enum QUERY_VARS_DIR {
  ASC = 'asc',
  DESC = 'desc'
}

export enum FB_COMPARATORS {
  LESS = '<',
  LESS_OR_EQUAL = '<=',
  EQUAL = '==',
  MORE_OR_EQUAL = '>=',
  MORE = '>',
  ARR_CONTAINS = 'array-contains',
  ARR_CONTAINS_ANY = 'array-contains-any'
}

export interface QueryVarsWhere {field: string, comparator: any, value: any}
