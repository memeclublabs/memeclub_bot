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
    .text(
      "25%",
      JSON.stringify({
        method: "processorClickSellWithPercentage",
        data: { json: { memecoinId: Number(findMeme.id), percentage: 25 } },
      }),
    )
    .text(
      "50%",
      JSON.stringify({
        method: "processorClickSellWithPercentage",
        data: { json: { memecoinId: Number(findMeme.id), percentage: 50 } },
      }),
    )
    .row()
    .text(
      "75%",
      JSON.stringify({
        method: "processorClickSellWithPercentage",
        data: { json: { memecoinId: Number(findMeme.id), percentage: 75 } },
      }),
    )
    .text(
      "100%",
      JSON.stringify({
        method: "processorClickSellWithPercentage",
        data: { json: { memecoinId: Number(findMeme.id), percentage: 100 } },
      }),
    );

  let text = buildMemecoinInfoText(findMeme, findGroup, "🔴 Sell Memecoin");
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
