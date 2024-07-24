import { Bot } from "grammy";
import { MyContext } from "../global.types";
import Env from "../env.cloudflare";

export function bind_command_profile(bot: Bot<MyContext>, env: Env) {
  bot.command("profile", async (ctx) => {
    // let isPublicChat = ctx.message?.chat?.type != "private";
    // if (isPublicChat) {
    //   await ctx
    //     .reply("Click @memeclubbot and open the bot to send 'profile' command.  ")
    //     .catch((reason) => {
    //       console.error(reason);
    //     });
    //   return;
    // }

    let senderUser = ctx.message?.from;
    let tgId = "" + senderUser?.id;
    let tgUsername = senderUser?.username;
    if (!tgUsername) {
      tgUsername = tgId;
    }
  });
}
