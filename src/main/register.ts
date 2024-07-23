import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { register_config } from "../middleware.ctx.config";
import { bind_command } from "../command/command";
import { on_message } from "../message/message";
import { on_member } from "../member/on.member";
import Env from "../env.cloudflare";
import { on_add_to_group } from "../my_chat_member/on.add.to.group";

export function register(bot: Bot<MyContext>, env: Env) {
  register_config(bot);
  bind_command(bot, env);
  on_message(bot, env);
  on_member(bot, env);
  on_add_to_group(bot, env);
}
