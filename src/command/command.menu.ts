import { Bot } from "grammy";
import { MyContext } from "../global.types";

export function bind_command_profile(bot: Bot<MyContext>) {
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
