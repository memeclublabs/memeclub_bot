import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { Menu } from "@grammyjs/menu";
import prisma from "../prisma";
import { Prisma, User } from "@prisma/client";
import { FROM_GROUP_VIEW_MEME, Invite_ } from "../static";
import { generateReferralCode } from "../referral";
import {
  listNewMemes,
  sendPrivateChatMemecoinInfo,
} from "../service/msg/tg.msg.sender";
import { tonConnectMenu } from "../service/use.ton-connect";

const startCaptionText: string =
  "<b>#1 Memecoin launchpad on TON </b>\n\nMake Memecoins Great Again";

const backCaptionText: string =
  "<b>#1 Memecoin launchpad on TON </b>\n\nMake sure the memecoins revolution happens on TON";

let newMemeCaption = `
<b>[ How it works ?]</b>\n
Step 1: Add this bot to a group where you have an admin role.\n
Step 2: Create new Memecoin with few or zero gas cost.\n
Step 3: Buy the Memecoin on the bonding curve. Sell at any time to lock in your profits or losses.\n
Step 4: When enough people buy on the bonding curve it reaches a pool of 1,000 TON.\n
Step 5: All liquidity is then deposited in DEX(DeDust or STON fi) and burned.\n
`;

export function bind_command_start(bot: Bot<MyContext>) {
  const group_start_menu = new Menu<MyContext>("group_start_menu")
    .submenu("🤡 How it works?", `how_it_works_menu`, async (ctx) => {
      await ctx
        .editMessageCaption({ caption: newMemeCaption, parse_mode: "HTML" })
        .then((r) => {});
    })
    .row()
    .dynamic(async (ctx, range) => {
      let referCode = ctx.session.referCode;

      if (!referCode) {
        if (ctx.chat?.id) {
          let findChat = await prisma.group.findUnique({
            where: { groupId: ctx.chat.id },
          });

          if (findChat && findChat.inviterTgId) {
            let findUser = await prisma.user.findUnique({
              where: { tgId: findChat.inviterTgId },
            });
            if (findUser && findUser.refCode) {
              referCode = findUser?.refCode;
            }
          }
        }
      }
      console.info(`real referCode ${referCode} for group ${ctx.chat?.id}`);
      range.url(
        "🎁 Airdrop & Referral",
        `https://t.me/${process.env.TELEGRAM_BOT_NAME}?start=${referCode}`,
      );
    });

  const how_it_works_menu = new Menu<MyContext>("how_it_works_menu").back(
    "◀️ Go Back",
    async (ctx) => {
      await ctx
        .editMessageCaption({ caption: startCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    },
  );

  const start_menu = new Menu<MyContext>("start_menu")
    .submenu("🚀 Create Memecoin", "create_meme_menu", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: newMemeCaption, parse_mode: "HTML" })
        .then((r) => {});
    })
    .row()
    .text("🌟 New Listing", async (ctx) => {
      await listNewMemes(ctx);
    })
    .submenu("🤡 My Memes", "create_meme_menu")
    .row()
    .text("💎 My Wallet", async (ctx) => {
      let start = Date.now();
      console.info("DEBUG: ======== click [💎 My Wallet]", start);
      const chatId = ctx.msg?.chat.id;
      if (chatId) {
        await tonConnectMenu(ctx, chatId);
      } else {
        console.error("call 💎 My Wallet - chatId is null");
      }
      console.info(
        "DEBUG: ======== end [💎 My Wallet]. time elapse:",
        Date.now() - start,
      );
    })
    .submenu("⚙️ Setting", "create_meme_menu")
    .row()
    .submenu("🎁 Airdrop", "create_meme_menu");

  let addGroupUrl = `https://t.me/${process.env.TELEGRAM_BOT_NAME}?startgroup=true`;
  const create_meme_menu = new Menu<MyContext>("create_meme_menu")
    .url("Step 1: Add bot to your group", addGroupUrl)
    .row()
    .back("◀️ Go Back", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: backCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    });

  const community_menu = new Menu<MyContext>("community_menu")
    .url("👥 Chat Group", "https://t.me/meme_club_chat")
    .row()
    .url("🎉 Official Channel", "https://t.me/meme_club_news")
    .row()
    .url("𝕏 Twitter @memeclubai", "https://x.com/memeclubai")
    .row()
    .url("🌎 Official Website", "https://www.memeclub.ai/")
    .row()
    .back("◀️ Go Back", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: startCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    });

  start_menu.register(create_meme_menu);
  start_menu.register(community_menu);
  bot.use(start_menu);

  group_start_menu.register(how_it_works_menu);
  bot.use(group_start_menu);

  bot.command("start", async (ctx) => {
    //判断是私聊还是群聊，发送不同的菜单

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
        let userById = await prisma.user.findUnique({ where: { tgId: tgId } });
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
  });
}

function fromGroupClickMeme(ctx: MyContext) {}
