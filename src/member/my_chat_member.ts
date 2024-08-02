import { Bot, InlineKeyboard } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { Group, Prisma } from "@prisma/client";
import { processByCoinStatus } from "../service/memecoin.process.by.status";
import { ActionTypes } from "../com.enums";
import { updateUserActionUnified } from "../service/user/user.dao";

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
        let addGroupPoints = calculateAddGroupReward(chatMemberCount);

        let findGroup = await prisma.group.findUnique({
          where: { groupId: chatId },
        });
        let realGroup: Group | undefined;
        if (findGroup) {
          // 准备按需更新
          // 判断群组绑定的 mainBotId 是否是本 bot，有可能本项目有多个 bot 实例
          // 如果是本 bot 就更新，否则先跳过
          // todo： 已有群组，更新 id
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

            realGroup = await prisma.group.update({
              where: { groupId: chatId },
              data: updateData,
            });
          } else {
            // TODO:  mainBotId 不是本 bot, 先忽略这个情况，将来再支持
            console.error("mainBotId is another bot, pending support.");
          }
        } else {
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
          realGroup = await prisma.group.create({ data: insertData });

          await updateUserActionUnified(
            opIgId,
            ActionTypes.GroupAdd,
            BigInt(addGroupPoints),
          );
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

⭐Your Meme Points: + ${addGroupPoints}
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
        await processLeaveGroup(ctx, chatId, chatMemberStatus);
      } //end join group / channel
    } //end chat in group / channel loop
  });
}

async function processLeaveGroup(
  ctx: MyContext,
  chatId: number,
  chatMemberStatus:
    | "member"
    | "creator"
    | "administrator"
    | "restricted"
    | "left"
    | "kicked",
) {
  console.info(` new chatMemberStatus ${chatMemberStatus} at chat ${chatId}`);
  // 去除 member ，admin 和 creator，还有如下 3个状态
  // let status: "restricted" | "left" | "kicked"
  let findChat = await prisma.group.findUnique({
    where: { groupId: chatId },
  });
  if (findChat) {
    await prisma.group.update({
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
}

function buildStep2Keyboard(groupId: bigint) {
  return new InlineKeyboard().text(
    "Step 2: Create new Memecoin",
    JSON.stringify({ method: "createMemeConversation", data: `${groupId}` }),
  );
}

export function calculateAddGroupReward(input: number): number {
  if (input <= 5000) {
    return input;
  } else if (input > 5000 && input < 10000) {
    const additionalValue = Math.floor((input - 5000) / 1000) * 100;
    return 5000 + additionalValue;
  } else {
    return 6000;
  }
}
