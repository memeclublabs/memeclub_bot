import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";

export function bind_command_disconnect(bot: Bot<MyContext>) {
  bot.command("disconnect", async (ctx) => {
    console.info("command - /disconnect [", ctx.from?.username, Date.now());
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }

    console.info("command - /disconnect ]", ctx.from?.username, Date.now());
  });
}
