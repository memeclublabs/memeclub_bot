import { Bot, InlineKeyboard } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export function on_add_to_group(bot: Bot<MyContext>) {
  // 处理按钮点击事件
  bot.callbackQuery("create_meme_callback", async (ctx) => {
    await ctx.conversation.enter("new_meme");
  });

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
      let opIgId = ctx.myChatMember.from.id;
      let opFirstName = ctx.myChatMember.from.first_name;
      let opLastName = ctx.myChatMember.from.last_name;
      let opDisplayName = `${opFirstName} ${opLastName}`;

      // let status: "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
      let chatMemberStatus = ctx.myChatMember.new_chat_member.status;
      let userById = await prisma.user.findUnique({
        where: { tgId: opIgId },
      });
      if (!userById) {
        console.error(`admin user not found by id ${opIgId}`);
        return;
      }

      if (chatMemberStatus == "member" || chatMemberStatus == "administrator") {
        let chatMemberCount = await ctx.api.getChatMemberCount(
          ctx.myChatMember.chat.id,
        );

        const insertData = {
          chatId: chatId,
          chatType: chatType,
          chatTitle: "" + chatTitle,
          chatUsername: chatUsername,
          inviterTgId: opIgId,
          botId: ctx.myChatMember.new_chat_member.user.id,
          botUsername: "" + ctx.myChatMember.new_chat_member.user.username,
          botStatus: chatMemberStatus,
          memberCount: chatMemberCount,
          createBy: opIgId,
        } satisfies Prisma.ChatCreateInput;

        const updateData = {
          chatId: chatId,
          chatType: chatType,
          chatTitle: "" + chatTitle,
          chatUsername: chatUsername,
          inviterTgId: opIgId,
          botStatus: chatMemberStatus,
          memberCount: chatMemberCount,
          modifyBy: opIgId,
        } satisfies Prisma.ChatUpdateInput;
        let newChat = await prisma.chat.upsert({
          where: { chatId: chatId },
          create: insertData,
          update: updateData,
        });
        console.info(`new ${chatType} chat upsert. ${newChat.id}`);

        let addToChatCaption = `
<b>🎉 Add to group successfully.</b>\n
        - Group name: ${chatTitle}
        - Member count: ${chatMemberCount}\n

⭐Your Meme Points: + 200
`;

        let inlineKeyboard = new InlineKeyboard().text(
          "Step 2: Create new Meme coin",
          "create_meme_callback",
        );

        await ctx.api
          .sendMessage(opIgId, addToChatCaption, {
            parse_mode: "HTML",
            reply_markup: inlineKeyboard,
          })
          .catch((e) => {
            console.error(e);
          });

        await ctx.api
          .sendMessage(
            chatId,
            `added by ${opDisplayName} to this group, will fair launch memecoins. `,
            {
              parse_mode: "HTML",
            },
          )
          .catch((e) => {
            console.error(e);
          });
      } else {
        // 去除 member ，admin 和 creator，还有如下 3个状态
        // let status: "restricted" | "left" | "kicked"
        let findChat = await prisma.chat.findUnique({
          where: { chatId: chatId },
        });
        if (findChat) {
          await prisma.chat.update({
            where: { chatId: chatId },
            data: { botStatus: chatMemberStatus },
          });
          console.info(
            `Chat ${findChat.chatId} botStatus updated from ${findChat.botStatus} to ${chatMemberStatus}`,
          );
        }
        // await prisma.user.findUnique({ where: { tgId: tgId }});
      } //end join group / channel
    } //end chat in group / channel loop
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
