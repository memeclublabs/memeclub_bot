import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";

// ⚠️注意：需要把具体的 bot.callbackQuery 放到 通用的 bot.on('callback_query') 前面，否则会被通用的处理掉
// ⚠️注意：需要把具体的 bot.callbackQuery 放到 通用的 bot.on('callback_query') 前面，否则会被通用的处理掉
// ⚠️注意：需要把具体的 bot.callbackQuery 放到 通用的 bot.on('callback_query') 前面，否则会被通用的处理掉

export function on_callback_query(bot: Bot<MyContext>) {
  // 处理 create_meme_callback
  bot.callbackQuery("create_meme_callback", async (ctx) => {
    await ctx.conversation.enter("newMemeWithValidation");
    // await ctx.conversation.enter("movie");
  });

  // 处理通用的按钮点击事件 callback_query
  bot.on("callback_query", async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData && callbackData.startsWith("confirm_deploy_memecoin_")) {
      console.info(callbackData);
      // `confirm_deploy_memecoin_${newMemecoin.id}`,
      const memecoinId = callbackData.split("confirm_deploy_memecoin_")[1];

      let memecoin = await prisma.memecoin.findUnique({
        where: { id: BigInt(memecoinId) },
      });

      console.info(memecoin?.ticker);
      // 根据 id 从数据库中删除记录

      // 回复用户
      // await ctx.answerCallbackQuery("memecoin in deploying");
      // await ctx.answerCallbackQuery({ text: "⚠️警告", show_alert: true });

      await ctx.reply("Memecoin in deploying....", {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "View Transaction ",
                url: "https://tonviewer.com/EQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0mJ5",
              },
            ],
            [
              {
                text: "Check Status",
                callback_data: "your_callback_data",
              },
            ],
          ],
        },
      });
    }
  });
}
