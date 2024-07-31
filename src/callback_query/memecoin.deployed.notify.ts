import { Memecoin } from "@prisma/client";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { FROM_GROUP_VIEW_MEME } from "../com.static";
import { sendPrivateChatMemecoinInfo } from "../service/msg/tg.msg.sender";
import {
  botStatusValid,
  buildMemecoinInfoText,
  tonviewerUrl,
} from "../com.utils";

export async function memecoinDeployedNotify(
  ctx: MyContext,
  memecoin: Memecoin,
) {
  let findGroup = await prisma.group.findUnique({
    where: { groupId: memecoin.groupId! },
  });

  if (findGroup && botStatusValid(findGroup.botStatus)) {
    // 1. 通知部署人
    await sendPrivateChatMemecoinInfo(ctx, findGroup, memecoin);

    //2. 通知群组
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
      buildMemecoinInfoText(
        memecoin,
        findGroup,
        `🎉Memecoin ${memecoin.ticker} is ready to fair launch!🚀`,
      ),
      {
        parse_mode: "HTML",
        reply_markup: replyMarkupGroup,
      },
    );
  }
}
