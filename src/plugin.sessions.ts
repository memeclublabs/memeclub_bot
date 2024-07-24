import { Bot, session } from "grammy";
import { MyContext } from "./global.types";

export function use_sessions(bot: Bot<MyContext>) {
  // Install the session plugin.
  bot.use(
    session({
      initial() {
        // return empty object for now
        return {};
      },
    }),
  );
}
