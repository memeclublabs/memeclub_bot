import { MyContext } from "../global.types";
import { buildKeyboardWithBuyOrder } from "../service/msg/tg.msg.list.new";
import prisma from "../prisma";

export async function triggerCoinsBought(
  ctx: MyContext,
  _: string,
): Promise<void> {
  let findBuyOrders = await prisma.buyOrder.findMany({
    where: { buyerTgId: ctx.from?.id },
    orderBy: {
      createDt: "desc",
    },
    take: 30,
  });
  if (findBuyOrders && findBuyOrders.length > 0) {
    await ctx.editMessageText(
      "<b>🪙 Memecoins You Bought</b>\n\nBelow are the memecoins you bought, click to view details.\n\n<i>(including records not signed yet)</i>",
      { parse_mode: "HTML" },
    );

    // TODO pagination
    let inlineKeyboard = buildKeyboardWithBuyOrder(findBuyOrders);
    await ctx.editMessageReplyMarkup({ reply_markup: inlineKeyboard });
  } else {
    await ctx.editMessageText(
      "<b>🪙 Memecoins You Bought</b>\n\n<i> 🧞‍♂️ No record found.</i>",
      { parse_mode: "HTML" },
    );
  }
}
