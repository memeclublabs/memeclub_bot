export const USER_FOUND = "USER_FOUND";
export const REF_USER_LIST_FOUND = "REF_USER_LIST_FOUND";
export const USER_CREATED = "USER_CREATED";
export const USER_CREATED_WITH_REF = "USER_CREATED_WITH_REF";

export interface User404 {
  tgId: string;
  tgUsername: string;
  refCode: string;
  refTgId: string;
  refTgUsername: string;
}

export interface Result404 {
  success: boolean;
  code?: string;
  msg?: string;
  result?: any;
}
