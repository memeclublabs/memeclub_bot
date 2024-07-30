import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { bind_command_start } from "./command.start";
import { bind_command_profile } from "./command.profile";
import { bind_command_basic } from "./command.basic";
import { bind_command_my_wallet } from "./command.my_wallet";
import { bind_command_connect } from "./command.connect";
import { bind_command_disconnect } from "./command.disconnect";

export function bind_command(bot: Bot<MyContext>) {
  bind_command_start(bot);
  bind_command_basic(bot);
  bind_command_profile(bot);
  bind_command_connect(bot);
  bind_command_my_wallet(bot);
  bind_command_disconnect(bot);
}
