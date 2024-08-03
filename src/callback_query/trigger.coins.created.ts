import { MyContext } from "../global.types";
import { buildKeyboardWithMemes } from "../service/msg/tg.msg.list.new";
import prisma from "../prisma";

export async function triggerCoinsCreated(
  ctx: MyContext,
  _: string,
): Promise<void> {
  await ctx.editMessageText(
    "<b>👑 Memecoins You Created</b>\n\nBelow are the memecoins you created, click to view details.",
    { parse_mode: "HTML" },
  );

  let findMemecoins = await prisma.memecoin.findMany({
    where: { devTgId: ctx.from?.id },
    orderBy: {
      createDt: "desc",
    },
    take: 30,
  });
  // TODO pagination

  let inlineKeyboard = buildKeyboardWithMemes(findMemecoins);
  await ctx.editMessageReplyMarkup({ reply_markup: inlineKeyboard });
}
