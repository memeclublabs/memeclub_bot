import { Bot } from "grammy";
import { MyContext } from "../global.types";
import Env from "../env.cloudflare";

export function on_add_to_group(bot: Bot<MyContext>, env: Env) {
  bot.on("my_chat_member", async (ctx) => {
    console.info("my_chat_member，");
    //1. 读取 chat 发生地，是私聊还是群聊
    //1.1 忽略私聊 chat_type == "private"
    //1.2 不管是群组还是频道，都算有效的添加
    let chatId = ctx.myChatMember.chat?.id;
    let chatType = ctx.myChatMember.chat?.type;
    let chatTitle = ctx.myChatMember.chat?.title;
    let chatUsername = ctx.myChatMember.chat?.username;
    if (
      chatType == "channel" ||
      chatType == "group" ||
      chatType == "supergroup"
    ) {
      let opId = ctx.myChatMember.from.id;
      let opFirstName = ctx.myChatMember.from.first_name;
      let opLastName = ctx.myChatMember.from.last_name;
      let opDisplayName = `${opFirstName} ${opLastName}`;

      // let status: "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
      let status = ctx.myChatMember.new_chat_member.status;
      if (status == "member" || status == "administrator") {
        let adminList = await ctx.api.getChatAdministrators(
          ctx.myChatMember.chat.id,
        );
        // creator of group/channel: "status": "creator",
        // admin of group/channel added by creator: "status": "administrator",
        let admins = JSON.stringify(adminList);
        let memberCount = await ctx.api.getChatMemberCount(
          ctx.myChatMember.chat.id,
        );

        await ctx.api
          .sendMessage(
            opId,
            `Added by ${opDisplayName} to ${chatType} ${chatTitle} \n\n ${admins} \n memberCount=${memberCount}`,
            {
              parse_mode: "HTML",
            },
          )
          .catch((e) => {
            console.error(e);
          });

        await ctx.api
          .sendMessage(
            chatId,
            `added by ${opDisplayName} to this group, will fair launch memecoins. \n\n\n ${admins} \n${memberCount}`,
            {
              parse_mode: "HTML",
            },
          )
          .catch((e) => {
            console.error(e);
          });
      }
    } //end group / channel loop
  });
}

//
// [
//   {
//     user: {
//       id: 5499157826,
//       is_bot: false,
//       first_name: "Andrew 💎",
//       last_name: "Memeclub",
//       username: "andrew_tonx",
//       language_code: "en",
//       is_premium: true,
//     },
//     status: "creator",
//     is_anonymous: false,
//   },
// ];
