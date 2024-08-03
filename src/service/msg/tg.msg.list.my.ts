import { MyContext } from "../../global.types";
import { InlineKeyboard } from "grammy";

export async function listMyMemes(ctx: MyContext): Promise<void> {
  let inlineKeyboard = new InlineKeyboard();
  inlineKeyboard
    .text("Coins Created", "trigger")
    .row()
    .text("Coins Bought", "");
  await ctx.reply("", { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
