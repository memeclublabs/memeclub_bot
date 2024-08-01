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
    .text(
      "1 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###1`,
      }),
    )
    .text(
      "5 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###5`,
      }),
    )
    .text(
      "10 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###10`,
      }),
    )
    .row()
    .text(
      "25 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###25`,
      }),
    )
    .text(
      "50 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###50`,
      }),
    )
    .text(
      "100 TON",
      JSON.stringify({
        method: "clickBuyWithTon",
        data: `${findMeme.id}###0.1`,
      }),
    );
  let text = buildMemecoinInfoText(
    findMeme,
    findGroup,
    `🟢 Buy Memecoin #${findMeme.id}`,
  );
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
