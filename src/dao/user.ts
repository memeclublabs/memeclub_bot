import { PrismaClient } from "@prisma/client";

export async function findUserById(tgId: number) {
  const prisma = new PrismaClient();
  return prisma.user.findFirst({ where: { tgId: tgId } });
}
