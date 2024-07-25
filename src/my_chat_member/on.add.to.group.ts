import { Bot, InlineKeyboard } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { Chat, Prisma } from "@prisma/client";

export function on_add_to_group(bot: Bot<MyContext>) {
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
      // let status: "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
      let chatMemberStatus = ctx.myChatMember.new_chat_member.status;
      if (chatMemberStatus == "member" || chatMemberStatus == "administrator") {
        let chatMemberCount = await ctx.api.getChatMemberCount(
          ctx.myChatMember.chat.id,
        );

        let opIgId = ctx.myChatMember.from.id;
        let opFirstName = ctx.myChatMember.from.first_name;
        let opLastName = ctx.myChatMember.from.last_name;
        let opDisplayName = `${opFirstName} ${opLastName}`;

        let findChat = await prisma.chat.findUnique({
          where: { chatId: chatId },
        });
        let realChat: Chat | undefined;
        if (findChat) {
          // 准备按需更新
          if (
            findChat.mainBotId ==
            BigInt(ctx.myChatMember.new_chat_member.user.id)
          ) {
            // 判断 mainBotId 是否是本 bot，有可能本项目有多个 bot 实例
            // 如果是就更新，否则先跳过
            const updateData = {
              chatTitle: "" + chatTitle,
              chatUsername: chatUsername,
              inviterTgId: opIgId,
              botStatus: chatMemberStatus,
              memberCount: chatMemberCount,
              modifyBy: opIgId,
            } satisfies Prisma.ChatUpdateInput;

            realChat = await prisma.chat.update({
              where: { chatId: chatId },
              data: updateData,
            });
          } else {
            // TODO:  mainBotId 不是本 bot, 先忽略这个情况，将来再支持
            console.error("mainBotId is another bot, pending support.");
          }
        } else {
          // 创建
          const insertData = {
            chatId: chatId,
            chatType: chatType,
            chatTitle: "" + chatTitle,
            chatUsername: chatUsername,
            inviterTgId: opIgId,
            mainBotId: ctx.myChatMember.new_chat_member.user.id,
            mainBotUsername:
              "" + ctx.myChatMember.new_chat_member.user.username,
            botStatus: chatMemberStatus,
            memberCount: chatMemberCount,
            createBy: opIgId,
          } satisfies Prisma.ChatCreateInput;
          realChat = await prisma.chat.create({ data: insertData });
        }

        // let userById = await prisma.user.findUnique({
        //   where: { tgId: opIgId },
        // });
        // if (!userById) {
        //   console.error(`admin user not found by id ${opIgId}`);
        //   return;
        // }

        if (realChat) {
          if (realChat.mainMemecoinId) {
            await ctx.api
              .sendMessage(
                opIgId,
                `There already have a memecoin in group/channel.] `,
              )
              .catch((e) => {
                console.error(e);
              });
          } else {
            let addToChatCaption = `
<b>🎉 Add to group successfully.</b>\n
        - Group name: ${chatTitle}
        - Member count: ${chatMemberCount}\n

⭐Your Meme Points: + 200
`;

            let inlineKeyboard = new InlineKeyboard().text(
              "Step 2: Create new Memecoin",
              `callback_create_meme_chatId_${realChat.chatId}`,
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
                `<b>🥇#1 Memecoin launchpad on TON </b>\n
    This bot was invited by 👑${opDisplayName}.
    New users in this group will use his/her referral code.\n
    Let's create a new Memecoin and have fun together!
                `,

                {
                  parse_mode: "HTML",
                },
              )
              .catch((e) => {
                console.error(e);
              });
          }
        }
      } else {
        console.info(
          ` new chatMemberStatus ${chatMemberStatus} at chat ${chatId}`,
        );
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
