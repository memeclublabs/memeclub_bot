import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { getConnector } from "../ton-connect/connector";
import { contactAdminWithError } from "../com.utils";

export function bind_command_disconnect(bot: Bot<MyContext>) {
  bot.command("disconnect", async (ctx) => {
    console.info("command - /disconnect [", ctx.from?.username, Date.now());
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }
    const connector = getConnector(chatId);
    await connector.restoreConnection();
    if (!connector.connected) {
      await ctx.reply("You didn't connect a wallet");
      return;
    }
    console.info("before call connector.disconnect()");
    await connector.disconnect();
    console.info("after call connector.disconnect()");
    await ctx.reply("Wallet has been disconnected");
    console.info("command - /disconnect ]", ctx.from?.username, Date.now());
  });
}
