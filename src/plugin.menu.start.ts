import { Bot } from "grammy";
import { MyContext } from "./global.types";
import { Menu } from "@grammyjs/menu";
import prisma from "./prisma";
import { listAirdrop } from "./service/msg/tg.msg.airdrop";
import { contactAdminWithError } from "./com.utils";
import { handleConnectCommand } from "./service/ton-connect-commands-handlers";
import { listMyMemes } from "./service/msg/tg.msg.list.my";
import { listNewMemes } from "./service/msg/tg.msg.list.new";

export const group_start_menu = new Menu<MyContext>("group_start_menu");
export const start_menu = new Menu<MyContext>("start_menu");

export function use_menu_plugin_start(bot: Bot<MyContext>) {
  group_start_menu
    .submenu("🤡 How it works?", `submenu_how_it_works`, async (ctx) => {
      await ctx
        .editMessageCaption({ caption: newMemeCaption, parse_mode: "HTML" })
        .then((r) => {});
    })
    .row()
    .dynamic(async (ctx, range) => {
      let referCode = ctx.session?.referCode;

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

  const submenu_how_it_works = new Menu<MyContext>("submenu_how_it_works").back(
    "◀️ Go Back",
    async (ctx) => {
      await ctx
        .editMessageCaption({ caption: startCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    },
  );

  start_menu
    .submenu("🚀 Create Memecoin", "submenu_create_meme", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: newMemeCaption, parse_mode: "HTML" })
        .then((r) => {});
    })
    .row()
    .text("🌟 New Listing", async (ctx) => {
      await listNewMemes(ctx);
    })
    .text("🤡 My Memes", async (ctx) => {
      await listMyMemes(ctx);
    })
    .row()
    .text("💎 My Wallet", async (ctx) => {
      let start = Date.now();
      console.info("DEBUG: ======== click [💎 My Wallet]", start);
      const userTgId = ctx.from?.id;
      if (userTgId) {
        const chatId = ctx.from?.id;
        if (!chatId) {
          await contactAdminWithError(ctx);
          return;
        }
        await handleConnectCommand(ctx);
      } else {
        console.error("call 💎 My Wallet - userTgId is null");
      }
      console.info(
        "DEBUG: ======== end [💎 My Wallet]. time elapse:",
        Date.now() - start,
      );
    })
    .submenu("⚙️ Settings", "submenu_settings")
    .row()
    .text("🎁 Airdrop & Referral", async (ctx) => {
      await listAirdrop(ctx);
    });

  let addGroupUrl = `https://t.me/${process.env.TELEGRAM_BOT_NAME}?startgroup=true`;
  const submenu_create_meme = new Menu<MyContext>("submenu_create_meme")
    .url("Step 1: Add bot to your group", addGroupUrl)
    .row()
    .back("◀️ Go Back", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: backCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    });

  const submenu_settings = new Menu<MyContext>("submenu_settings")
    .url("👥 Chat Group", "https://t.me/memeclub_chats")
    .url("📣 News Channel", "https://t.me/memeclub_news")
    .row()
    .url("𝕏 Twitter", "https://x.com/memeclubai")
    .url("🌎 Website", "https://www.memeclub.ai/")
    .row()
    .url("🙋‍♂️ Help", "https://telegra.ph/Memeclub-Document-08-02")
    .url("📒 FAQ", "https://telegra.ph/Memeclub-FAQ-08-02")
    .row()
    .text("🔔 Notification ", async (ctx) => {
      await ctx.reply(
        "🔔 You can define different notification rules for different groups. This function is under development. Stay tuned for further updates.",
      );
    })
    .text("🇬🇧 Languages ", async (ctx) => {
      await ctx.reply(
        "🇬🇧 The multi-language switching function is under development. Stay tuned for further updates.",
      );
    })
    .row()
    .back("◀️ Go Back", async (ctx) => {
      await ctx
        .editMessageCaption({ caption: startCaptionText, parse_mode: "HTML" })
        .then((r) => {});
    });

  start_menu.register(submenu_create_meme);
  start_menu.register(submenu_settings);
  bot.use(start_menu);

  group_start_menu.register(submenu_how_it_works);
  bot.use(group_start_menu);
}

export const startCaptionText: string =
  "<b>#1 Memecoin launchpad on TON </b>\n\nMake Memes Great Again";

const backCaptionText: string =
  "<b>#1 Memecoin launchpad on TON </b>\n\nMake sure the memecoins revolution happens on TON";

let newMemeCaption = `
<b>[ How it works ?]</b>\n
Step 1: Add this bot to a group where you have an admin role.\n
Step 2: Create new Memecoin with zero gas cost!\n
Step 3: Buy the Memecoin on the bonding curve. Sell at any time to lock in your profits or losses.\n
Step 4: When enough people buy on the bonding curve it reaches a pool of 1,000 TON.\n
Step 5: All liquidity is then deposited in DEX(DeDust or STON fi) and burned.\n
`;
