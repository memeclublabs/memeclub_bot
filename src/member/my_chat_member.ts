import { Bot, InlineKeyboard } from "grammy";
import { MyContext } from "../global.types";
import dbPrisma from "../db.prisma";
import { Group, Prisma } from "@prisma/client";
import { processByCoinStatus } from "../service/memecoin.process.by.status";

export function on_my_chat_member(bot: Bot<MyContext>) {
  bot.on("my_chat_member", async (ctx) => {
    //1. 读取 chat 发生地，是私聊还是群聊
    //1.1 忽略私聊 chat_type == "private"
    //1.2 只有添加到群组才有效，忽略 channel
    let chatId = ctx.myChatMember.chat?.id;
    let chatType = ctx.myChatMember.chat?.type;
    let chatTitle = ctx.myChatMember.chat?.title;
    let chatUsername = ctx.myChatMember.chat?.username;
    if (chatType == "group" || chatType == "supergroup") {
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

        let findGroup = await dbPrisma.group.findUnique({
          where: { groupId: chatId },
        });
        let realGroup: Group | undefined;
        if (findGroup) {
          // 准备按需更新
          // 判断群组绑定的 mainBotId 是否是本 bot，有可能本项目有多个 bot 实例
          // 如果是本 bot 就更新，否则先跳过
          if (
            findGroup.mainBotId ==
            BigInt(ctx.myChatMember.new_chat_member.user.id)
          ) {
            // 更新会更新邀请人，这将影响群组内的新用户邀请码
            const updateData = {
              groupTitle: "" + chatTitle,
              groupUsername: chatUsername,
              inviterTgId: opIgId,
              botStatus: chatMemberStatus,
              memberCount: chatMemberCount,
              modifyBy: opIgId,
            } satisfies Prisma.GroupUpdateInput;

            realGroup = await dbPrisma.group.update({
              where: { groupId: chatId },
              data: updateData,
            });
          } else {
            // TODO:  mainBotId 不是本 bot, 先忽略这个情况，将来再支持
            console.error("mainBotId is another bot, pending support.");
          }
        } else {
          // 创建
          const insertData = {
            groupId: chatId,
            groupType: chatType,
            groupTitle: "" + chatTitle,
            groupUsername: chatUsername,
            inviterTgId: opIgId,
            mainBotId: ctx.myChatMember.new_chat_member.user.id,
            mainBotUsername:
              "" + ctx.myChatMember.new_chat_member.user.username,
            botStatus: chatMemberStatus,
            memberCount: chatMemberCount,
            createBy: opIgId,
          } satisfies Prisma.GroupCreateInput;
          realGroup = await dbPrisma.group.create({ data: insertData });
        }

        if (realGroup) {
          if (realGroup.mainMemecoinId) {
            // 下面这个方法，会根据 Memecoin 的状态来发送不同的消息
            console.info(
              "on.add.to.group.ts => bot 重复加入一个群(kicked 后再加入)",
            );
            await processByCoinStatus(
              ctx,
              opIgId,
              realGroup.mainMemecoinId,
              realGroup.groupTitle,
            );
          } else {
            let addToChatCaption = `
<b>🎉 Add to group successfully.</b>\n
        - <b>Group Name</b>: ${chatTitle}
        - <b>Member Count</b>: ${chatMemberCount}\n

⭐Your Meme Points: + 200
`;
            let inlineKeyboard = buildStep2Keyboard(realGroup.groupId);
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
                `<b>🥇#1 Memecoin launchpad on TON </b>

This bot was invited by 👑${opDisplayName}.
Both of you will get a referral award if you join.\n
Let's pump a new Memecoin and have fun together!
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
        // 下面是处理 bot 被剔除群组的情况
        console.info(
          ` new chatMemberStatus ${chatMemberStatus} at chat ${chatId}`,
        );
        // 去除 member ，admin 和 creator，还有如下 3个状态
        // let status: "restricted" | "left" | "kicked"
        let findChat = await dbPrisma.group.findUnique({
          where: { groupId: chatId },
        });
        if (findChat) {
          await dbPrisma.group.update({
            where: { groupId: chatId },
            data: {
              botStatus: chatMemberStatus,
              modifyBy: ctx.myChatMember?.from.id,
            },
          });
          console.info(
            `Chat ${findChat.groupId} botStatus updated from ${findChat.botStatus} to ${chatMemberStatus}`,
          );
        }
        // await prisma.user.findUnique({ where: { tgId: tgId }});
      } //end join group / channel
    } //end chat in group / channel loop
  });
}

function buildStep2Keyboard(groupId: bigint) {
  return new InlineKeyboard().text(
    "Step 2: Create new Memecoin",
    `callback_create_meme_groupId_${groupId}`,
  );
}
