import { Bot } from "grammy";
import { MyContext } from "../global.types";

export function bind_command_referral(bot: Bot<MyContext>) {
  bot.command("referral", async (ctx) => {});
}
