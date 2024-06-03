import { v4 as uuidv4 } from "uuid";
import { D1Database } from "@cloudflare/workers-types";
import {
  REF_USER_LIST_FOUND,
  Result404,
  User404,
  USER_CREATED,
  USER_CREATED_WITH_REF,
  USER_FOUND,
} from "./static404";

export function uuid404(): string {
  return uuidv4().replace(/-/g, "");
}

export async function queryUser(
  db: D1Database,
  tgId: string,
): Promise<Result404> {
  let result: Result404 = {
    success: false,
    code: "",
    msg: "",
  };
  // @ts-ignore
  let d1Response = await db
    .prepare("select * from ArtUser where tgId=?")
    .bind(tgId)
    .all();
  if (d1Response.success) {
    result.success = d1Response.success;
    if (d1Response.results.length >= 1) {
      result.code = USER_FOUND;
      let { tgId, tgUsername, refCode } = d1Response.results[0];
      result.result = { tgId, tgUsername, refCode } as User404;
    }
  }
  return result;
}

export async function queryUserByRefCode(
  db: D1Database,
  refCode: string,
): Promise<Result404> {
  let result: Result404 = {
    success: false,
    code: "",
    msg: "",
  };
  if (!refCode || refCode.length < 3) {
    return result;
  }

  // @ts-ignore
  let d1Response = await db
    .prepare("select * from ArtUser where refCode=?")
    .bind(refCode)
    .all();
  if (d1Response.success) {
    result.success = d1Response.success;
    if (d1Response.results.length >= 1) {
      result.code = USER_FOUND;
      let { tgId, tgUsername } = d1Response.results[0];
      result.result = { tgId, tgUsername } as User404;
    }
  }
  return result;
}
export async function queryUserListByRefTgId(
  db: D1Database,
  refTgId: string,
): Promise<Result404> {
  let result: Result404 = {
    success: false,
    code: "",
    msg: "",
  };
  if (!refTgId || refTgId.length < 3) {
    return result;
  }

  // @ts-ignore
  let d1Response = await db
    .prepare("select * from ArtUser where refTgId=?")
    .bind(refTgId)
    .all();
  if (d1Response.success) {
    result.success = d1Response.success;
    if (d1Response.results.length >= 1) {
      result.code = REF_USER_LIST_FOUND;
      let user404List: User404[] = [];
      for (const record of d1Response.results) {
        let { tgId, tgUsername } = record;
        user404List.push({ tgId, tgUsername } as User404);
      }
      result.result = user404List;
    }
  }
  return result;
}

export async function createUser(
  db: D1Database,
  tgId: string,
  tgUsername: string,
  ref?: User404,
): Promise<Result404> {
  let result: Result404 = {
    success: false,
    code: "",
    msg: "",
  };
  let userId = uuid404();
  let refCode = generateRefCode(tgUsername);
  let current = Date.now();

  if (ref) {
    // @ts-ignore
    let d1Response: D1Response = await db
      .prepare(
        "INSERT INTO ArtUser (userId, tgId, tgUsername, refCode, refTgId, refTgUsername,createBy,createDt) VALUES (?, ?,?,?,?, ?, ?, ?)",
      )
      .bind(
        userId,
        tgId,
        tgUsername,
        refCode,
        ref.tgId,
        ref.tgUsername,
        tgId,
        current,
      )
      .run();
    result.success = d1Response.success;
    result.code = USER_CREATED_WITH_REF;
    result.result = {
      tgId,
      tgUsername,
      refCode,
      refTgId: ref.tgId,
      refTgUsername: ref.tgUsername,
    } as User404;
  } else {
    // @ts-ignore
    let d1Response: D1Response = await db
      .prepare(
        "INSERT INTO ArtUser (userId, tgId, tgUsername, refCode, createBy,createDt) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(userId, tgId, tgUsername, refCode, tgId, current)
      .run();
    result.success = d1Response.success;
    result.code = USER_CREATED;
    result.result = { tgId, tgUsername, refCode } as User404;
  }

  return result;
}

export async function log2db(
  db: D1Database,
  tgId: string,
  opCode: string,
  logs: string,
) {
  try {
    // @ts-ignore
    const { results } = await db
      .prepare("SELECT * FROM Customers WHERE CompanyName = ?")
      .bind("Bs Beverages")
      .all();
  } catch (error) {}
}

/**
 * 根据用户名生成一个唯一推荐码，将用户名的每个字母向后移动2位来得到推荐码，非字母不变
 */
export function generateRefCode(username: string): string {
  const uppercaseUsername = username.toUpperCase();
  let refCode = "";

  for (let i = 0; i < uppercaseUsername.length; i++) {
    const char = uppercaseUsername[i];
    let newChar = char;
    if (char >= "A" && char <= "Z") {
      const newCharCode = ((char.charCodeAt(0) - 65 + 2) % 26) + 65;
      newChar = String.fromCharCode(newCharCode);
    }

    refCode += newChar;
  }

  return "T404_" + refCode;
}
