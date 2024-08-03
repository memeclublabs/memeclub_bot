import { MyContext } from "../global.types";
import { InlineKeyboard } from "grammy";

export async function triggerCoinsCreated(
  ctx: MyContext,
  tgId: string,
): Promise<void> {
  let inlineKeyboard = new InlineKeyboard();
  inlineKeyboard.text("aaa", "bbb");

  await ctx.editMessageReplyMarkup({ reply_markup: inlineKeyboard });
}
