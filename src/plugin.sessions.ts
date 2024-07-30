import { Bot, session } from "grammy";
import { MyContext, SessionData } from "./global.types";

export function use_sessions_plugin(bot: Bot<MyContext>) {
  // Install the session plugin.
  function initial(): SessionData {
    return {};
  }
  bot.use(
    session({
      initial,
    }),
  );
}
