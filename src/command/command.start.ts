import { Bot, InputFile } from "grammy";
import { MyContext } from "../global.types";
import { Menu } from "@grammyjs/menu";
import Env from "../env.cloudflare";

import { dbClient } from "../db-prisma";

const startCaptionText: string =
  "<b>#1 Meme launchpad on TON </b>\n\nMake Memecoins Great Again";

const backCaptionText: string =
  "<b>#1 Meme launchpad on TON </b>\n\nMake sure the memecoins revolution happens on TON";

let newMemeCaption = `
<b>[ How it works ?]</b>\n
Step 1: Add this bot to your group or channel.\n
Step 2: Create new meme coin with few or ZERO gas cost.\n
Step 3: Buy the meme coin on the bonding curve.\n
Step 4: Sell at any time to lock in your profits or losses.\n
Step 5: When enough people buy on the bonding curve it reaches a pool of 1,000 TON.\n
Step 6: All liquidity is then deposited in DEX(DeDust or STON fi) and burned.\n
`;

export function bind_command_start(bot: Bot<MyContext>, env: Env) {
  const start_menu = new Menu<MyContext>("start_menu")
    .submenu("🚀 Create Meme ", "create_meme_menu", async (ctx) => {
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

  let addGroupUrl = `https://t.me/${env.TELEGRAM_BOT_NAME}?startgroup=true`;
  console.info(addGroupUrl);
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

  bot.command("start", async (ctx) => {
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

    //   test
    let db = env?.DB;
    let prismaClient = dbClient(env?.DB);
    let prismaPromise = await prismaClient.user.findMany();
    await ctx.reply(JSON.stringify("user: " + JSON.stringify(prismaPromise)));
  });
}
