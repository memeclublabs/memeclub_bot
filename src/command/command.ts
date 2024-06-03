import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { bind_command_help } from "./command.help";
import { bind_command_start } from "./command.start";
import { bind_command_referral } from "./command.referral";
import Env from "../env.cloudflare";
import { bind_command_profile } from "./command.profile";

export function bind_command(bot: Bot<MyContext>, env: Env) {
  bind_command_start(bot, env);
  bind_command_help(bot);
  bind_command_referral(bot, env);
  bind_command_profile(bot, env);
}
