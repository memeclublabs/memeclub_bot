import { PrismaClient } from "@prisma/client/edge";

export async function findUserById(tgId: number) {
  const prisma = new PrismaClient();
  return prisma.user.findFirst({ where: { tgId: tgId } });
}
