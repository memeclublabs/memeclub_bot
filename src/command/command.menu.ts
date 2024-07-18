import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { createUser, queryUser, queryUserListByRefTgId } from "../util404";
import Env from "../env.cloudflare";
import { REF_USER_LIST_FOUND, User404, USER_FOUND } from "../static404";

export function bind_command_profile(bot: Bot<MyContext>, env: Env) {
  bot.command("menu", async (ctx) => {
    await ctx.reply("Choose an option:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Web App 仅限私聊",
              web_app: { url: "https://your-web-app.url" },
            },
          ], // 仅限私聊
          [
            {
              text: "Callback Button 可在群组使用",
              callback_data: "your_callback_data",
            },
          ], // 可在群组使用
          [{ text: "URL Button 可在群组使用", url: "https://your-url.com" }], // 可在群组使用
        ],
      },
    });
  });
}
