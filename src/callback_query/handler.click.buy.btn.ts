import { MyContext } from "../global.types";
import prisma from "../prisma";
import { buildMemecoinInfoText, contactAdminWithError } from "../com.utils";
import { InlineKeyboard } from "grammy";

export async function handlerClickBuyBtn(ctx: MyContext, memecoinId: number) {
  let findMeme = await prisma.memecoin.findUnique({
    where: { id: memecoinId },
  });
  if (!findMeme) {
    await contactAdminWithError(ctx, ` memecoin ${memecoinId} not found`);
    return;
  }

  let findGroup = await prisma.group.findUnique({
    where: { groupId: Number(findMeme.groupId) },
  });
  if (!findGroup) {
    await contactAdminWithError(ctx, `group ${findMeme.groupId} not found`);
    return;
  }

  let inlineKeyboard = new InlineKeyboard()
    .text("2 TON", `click_buy_memecoin_${findMeme.id}_with_ton_2`)
    .text("5 TON", `click_buy_memecoin_${findMeme.id}_with_ton_5`)
    .text("10 TON", `click_buy_memecoin_${findMeme.id}_with_ton_10`)
    .row()
    .text("20 TON", `click_buy_memecoin_${findMeme.id}_with_ton_20`)
    .text("50 TON", `click_buy_memecoin_${findMeme.id}_with_ton_50`)
    .text("100 TON", `click_buy_memecoin_${findMeme.id}_with_ton_100`);
  let text = buildMemecoinInfoText(findMeme, findGroup, "🟢 Buy Memecoin");
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
