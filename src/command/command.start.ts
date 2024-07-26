import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { Menu } from "@grammyjs/menu";
import prisma from "../prisma";
import { Prisma, User } from "@prisma/client";
import { MEME_ } from "../static";
import { generateReferralCode } from "../referral";

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
          let findChat = await prisma.chat.findUnique({
            where: { chatId: ctx.chat.id },
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
    .url("🌟 New Listing", "https://develop.memeclub-app.pages.dev/create")
    .url("🦄 Popular Memes", "https://develop.memeclub-app.pages.dev/create")
    .row()
    .submenu("💎 My Wallet", "create_meme_menu")
    .submenu("🤡 My Memes", "create_meme_menu")
    .row()
    .submenu("🇬🇧 Language", "create_meme_menu")
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
        let userById = await prisma.user.findUnique({ where: { tgId: tgId } });
        if (userById) {
          // user found
          await ctx.reply("Welcome back!");
        } else {
          //create user
          // https://t.me/your_bot?start=MEME_ABCDEFGHIJK
          let match = ctx.match;
          let haveRefer = false;
          let referUser: User | undefined = undefined;
          if (match.startsWith(MEME_)) {
            let userByRefCode = await prisma.user.findUnique({
              where: { refCode: match },
            });
            // if not find, userByRefCode is null
            if (userByRefCode) {
              haveRefer = true;
              referUser = userByRefCode;
              await ctx.reply(
                `You are invited by ${userByRefCode.firstName} ${userByRefCode.lastName}`,
              );
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

      await ctx
        .replyWithPhoto(
          "https://art404app.pages.dev/memebot/bot-img-memeclub.png",
          {
            caption: startCaptionText,
            parse_mode: "HTML",
            reply_markup: start_menu,
          },
        )
        .catch((reason) => {
          console.error(reason);
        });
    } else {
      // 这边是在群组中

      let findChat = await prisma.chat.findUnique({
        where: { chatId: ctx.chat.id },
      });

      if (findChat) {
        let findUser = await prisma.user.findUnique({
          where: { tgId: findChat.inviterTgId },
        });

        if (findUser) {
          console.info(
            `Session store code ${findUser.refCode} of ${findUser.firstName} ${findUser.lastName}`,
          );
          ctx.session.referCode = findUser.refCode;
        }
      }

      await ctx
        .replyWithPhoto(
          "https://art404app.pages.dev/memebot/bot-img-memeclub.png",
          {
            caption: startCaptionText,
            parse_mode: "HTML",
            reply_markup: group_start_menu,
          },
        )
        .catch((reason) => {
          console.error(reason);
        });
    } //in group
  });
}
