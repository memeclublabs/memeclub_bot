import { Bot } from "grammy";
import { MyContext } from "../global.types";
import Env from "../env.cloudflare";

export function on_add_to_group(bot: Bot<MyContext>, env: Env) {
  bot.on("my_chat_member", async (ctx) => {
    console.info("my_chat_member，");
    //1. 读取 chat 发生地，是私聊还是群聊
    //1.1 忽略私聊 chat_type == "private"
    //1.2 不管是群组还是频道，都算有效的添加
    let chat_id = ctx.myChatMember.chat?.id;
    let chat_type = ctx.myChatMember.chat?.type;
    let chat_title = ctx.myChatMember.chat?.title;
    let chat_username = ctx.myChatMember.chat?.username;
    if (
      chat_type == "channel" ||
      chat_type == "group" ||
      chat_type == "supergroup"
    ) {
      let operatorId = ctx.myChatMember.from.id;
      let firstName = ctx.myChatMember.from.first_name;
      let lastName = ctx.myChatMember.from.last_name;
      let displayName = `${firstName} ${lastName}`;

      await ctx.api
        .sendMessage(
          operatorId,
          `Added by ${displayName} to ${chat_type} ${chat_title} \n\n`,
          {
            parse_mode: "HTML",
          },
        )
        .catch((e) => {
          console.error(e);
        });

      await ctx.api
        .sendMessage(
          chat_id,
          `added by ${displayName} to this group, will fair launch memecoins. \n\n`,
          {
            parse_mode: "HTML",
          },
        )
        .catch((e) => {
          console.error(e);
        });
    }
  });
}
