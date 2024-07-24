import { SocksProxyAgent } from "socks-proxy-agent";
import { MyContext } from "../global.types";
import { Bot } from "grammy";
import Env from "../env.cloudflare";
import * as dotenv from "dotenv";
import { register } from "./register";
import prisma from "../prisma";

// ===========================================================================
//                        Bot Init Section Start

dotenv.config(); // Load the environment variables
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
//
//                        Bot Init Section End
// ###########################################################################

// ===========================================================================
//                        Main Start
//
register(bot, {
  TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME,
  TELEGRAM_BOT_API_TOKEN: process.env.TELEGRAM_BOT_API_TOKEN,
  TELEGRAM_BOT_SECRET_TOKEN: process.env.TELEGRAM_BOT_SECRET_TOKEN,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
} as Env);

bot.catch((err) => {
  console.error("===============================");
  console.error("uncaught error occurred", err);
  console.error("// ############################");
});

//
//                        Main End
// ###########################################################################

// ===========================================================================
//                        Exit Section Start
//

process.once("SIGINT", async () => {
  await prisma.$disconnect();
  return bot.stop();
});
process.once("SIGTERM", async () => {
  await prisma.$disconnect();
  return bot.stop();
});
bot
  //   telegram bot update type full list
  //   https://core.telegram.org/bots/api#update
  // .start({ allowed_updates: ["message", "chat_member"] })
  .start()
  .then((e) => {
    console.info(e);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
  });
//
//                        Exit Section End
// ###########################################################################
