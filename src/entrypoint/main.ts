import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { register_config } from "../middleware.ctx.config";
import { bind_command } from "../command/command";
import { on_message } from "../message/message";
import { on_member } from "../member/on.member";
import Env from "../env.cloudflare";

export function main_entry_point(bot: Bot<MyContext>, env: Env) {
  register_config(bot);
  bind_command(bot, env);
  on_message(bot);
  on_member(bot);
}
