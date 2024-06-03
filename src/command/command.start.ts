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
  let withPleasure = "*ART\\-404*:  Make NFT Flow and Fly\\!";

  const home_menu = new Menu<MyContext>("home_menu")
    .url("💎 Open App  ", "https://t.me/art404bot/app")
    .row()

    .submenu("🎉 Join Community", "community_menu")
    .row();
  const community_menu = new Menu<MyContext>("community_menu")
    .url("👥 Chat Group", "https://t.me/art404chat")
    .row()
    .url("🎉 Official Channel", "https://t.me/art404news")
    .row()
    .url("𝕏 Twitter @art404xyz", "https://x.com/art404xyz")
    .row()
    .url("🌎 Official Website", "https://art-404.xyz/")
    .row()
    .back("◀️ Go Back");


  home_menu.register(community_menu);
  bot.use(home_menu);

  bot.command("start", async (ctx) => {
    await ctx.replyWithPhoto("https://art-404.xyz/diamonds/A2_FrancescoPetrarca.webp");
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
      .reply("[𝕏 Twitter](https://x.com/art404xyz) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });

  bot.command("group", async (ctx) => {
    await ctx
      .reply("[👥 Join ART\\-404 Chat Group](https://t.me/art404chat) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });

  bot.command("news", async (ctx) => {
    await ctx
      .reply("[🎉 Join ART\\-404 Official Channel](https://t.me/art404news) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });
}
