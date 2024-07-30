import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { tonConnectInfoKeyboard } from "../service/use.ton-connect";

export function bind_command_connect(bot: Bot<MyContext>) {
  bot.command("connect", async (ctx) => {
    console.info("command - /connect [", ctx.from?.username, Date.now());

    const chatId = ctx.msg.chat.id;
    await tonConnectInfoKeyboard(ctx, chatId);
    console.info("command - /connect ]", ctx.from?.username, Date.now());
  });
}
