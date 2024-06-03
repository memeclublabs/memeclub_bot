import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { Menu } from "@grammyjs/menu";

export function bind_command_help(bot: Bot<MyContext>) {
  bot.command(["help", "community"], async (ctx) => {
    await ctx
      .reply("Community & Helpdesk [ART 404 Group](https://t.me/art404chat) ", {
        parse_mode: "MarkdownV2",
      })
      .catch((reason) => {
        console.error(reason);
      });
  });
}
