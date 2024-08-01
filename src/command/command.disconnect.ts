import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handleDisconnectCommand } from "../service/ton-connect-commands-handlers";

export function bind_command_disconnect(bot: Bot<MyContext>) {
  bot.command("disconnect", async (ctx) => {
    console.info(
      "command - /disconnect [",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }

    await handleDisconnectCommand(ctx);
    console.info(
      "command - /disconnect ]",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
  });
}
