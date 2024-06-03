import { Bot } from "grammy";
import { MyContext } from "../global.types";

export function on_member(bot: Bot<MyContext>) {
  // bot.on("my_chat_member", async (ctx) => {
  //   let botAdminId = ctx.config.botAdminId;
  //   let ctx_info = JSON.stringify(ctx);
  //   console.info(ctx_info);
  //
  //   let description;
  //   let from_operator = ctx.myChatMember.from.username;
  //   if (!from_operator) {
  //     from_operator = ""+ctx.myChatMember.from.id;
  //   }
  //   let id = ctx.myChatMember.chat.id;
  //   let chat = JSON.stringify(ctx.myChatMember.chat);
  //   let chat_type = ctx.myChatMember.chat?.type;
  //
  //   // let status: "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
  //   let status = ctx.myChatMember.new_chat_member.status;
  //   if (
  //     chat_type == "channel" ||
  //     chat_type == "group" ||
  //     chat_type == "supergroup"
  //   ) {
  //     description = `I have been add to ${chat_type} by ${from_operator} as ${status} from ${chat}. `;
  //     if (
  //       status == "member" ||
  //       status == "creator" ||
  //       status == "administrator"
  //     ) {
  //       let adminList = await ctx.api.getChatAdministrators(
  //         ctx.myChatMember.chat.id,
  //       );
  //       // creator of group/channel: "status": "creator",
  //       // admin of group/channel added by creator: "status": "administrator",
  //       let admins = JSON.stringify(adminList);
  //
  //       let memberCount = await ctx.api.getChatMemberCount(
  //         ctx.myChatMember.chat.id,
  //       );
  //
  //       description = ` ${description} . Member Count ${memberCount}. admin list ${admins} `;
  //     }
  //   } else if (chat_type == "private") {
  //     description = `I have a ${chat_type} chat with ${from_operator} as chat ${status} from ${chat}`;
  //   }
  //
  //   if (status == "left") {
  //     description = `I have been ${status} by ${from_operator} from ${chat} `;
  //   } else if (status == "kicked") {
  //     description = `I have been ${status} by ${from_operator} from ${chat} `;
  //   } else if (status == "restricted") {
  //     description = `I have been ${status} by ${from_operator} from ${chat} `;
  //   }
  //
  //   //${description} \n\n<code class='language-json'> ${ctx_info} </code>
  //   await ctx.api
  //     .sendMessage(botAdminId, `${description} \n\n`, {
  //       parse_mode: "HTML",
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // });

  // bot.on("chat_member", async (ctx) => {
  //   let ctx_info = JSON.stringify(ctx);
  //   console.info("============== chat_member ================== ");
  //   console.info(ctx_info);
  //   console.info("============== chat_member ================== ");
  //
  //   //${description} \n\n<code class='language-json'> ${ctx_info} </code>
  //   await ctx.reply("welcome");
  // });
}
