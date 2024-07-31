import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError } from "../com.utils";
import { InlineKeyboard } from "grammy";

export async function handleBuyMemecoin(ctx: MyContext, memecoinId: number) {
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
    .text("1", "11")
    .text("2", "22")
    .row();

  // await ctx.answerCallbackQuery({
  //   text: "You were curious, indeed! " + memecoinId,
  // });

  // await ctx.reply("inlineKeyboard", { reply_markup: inlineKeyboard });
}
