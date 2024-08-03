import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { FROM_GROUP_VIEW_MEME } from "../com.static";
import {
  group_start_menu,
  start_menu,
  startCaptionText,
} from "../plugin.menu.start";
import { createNewUser } from "../service/user/user.dao";
import { sendPrivateChatMemecoinInfo } from "../service/msg/tg.msg.private.meme.info";

export function bind_command_start(bot: Bot<MyContext>) {
  bot.command("start", async (ctx) => {
    //判断是私聊还是群聊，发送不同的菜单
    console.info(
      "command - /start [",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );

    if (ctx.chat.type == "private") {
      // 这是私聊，发送全量菜单，创建用户
      //1.  判断消息来源的operator，按需创建用户
      let tgId = ctx.from?.id;
      if (tgId && ctx.from) {
        // 1.1 send start menu
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

        if (!userById) {
          //1.2 create user
          await createNewUser(ctx);
        }
        // 1.3 if click meme btn, send meme info
        let match = ctx.match;
        if (match.startsWith(FROM_GROUP_VIEW_MEME)) {
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
    console.info(
      "command - /start ]",
      ctx.from?.username,
      "chatId=",
      ctx.from?.id,
    );
  });
}
