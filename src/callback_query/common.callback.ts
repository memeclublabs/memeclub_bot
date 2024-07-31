import { Bot } from "grammy";
import { MyContext } from "../global.types";
import prisma from "../prisma";
import { tonDeployMaster } from "../service/ton.deploy.master";
import { waitNextSeqNo } from "../service/ton/util.helpers";
import { memecoinDeployedNotify } from "./memecoin.deployed.notify";
import { sendPrivateChatMemecoinInfo } from "../service/msg/tg.msg.sender";
import { tonviewerUrl, toTonAddressStr } from "../com.utils";

export function on_callback_query(bot: Bot<MyContext>) {
  // 处理通用的按钮点击事件 callback_query
  bot.on("callback_query", async (ctx, next) => {
    console.info(
      "callback_query - start [",
      ctx.from?.username,
      ctx.callbackQuery.data,
      JSON.stringify(ctx.callbackQuery),
      Date.now(),
    );
    const callbackData = ctx.callbackQuery.data;
    if (!callbackData) {
      console.error("ERROR: callback_query data is null!");
      return;
    }

    if (callbackData.startsWith("callback_create_meme_groupId_")) {
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
    } else if (callbackData.startsWith("callback_confirm_deploy_")) {
      console.info(" Click 🚀【Confirm to Create Memecoin】", callbackData);
      await ctx.reply(
        "The memecoin is deploying to the blockchain network, please wait…",
      );
      // 【Confirm to Create Memecoin】
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
              opWalletAddress: toTonAddressStr(opWallet.address),
              opDeploySeqNo: seqNo,
              coinStatus: "Deploying",
            },
          });

          console.info(
            `new master ${masterAddress} with seqNo ${seqNo} deployed for ${memecoin.id}`,
          );

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
                      url: tonviewerUrl(masterAddress),
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
          console.info(
            "⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️   enter waitNextSeqNo ======>",
            Date.now(),
          );
          let { isNextSeq } = await waitNextSeqNo(opWallet, seqNo);
          console.info(
            "⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️  exit waitNextSeqNo ======>",
            Date.now(),
          );
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

          // 因为这个 memecoin 不是最新的数据库记录，所以要把 masterAddress 给它补上
          memecoin.masterAddress = masterAddress;
          memecoin.opWalletAddress = toTonAddressStr(opWallet.address);
          await memecoinDeployedNotify(ctx, memecoin);
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
        console.error(`memecoinId ${memecoinId} is not found`);
      }
    } else if (callbackData.startsWith("callback_in_group_click_memecoinId_")) {
      let memecoinId = callbackData.split(
        "callback_in_group_click_memecoinId_",
      )[1];
    } else if (callbackData.startsWith("callback_buy_memecoin_")) {
    } else if (callbackData.startsWith("callback_sell_memecoin_")) {
    } else if (callbackData.startsWith("callback_show_memecoin_info_")) {
      let memecoinId = callbackData.split("callback_show_memecoin_info_")[1];

      let findMemecoin = await prisma.memecoin.findUnique({
        where: { id: Number(memecoinId) },
      });
      if (!findMemecoin) {
        let errorInfo = `Memecoin ${memecoinId} not found.`;
        console.error(errorInfo);
        await ctx.reply(errorInfo);
        return;
      }
      let findGroup = await prisma.group.findUnique({
        where: { groupId: Number(findMemecoin.groupId) },
      });
      if (!findGroup) {
        let errorInfo = `Group ${findMemecoin.groupId} not found.`;
        console.error(errorInfo);
        await ctx.reply(errorInfo);
        return;
      }
      await sendPrivateChatMemecoinInfo(ctx, findGroup, findMemecoin);
    } else if (callbackData.startsWith("callback_template____")) {
    } else {
      await next();
    }

    console.info(`callback_query - end ]`, ctx.from?.username, Date.now());
  });
}
