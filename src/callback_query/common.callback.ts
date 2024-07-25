import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";

//  ⚠️注意： 通用的 bot.on('callback_query') 优先级低于明确的 bot.callbackQuery
//  ⚠️注意： 通用的 bot.on('callback_query') 优先级低于明确的 bot.callbackQuery
//  ⚠️注意： 通用的 bot.on('callback_query') 优先级低于明确的 bot.callbackQuery

// 也就是说，通用的不会影响到具体的 bot.callbackQuery

// 在 grammy 中，bot.on('callback_query') 和 bot.callbackQuery('some_callback_data') 处理器可以共存，
// 但它们的处理方式和优先级有一些关键点需要注意。
// bot.callbackQuery('some_callback_data') 是对特定回调数据的专门处理器，
// 而 bot.on('callback_query') 是一个通用处理器，处理所有的回调查询。

export function on_callback_query(bot: Bot<MyContext>) {
  // 处理 create_meme_callback
  bot.callbackQuery("create_meme_callback", async (ctx) => {
    await ctx.conversation.enter("newMemeWithValidation");
    // await ctx.conversation.enter("movie");
  });

  // 处理按钮点击事件
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
