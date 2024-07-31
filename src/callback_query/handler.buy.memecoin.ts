import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError } from "../com.utils";
import { InlineKeyboard, Keyboard } from "grammy";

export async function handleBuyMemecoin(ctx: MyContext, memecoinId: number) {
  let findMeme = await prisma.memecoin.findUnique({
    where: { id: memecoinId },
  });
  if (!findMeme) {
    await contactAdminWithError(ctx, `${memecoinId} not found`);
    return;
  }

  let inlineKeyboard = new InlineKeyboard()
    .text("1", "11")
    .text("2", "22")
    .row()
    .text("3", "33");

  // await ctx.answerCallbackQuery({
  //   text: "You were curious, indeed! " + memecoinId,
  // });

  // await ctx.reply("inlineKeyboard", { reply_markup: inlineKeyboard });

  const keyboard = new Keyboard()
    .text("Buy 1 TON")
    .row()
    .text("Buy 10 TON")
    .row()
    .text("Buy 100 TON")
    .resized();
  // Send keyboard with message.
  await ctx.reply("Buy", {
    reply_markup: keyboard,
  });
}
