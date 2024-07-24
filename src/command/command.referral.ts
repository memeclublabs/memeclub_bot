import { Bot } from "grammy";
import { MyContext } from "../global.types";
import Env from "../env.cloudflare";

export function bind_command_referral(bot: Bot<MyContext>, env: Env) {
  bot.command("referral", async (ctx) => {});
}
