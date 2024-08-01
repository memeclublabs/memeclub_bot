import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handleSendTXCommand } from "../service/ton-connect-commands-handlers";

export function bind_command_send_tx(bot: Bot<MyContext>) {
  bot.command("send_tx", async (ctx) => {
    console.info(
      "command - /send_tx [",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );

    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }
    await handleSendTXCommand(ctx);
    console.info(
      "command - /send_tx ]",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
  });
}
