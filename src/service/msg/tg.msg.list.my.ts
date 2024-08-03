import { MyContext } from "../../global.types";
import { InlineKeyboard } from "grammy";
import prisma from "../../prisma";

export async function listMyMemes(ctx: MyContext): Promise<void> {
  let inlineKeyboard = new InlineKeyboard();
  let tgId = ctx.from?.id;

  let devCount = await prisma.memecoin.count({ where: { devTgId: tgId } });
  let buyCount = await prisma.buyOrder.count({ where: { buyerTgId: tgId } });

  inlineKeyboard
    .text(
      `👑 Memecoins Created (${devCount})`,
      JSON.stringify({
        method: `triggerCoinsCreated`,
        data: `${tgId}`,
      }),
    )
    .row()
    .text(
      `🪙 Memecoins Bought (${buyCount})`,
      JSON.stringify({
        method: "triggerCoinsBought",
        data: `${tgId}`,
      }),
    );

  let text = `<b>🤡 My Memecoins</b>\n
👑 You created ${devCount} memecoins.\n
🪙 You bought ${buyCount} memecoins.\n <i>(including records not signed yet)</i>
`;
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
