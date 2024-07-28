import { MyContext } from "../../global.types";
import { Memecoin } from "@prisma/client";
import { tonviewerUrl } from "../../util";

export async function sendPrivateMemecoinInfoMenu(
  ctx: MyContext,
  memecoin: Memecoin,
  text: string,
) {
  let masterAddress = memecoin.masterAddress;
  let replyMarkupPersonal = {
    inline_keyboard: [
      [
        {
          text: "🟢 Buy",
          callback_data: `callback_buy_memecoin_${memecoin?.id}`,
        },
        {
          text: "🔴 Sell",
          callback_data: `callback_sell_memecoin_${memecoin?.id}`,
        },
      ],
      [
        {
          text: "🌐 View Transaction at Tonviewer",
          url: tonviewerUrl(masterAddress),
        },
      ],
    ],
  };

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: replyMarkupPersonal,
  });
}
