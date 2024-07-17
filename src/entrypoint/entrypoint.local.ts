import { SocksProxyAgent } from "socks-proxy-agent";
import { MyContext } from "../global.types";
import { main_entry_point } from "./main";
import { Bot } from "grammy";
import Env from "../env.cloudflare";

// ===========================================================================
//                        Bot Init Section Start
// ===========================================================================
let config = {};

if (process.env.NODE_ENV === "dev") {
  config = {
    client: {
      baseFetchConfig: {
        agent: new SocksProxyAgent("socks://127.0.0.1:7890"),
        compress: true,
      },
    },
  };
}
const token = process.env.BOT_TOKEN;
const telegramBotName = process.env.TELEGRAM_BOT_NAME;
if (!token) throw new Error("BOT_TOKEN is unset");
export const bot = new Bot<MyContext>(token, config);
// ###########################################################################
//                        Bot Init Section End
// ###########################################################################

// ===========================================================================
//                        Main Start
// ===========================================================================
main_entry_point(bot, {
  TELEGRAM_BOT_NAME: telegramBotName,
} as Env);
// ###########################################################################
//                        Main End
// ###########################################################################

// ===========================================================================
//                        Startup Section Start
// ===========================================================================
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
bot
  //   telegram bot update type full list
  //   https://core.telegram.org/bots/api#update
  // .start({ allowed_updates: ["message", "chat_member"] })
  .start()
  .then((e) => {
    console.info(e);
  })
  .catch((e) => {
    console.error(e);
  });
// ###########################################################################
//                        Startup Section End
// ###########################################################################
