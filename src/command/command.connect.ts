import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handleConnectCommand } from "../service/ton-connect-commands-handlers";

export function bind_command_connect(bot: Bot<MyContext>) {
  bot.command("connect", async (ctx) => {
    console.info(
      "command - /connect [",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );

    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }
    await handleConnectCommand(ctx);
    console.info(
      "command - /connect ]",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
  });
}
