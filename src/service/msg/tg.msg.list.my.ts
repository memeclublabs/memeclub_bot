import { MyContext } from "../../global.types";
import { InlineKeyboard } from "grammy";

export async function listMyMemes(ctx: MyContext): Promise<void> {
  let inlineKeyboard = new InlineKeyboard();
  inlineKeyboard
    .text(
      "👑 Coins Created",
      JSON.stringify({
        method: "triggerCoinsCreated",
        data: `${ctx.from?.id}`,
      }),
    )
    .row()
    .text(
      "🪙 Coins Bought",
      JSON.stringify({
        method: "triggerCoinsBought",
        data: `${ctx.from?.id}`,
      }),
    );
  await ctx.reply("xxx", { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
