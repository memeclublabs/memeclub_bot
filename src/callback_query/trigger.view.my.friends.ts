import { MyContext } from "../global.types";
import prisma from "../prisma";

export async function triggerViewMyFriends(
  ctx: MyContext,
  _: string,
): Promise<void> {
  let findMany = await prisma.user.findMany({
    where: {
      referBy: ctx.from?.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 20,
  });

  if (findMany) {
    let friendsCount = findMany.length;
    let friendList = "\n";
    findMany.forEach((user, index) => {
      friendList += `${index + 1}: ${user.firstName} ${user.lastName} ${user.isPremium ? "🎖" : ""} \n`;
    });

    let text =
      "👬 <b>My Friends</b> \n\n" +
      `You've invited ${friendsCount} friends\n\n` +
      "<b>Here is a short list:</b> " +
      friendList;
    await ctx.reply(text, { parse_mode: "HTML" });
  }
}
