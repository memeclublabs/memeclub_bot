import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { createUser, queryUser, queryUserListByRefTgId } from "../util404";
import Env from "../env.cloudflare";
import { REF_USER_LIST_FOUND, User404, USER_FOUND } from "../static404";

export function bind_command_profile(bot: Bot<MyContext>, env: Env) {
  bot.command("profile", async (ctx) => {
    // let isPublicChat = ctx.message?.chat?.type != "private";
    // if (isPublicChat) {
    //   await ctx
    //     .reply("Click @art404bot and open the bot to send 'profile' command.  ")
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
    let db = env?.DB;
    if (db && tgId) {
      let queryNewUser = await queryUser(db, tgId);
      if (queryNewUser.success && USER_FOUND == queryNewUser.code) {
        let queryUserListResult = await queryUserListByRefTgId(db, tgId);
        if (
          queryUserListResult.success &&
          queryUserListResult.code == REF_USER_LIST_FOUND
        ) {
          let result = queryUserListResult.result;
          let count = result.length;
          await ctx.reply(
            `Total number of referral users: <pre><b>${count}</b></pre>`,
            {
              parse_mode: "HTML",
            },
          );
        } else {
          await ctx.reply(`Current number of referral users: <b>0</b>.`, {
            parse_mode: "HTML",
          });
        }
      } else {
        await ctx.reply(`User ${tgUsername} not found.  `, {
          parse_mode: "HTML",
        });
      }
    }
  });
}
