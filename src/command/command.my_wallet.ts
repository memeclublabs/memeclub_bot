import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handleShowMyWalletCommand } from "../service/ton-connect-commands-handlers";

export function bind_command_my_wallet(bot: Bot<MyContext>) {
  bot.command("my_wallet", async (ctx) => {
    console.info(
      "command - /my_wallet command [",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }
    await handleShowMyWalletCommand(ctx);
    console.info(
      "command - /my_wallet ]",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
  });
}
