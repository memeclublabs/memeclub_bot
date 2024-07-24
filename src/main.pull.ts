import { SocksProxyAgent } from "socks-proxy-agent";
import { MyContext } from "./global.types";
import { Bot } from "grammy";
import * as dotenv from "dotenv";
import prisma from "./prisma";
import { bind_command } from "./command/command";
import { on_message } from "./message/message";
import { on_member } from "./member/on.member";
import { on_add_to_group } from "./my_chat_member/on.add.to.group";
import { use_time_tracer } from "./middleware.tracker";

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
if (!token) throw new Error("BOT_TOKEN is unset");
export const bot = new Bot<MyContext>(token, config);
//
//                        Bot Init Section End
// ###########################################################################

// ===========================================================================
//                        Main Start
//

use_time_tracer(bot);

bind_command(bot);
on_message(bot);
on_member(bot);
on_add_to_group(bot);

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
