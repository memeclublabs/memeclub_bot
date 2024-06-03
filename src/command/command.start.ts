import { Bot, InputFile } from "grammy";
import { MyContext } from "../global.types";
import { Menu } from "@grammyjs/menu";
import Env from "../env.cloudflare";
import { createUser, queryUser, queryUserByRefCode } from "../util404";
import {
  User404,
  USER_CREATED,
  USER_CREATED_WITH_REF,
  USER_FOUND,
} from "../static404";

export function bind_command_start(bot: Bot<MyContext>, env: Env) {
  let withPleasure = "*Meme Club AI*:  Bring AI and utility to Memes\\!";

  const home_menu = new Menu<MyContext>("home_menu")
    .url("💎 Open App  ", "https://t.me/meme_club_bot/app")
    .row()

    .submenu("🎉 Join Community", "community_menu")
    .row();
  const community_menu = new Menu<MyContext>("community_menu")
    .url("👥 Chat Group", "https://t.me/meme_club_chat")
    .row()
    .url("🎉 Official Channel", "https://t.me/meme_club_news")
    .row()
    .url("𝕏 Twitter @memeclubxyz", "https://x.com/memeclubai")
    .row()
    .url("🌎 Official Website", "https://memeclub.ai/")
    .row()
    .back("◀️ Go Back");


  home_menu.register(community_menu);
  bot.use(home_menu);

  bot.command("start", async (ctx) => {
    await ctx.replyWithPhoto("https://memeclub-website.pages.dev/greenpink-with-black-bg.png");
    await ctx
      .reply(withPleasure, {
        parse_mode: "MarkdownV2",
        reply_markup: home_menu,
      })
      .catch((reason) => {
        console.error(reason);
      });

    let match = ctx.match;
  });

  bot.command("twitter", async (ctx) => {
    await ctx
      .reply("[𝕏 Twitter](https://x.com/memeclubai) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });

  bot.command("group", async (ctx) => {
    await ctx
      .reply("[👥 Join Chat Group](https://t.me/meme_club_chat) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });

  bot.command("news", async (ctx) => {
    await ctx
      .reply("[🎉 Join Official Channel](https://t.me/meme_club_news) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });
}
