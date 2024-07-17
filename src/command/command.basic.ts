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

export function bind_command_basic(bot: Bot<MyContext>, env: Env) {

  bot.command(["help", "community"], async (ctx) => {
    await ctx
        .reply("Community & Helpdesk [Memeclub Group](https://t.me/memeclub_chat) ", {
          parse_mode: "MarkdownV2",
        })
        .catch((reason) => {
          console.error(reason);
        });
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
