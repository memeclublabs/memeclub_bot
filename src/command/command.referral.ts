import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { createUser, queryUser } from "../util404";
import Env from "../env.cloudflare";
import { User404, USER_CREATED, USER_FOUND } from "../static404";

export function bind_command_referral(bot: Bot<MyContext>, env: Env) {
  bot.command("referral", async (ctx) => {
    let needDeleteMsg = true;
    // let isPublicChat = ctx.message?.chat?.type != "private";
    // if (isPublicChat) {
    //   await ctx
    //     .reply("Click @art404bot and open the bot to send 'referral' command. ")
    //     .catch((reason) => {
    //       console.error(reason);
    //     });
    //   return;
    // }
    let deleteMsgList: number[] = [];
    let senderUser = ctx.message?.from;
    if (senderUser) {
      let getRefCode = "";
      let tgId = "" + senderUser.id;
      let username = senderUser.username;
      if (!username) {
        username = tgId;
      }
      let db = env?.DB;
      if (db && tgId && username) {
        let queryRes = await queryUser(db, tgId);
        if (queryRes.success && USER_FOUND == queryRes.code) {
          let user404 = queryRes.result as User404;
          getRefCode = user404.refCode;
        } else {
          let result404 = await createUser(db, tgId, username);
          if (result404.success && result404.code == USER_CREATED) {
            getRefCode = result404.result.refCode;
          }
        }
        if (getRefCode) {
          let botName = env.TELEGRAM_BOT_NAME;
          let refLink = `https://t.me/${botName}?start=` + getRefCode;
          let msgSuccess = await ctx.reply(
            `ART 404 project is the first project to implement the semi-fungible token protocol on TON. We got  1st winner on TON Hong Kong Demo Day last month. This project was incubated by Kenetic Capital. Our goal is to make NFT flow and fly! \n\n Your personal ART-404 invite link, invite friends to earn points, redeem T404. \n\n <a href="${refLink}">${refLink}</a> `,
            {
              parse_mode: "HTML",
            },
          );
          if (needDeleteMsg && msgSuccess.message_id) {
            deleteMsgList.push(msgSuccess.message_id);
          }

          let msgSuccessCn = await ctx.reply(
            `ART 404项目是第一个在TON上实现半同质化代币协议的项目。我们在上个月的 TON Hong Kong Demo Day 上获得了第一名。同时本项目由 Kenetic Capital 孵化。我们的目标是让 NFT 自由流动和大规模采用！\n\n 下面是您的 ART-404 专属邀请链接，邀请朋友赢取积分，兑换 T404。 \n\n <a href="${refLink}">${refLink}</a> `,
            {
              parse_mode: "HTML",
            },
          );
          if (needDeleteMsg && msgSuccessCn.message_id) {
            deleteMsgList.push(msgSuccessCn.message_id);
          }
        }
      }
    } else {
      await ctx
        .reply("Parameters 404. Contact ART-404 Helpdesk. ")
        .catch((reason) => {
          console.error(reason);
        });
    }
  });
}
