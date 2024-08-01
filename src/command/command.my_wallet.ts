import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";

export function bind_command_my_wallet(bot: Bot<MyContext>) {
  bot.command("my_wallet", async (ctx) => {
    console.info("command - /my_wallet [", ctx.from?.username, Date.now());
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }

    console.info("command - /my_wallet ]", ctx.from?.username, Date.now());
  });
}
