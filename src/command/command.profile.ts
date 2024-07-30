import { Bot } from "grammy";
import { MyContext } from "../global.types";

export function bind_command_profile(bot: Bot<MyContext>) {
  bot.command("profile", async (ctx) => {
    console.info("command - /profile [", ctx.from?.username);
    console.info("command - /profile ]", ctx.from?.username);
  });
}
