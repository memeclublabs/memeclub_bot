import { MyContext } from "../global.types";
import prisma from "../prisma";
import { buildMemecoinInfoText, contactAdminWithError } from "../com.utils";
import { InlineKeyboard } from "grammy";

export async function handlerClickSellBtn(ctx: MyContext, memecoinId: number) {
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
    .text("25%", `click_sell_memecoin_${findMeme.id}_percentage_25`)
    .text("50%", `click_sell_memecoin_${findMeme.id}_percentage_50`)
    .row()
    .text("75%", `click_sell_memecoin_${findMeme.id}_percentage_75`)
    .text("100%", `click_sell_memecoin_${findMeme.id}_percentage_100`);

  let text = buildMemecoinInfoText(findMeme, findGroup, "🟢 Buy Memecoin");
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
