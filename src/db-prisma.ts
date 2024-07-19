import { PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { PrismaD1 } from "@prisma/adapter-d1";

export function dbClient(db: D1Database): PrismaClient {
  const adapter = new PrismaD1(db);
  return new PrismaClient({ adapter });
}
