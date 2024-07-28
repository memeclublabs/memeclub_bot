import { Memecoin } from "@prisma/client";
import { MyContext } from "../global.types";
import { botStatusValid, tonviewerUrl } from "../util";
import prisma from "../prisma";
import { FROM_GROUP_VIEW_MEME } from "../static";
import { sendPrivateMemecoinInfoMenu } from "../service/msg/tg.msg.sender";

export async function memecoinDeployedNotify(
  ctx: MyContext,
  memecoin: Memecoin,
) {
  // 1. 通知部署人  2. 通知群组

  // 1. 通知到人购买菜单
  let text =
    "<b>🎉Memecoin " +
    memecoin.ticker +
    " #" +
    memecoin.id +
    " deploy successfully!</b>\n\n" +
    "" +
    "Name:" +
    memecoin.name +
    "\nTicker:" +
    memecoin.ticker +
    "\nDescription:" +
    memecoin.description;
  await sendPrivateMemecoinInfoMenu(ctx, memecoin, text);

  // 1. 通知到群组菜单
  let findGroup = await prisma.group.findUnique({
    where: { groupId: memecoin.groupId! },
  });

  if (findGroup && botStatusValid(findGroup.botStatus)) {
    let replyMarkupGroup = {
      inline_keyboard: [
        [
          {
            text: "🟢 Buy",
            url: `https://t.me/${process.env.TELEGRAM_BOT_NAME}?start=${FROM_GROUP_VIEW_MEME}${memecoin.id}`,
          },
          {
            text: "🔴 Sell",
            url: `https://t.me/${process.env.TELEGRAM_BOT_NAME}?start=${FROM_GROUP_VIEW_MEME}${memecoin.id}`,
          },
        ],
        [
          {
            text: "🌐 View Transaction at Tonviewer",
            url: tonviewerUrl(memecoin.masterAddress),
          },
        ],
      ],
    };

    await ctx.api.sendMessage(
      Number(memecoin.groupId),
      `<b>🎉Memecoin ${memecoin.ticker} is ready to fair launch!🚀</b>\n

Name: ${memecoin.name}
Ticker: ${memecoin.ticker}
Group: ${findGroup.groupTitle}
Description: ${memecoin.description}\n

`,
      {
        parse_mode: "HTML",
        reply_markup: replyMarkupGroup,
      },
    );
  }
}
