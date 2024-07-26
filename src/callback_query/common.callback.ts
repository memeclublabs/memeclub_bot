import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";

export function on_callback_query(bot: Bot<MyContext>) {
  // 这个是旧的处理方式，因为不能接受参数chatId，已经没用了，
  // bot.callbackQuery("create_meme_callback", async (ctx) => {
  //   await ctx.conversation.enter("newMemeWithValidation");
  // });

  // 处理通用的按钮点击事件 callback_query
  bot.on("callback_query", async (ctx, next) => {
    const callbackData = ctx.callbackQuery.data;

    if (
      callbackData &&
      callbackData.startsWith("callback_create_meme_groupId_")
    ) {
      // 点击 [Step 2: Create new Memecoin] 按钮会进入这个方法处理，按钮附带了 groupId 参数
      // chatId 参数将会放到 session 中才可以传递给 conversation
      // conversation 处理方法将从 session 中获取 groupId
      let groupIdFromSession = callbackData.split(
        "callback_create_meme_groupId_",
      )[1];
      if (!groupIdFromSession) {
        console.error(
          "Cannot find group info when click Step2 button",
          callbackData,
        );
        await ctx.reply(
          "Cannot find group info, pls contact memeclub helpdesk!",
        );
        return;
      }

      ctx.session.groupId = groupIdFromSession;
      await ctx.conversation.enter("newMemeWithValidation");
    } else if (
      callbackData &&
      callbackData.startsWith("callback_confirm_deploy_")
    ) {
      // 点击 【Confirm to Create Memecoin】按钮
      const memecoinId = callbackData.split("callback_confirm_deploy_")[1];
      let memecoin = await prisma.memecoin.findUnique({
        where: { id: BigInt(memecoinId) },
      });

      if (!memecoin) {
        console.error(`${memecoinId} not found`);
      }
      console.info(memecoin?.ticker);
      console.info(memecoin?.ticker);
      console.info(memecoin?.ticker);

      // TODO 这里就要部署了
      // TODO 这里就要部署了
      // TODO 这里就要部署了
      // TODO 这里就要部署了
      // TODO 这里就要部署了
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
                callback_data: `callback_check_status_memecoin_${memecoin?.id}`,
              },
            ],
          ],
        },
      });
    } else {
      await next();
    }
  });
}
