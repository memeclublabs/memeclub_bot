import { MyContext } from "../global.types";
import prisma from "../prisma";

export async function triggerViewPointsHistory(
  ctx: MyContext,
  _: string,
): Promise<void> {
  let findUser = await prisma.user.findUnique({
    where: { tgId: ctx.from?.id },
  });

  let findMany = await prisma.userAction.findMany({
    where: {
      opTgId: ctx.from?.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 20,
  });

  if (findUser && findMany) {
    let actionList = "\n";
    findMany.forEach((action, index) => {
      actionList += `${index + 1}: ${action.actionType}  ⭐️${action.selfReward != null && action.selfReward > 0 ? "+" : ""}${action.selfReward}  \n`;
    });

    let text =
      "⭐️ <b>Points History</b> \n\n" +
      `Your Meme Points: ${findUser.totalPoints} \n\n` +
      "<b>Here is a short history:</b> " +
      actionList;
    await ctx.reply(text, { parse_mode: "HTML" });
  }
}
