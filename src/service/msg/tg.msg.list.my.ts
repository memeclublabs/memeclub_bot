import { MyContext } from "../../global.types";
import { InlineKeyboard } from "grammy";
import prisma from "../../prisma";

export async function listMyMemes(ctx: MyContext): Promise<void> {
  let inlineKeyboard = new InlineKeyboard();
  let tgId = ctx.from?.id;

  let devCount = await prisma.memecoin.count({ where: { devTgId: tgId } });
  let buyCount = 0;

  let findBuyOrdersDistinct = await prisma.buyOrder.findMany({
    where: { buyerTgId: ctx.from?.id },
    distinct: ["memecoinId"],
    select: {
      memecoinId: true,
    },
    orderBy: {
      createDt: "desc",
    },
    take: 30,
  });
  if (findBuyOrdersDistinct.length > 0) {
    buyCount = findBuyOrdersDistinct.length;
  }

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
