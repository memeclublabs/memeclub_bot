import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { Prisma, User } from "@prisma/client";
import { FROM_GROUP_VIEW_MEME, Invite_ } from "../com.static";
import { generateReferralCode } from "../com.referral";
import { sendPrivateChatMemecoinInfo } from "../service/msg/tg.msg.sender";
import {
  group_start_menu,
  start_menu,
  startCaptionText,
} from "../plugin.menu.start";

export function bind_command_start(bot: Bot<MyContext>) {
  bot.command("start", async (ctx) => {
    //判断是私聊还是群聊，发送不同的菜单
    console.info("command - /start [", ctx.from?.username, Date.now());

    if (ctx.chat.type == "private") {
      // 这是私聊，发送全量菜单，创建用户
      //1.  判断消息来源的operator，按需创建用户
      let tgId = ctx.from?.id;
      if (tgId && ctx.from) {
        await ctx
          .replyWithPhoto("https://www.memeclub.ai/bot/bot-img-memeclub.png", {
            caption: startCaptionText,
            parse_mode: "HTML",
            reply_markup: start_menu,
          })
          .catch((reason) => {
            console.error(reason);
          });
        let userById = await prisma.user.findUnique({
          where: { tgId: tgId },
        });
        if (userById) {
          let match = ctx.match;
          if (match.startsWith(FROM_GROUP_VIEW_MEME)) {
            // 通过群里点击 meme Buy/Sell 按钮加入，老用户要发送 Meme 菜单
            const memecoinId = match.split(FROM_GROUP_VIEW_MEME)[1];
            let findMeme = await prisma.memecoin.findUnique({
              where: { id: Number(memecoinId) },
            });
            if (findMeme) {
              let findGroup = await prisma.group.findUnique({
                where: { groupId: Number(findMeme.groupId) },
              });
              if (findGroup) {
                await sendPrivateChatMemecoinInfo(ctx, findGroup, findMeme);
              }
            }
          }
        } else {
          //create user
          // https://t.me/your_bot?start=Invite_ABCDEFGHIJK
          let match = ctx.match;
          let referUser: User | undefined = undefined;
          if (match.startsWith(Invite_)) {
            let userByRefCode = await prisma.user.findUnique({
              where: { refCode: match },
            });
            // if not find, userByRefCode is null
            if (userByRefCode) {
              referUser = userByRefCode;
              await ctx.reply(
                `You are invited by ${userByRefCode.firstName} ${userByRefCode.lastName}`,
              );
            }
          } else if (match.startsWith(FROM_GROUP_VIEW_MEME)) {
            // 通过群里点击 meme Buy/Sell 按钮加入，这个推荐关系要算到邀请人身上
            const memecoinId = match.split(FROM_GROUP_VIEW_MEME)[1];
            let findMeme = await prisma.memecoin.findUnique({
              where: { id: Number(memecoinId) },
            });
            if (findMeme) {
              let findGroup = await prisma.group.findUnique({
                where: { groupId: Number(findMeme.groupId) },
              });
              if (findGroup) {
                let findUser = await prisma.user.findUnique({
                  where: { tgId: findGroup.inviterTgId },
                });
                if (findUser) {
                  referUser = findUser;
                  console.info(
                    `${ctx.from.first_name} 通过群里点击 meme Buy/Sell 按钮加入，这个推荐关系要算到邀请人 ${referUser.firstName}身上`,
                  );
                }

                await sendPrivateChatMemecoinInfo(ctx, findGroup, findMeme);
              }
            }
          }
          const userData = {
            tgId: tgId,
            tgUsername: ctx.from.username,
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            refCode: generateReferralCode(tgId),
            isPremium: ctx.from.is_premium,
            langCode: ctx.from.language_code,
            createBy: tgId,
            ...(referUser ? { referBy: referUser.tgId } : {}),
          } satisfies Prisma.UserCreateInput;
          let newUser = await prisma.user.create({ data: userData });
          console.info(`new user created. ${newUser.id}`);
        }
      }
    } else {
      // 这边是在群组中
      let findGroup = await prisma.group.findUnique({
        where: { groupId: ctx.chat.id },
      });

      if (findGroup) {
        let findUser = await prisma.user.findUnique({
          where: { tgId: findGroup.inviterTgId },
        });

        if (findUser) {
          console.info(
            `Session store code ${findUser.refCode} of ${findUser.firstName} ${findUser.lastName}`,
          );
          ctx.session.referCode = findUser.refCode;
        }
      }

      await ctx
        .replyWithPhoto("https://www.memeclub.ai/bot/bot-img-memeclub.png", {
          caption: startCaptionText,
          parse_mode: "HTML",
          reply_markup: group_start_menu,
        })
        .catch((reason) => {
          console.error(reason);
        });
    } //in group
    console.info("command - /start ]", ctx.from?.username, Date.now());
  });
}

function fromGroupClickMeme(ctx: MyContext) {}
