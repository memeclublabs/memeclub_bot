import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData = [
  {
    tgId: 111,
    firstName: "John",
    refCode: "ref_11",
  },
  {
    tgId: 222,
    lastName: "Kevin",
    refCode: "ref_22",
  },
  {
    tgId: 999147483647,
    lastName: "big int user",
    refCode: "ref_999147483647",
  },
] satisfies Prisma.UserCreateInput[];

async function main() {
  console.log(`Start seeding ...`);
  // for (const u of userData) {
  //   const user = await prisma.user.create({
  //     data: u,
  //   });
  //   console.log(`Created user with id: ${user.id}`);
  // }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
