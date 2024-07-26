import prisma from "../prisma";
import { InlineKeyboard } from "grammy";
import { MyContext } from "../global.types";

export async function processByCoinStatus(
  ctx: MyContext,
  opIgId: number,
  memecoinId: bigint,
  groupTitle: string,
) {
  console.info("==== processByCoinStatus === ");
  if (memecoinId) {
    let findMemecoin = await prisma.memecoin.findUnique({
      where: { id: memecoinId },
    });
    if (findMemecoin) {
      console.info("==== processByCoinStatus === ", findMemecoin.coinStatus);
      if (findMemecoin.coinStatus == "Init") {
        // 已经有 Init 状态的，继续推进
        const keyboard = new InlineKeyboard().text(
          "🚀 Confirm to Create Memecoin",
          `callback_confirm_deploy_${findMemecoin.id}`,
        );

        let textFor = `🔔<b>Memecoin for ${groupTitle}</b>

The group is already bound to this Memecoin, please confirm to create it.
    
       Name: ${findMemecoin.name}
       Ticker: ${findMemecoin.ticker}
       Description: ${findMemecoin.description}`;
        await ctx.api.sendMessage(opIgId, textFor, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        });
      } else if (findMemecoin.coinStatus == "Deploying") {
        await ctx.api.sendMessage(
          opIgId,
          `This Memecoin ${findMemecoin.name} is in deploying, please wait...`,
        );
      } else if (findMemecoin.coinStatus === "Deployed") {
        // TODO： 这里换成真实的买卖按钮
        await ctx.api.sendMessage(
          opIgId,
          `This Memecoin ${findMemecoin.name} is pumping, please join to have fun!`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Buy ",
                    url: "https://tonviewer.com/EQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0mJ5",
                  },
                  {
                    text: "Sell",
                    url: "https://tonviewer.com/EQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0mJ5",
                  },
                ],
                [
                  {
                    text: "Referral",
                    url: "https://tonviewer.com/EQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0mJ5",
                  },
                ],
              ],
            },
          },
        );
      }
    } else {
      console.error("memecoin not found by id", memecoinId);
    }
  } else {
    console.error("memecoin id not specified");
  }
}
