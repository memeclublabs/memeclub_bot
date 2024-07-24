import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { bind_command_start } from "./command.start";
import { bind_command_referral } from "./command.referral";
import { bind_command_profile } from "./command.profile";
import { bind_command_basic } from "./command.basic";

export function bind_command(bot: Bot<MyContext>) {
  bind_command_start(bot);
  bind_command_basic(bot);
  bind_command_referral(bot);
  bind_command_profile(bot);
}
