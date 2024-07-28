import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { tonDeployMaster } from "../service/ton.deploy.master";
import { tonAddressStr, tonTestOnly } from "../util";
import { sleep, waitNextSeqNo } from "../service/ton/util.helpers";

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
      console.info(
        " 处理点击 🚀【Confirm to Create Memecoin】按钮",
        callbackData,
      );
      // 点击 【Confirm to Create Memecoin】按钮
      const memecoinId = callbackData.split("callback_confirm_deploy_")[1];
      let memecoin = await prisma.memecoin.findUnique({
        where: { id: BigInt(memecoinId) },
      });

      if (memecoin) {
        if (memecoin.coinStatus == "Init") {
          await prisma.memecoin.update({
            where: { id: memecoin.id },
            data: {
              coinStatus: "Processing",
            },
          });
          console.info(
            `${memecoin.ticker}#${memecoin.id} status update from Init to Processing`,
          );
          let { opWallet, masterAddress, seqNo } = await tonDeployMaster(
            memecoin.name,
            memecoin.ticker,
            memecoin.description + ` [id:${memecoin.id}]`,
          );

          // 再次判断是否为 Processing ，防止并发修改
          // 再次判断是否为 Processing ，防止并发修改
          let newMemecoin = await prisma.memecoin.findUnique({
            where: { id: BigInt(memecoinId) },
          });
          if (newMemecoin && newMemecoin.coinStatus !== "Processing") {
            console.error(
              `${memecoin.ticker}#${memecoin.id} status is Processing, 是因为快速重复点击 【🚀Confirm to Create Memecoin】`,
            );
            return;
          }

          await prisma.memecoin.update({
            where: { id: memecoin.id },
            data: {
              masterAddress: masterAddress,
              opWalletAddress: tonAddressStr(opWallet.address),
              opDeploySeqNo: seqNo,
              coinStatus: "Deploying",
            },
          });

          console.info(masterAddress);
          console.info(seqNo);
          let url = tonTestOnly()
            ? "https://testnet.tonviewer.com/"
            : "https://tonviewer.com/";

          await ctx.reply(
            "🏗<b>Memecoin " +
              memecoin.ticker +
              " #" +
              memecoin.id +
              " in deploying....</b>\n\n" +
              "" +
              "Name:" +
              memecoin.name +
              "\nTicker:" +
              memecoin.ticker +
              "\nDescription:" +
              memecoin.description,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🌐 View Transaction at Tonviewer",
                      url: url + masterAddress,
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
            },
          );
          let { isNextSeq } = await waitNextSeqNo(opWallet, seqNo);
          await sleep(10000);
          if (isNextSeq) {
            console.info(
              `Memecoin ${memecoin.id}-${memecoin.ticker} deployed.`,
            );
            await prisma.memecoin.update({
              where: { id: memecoin.id },
              data: {
                coinStatus: "Deployed",
              },
            });
          }

          await ctx.reply(
            "<b>🎉Memecoin " +
              memecoin.ticker +
              " #" +
              memecoin.id +
              " deploy successfully!</b>\n\n" +
              "" +
              "Name:" +
              memecoin.name +
              "\nTicker:" +
              memecoin.ticker +
              "\nDescription:" +
              memecoin.description,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🌐 View Transaction at Tonviewer",
                      url: url + masterAddress,
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
            },
          );
        } else if (memecoin.coinStatus == "Deploying") {
          await ctx.reply(
            "This memecoin ${memecoin.name} is in deploying please wait...",
          );
        } else if (memecoin.coinStatus == "Deployed") {
          await ctx.reply(
            `The memecoin ${memecoin.ticker} #${memecoin.id} deployed, please pump it!`,
          );
        } else if (memecoin.coinStatus == "FailedToDeploy") {
          // await ctx.answerCallbackQuery("memecoin in deploying");
          // await ctx.answerCallbackQuery({ text: "⚠️警告", show_alert: true });
          await ctx.reply(
            "This memecoin ${memecoin.id} ${memecoin.name} failed to deploy.",
          );
        } else if (memecoin.coinStatus == "DexListing") {
          await ctx.reply(
            "This memecoin ${memecoin.name} is in DEX Listing, please wait...",
          );
        } else if (memecoin.coinStatus == "FailedToListing") {
          await ctx.reply(
            "This memecoin ${memecoin.name} ${memecoin.id} is in DEX Listing, please wait...",
          );
        } else if (memecoin.coinStatus == "DexListed") {
          await ctx.reply(
            "This memecoin ${memecoin.id} ${memecoin.name} is Listed in DEX.",
          );
        }
      } else {
        console.error(`${memecoinId} not found`);
      }
    } else {
      await next();
    }
  });
}
