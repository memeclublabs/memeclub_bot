import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { createMemeConversation } from "./processor.meme.creator";
import { walletMenuCallbacks } from "../service/ton-connect-wallet-menu";

export function on_callback_query(bot: Bot<MyContext>) {
  const callbacks = {
    createMemeConversation: createMemeConversation,
    ...walletMenuCallbacks,
  };

  // 处理通用的按钮点击事件 callback_query
  bot.on("callback_query", async (ctx, next) => {
    console.info(
      "callback_query - start [",
      ctx.from?.username,
      ctx.callbackQuery.data,
      ctx.from?.id,
    );
    const callbackData = ctx.callbackQuery.data;
    if (!callbackData) {
      console.error("ERROR: callback_query data is null!");
      return;
    }

    let request: { method: string; data: string };
    try {
      request = JSON.parse(callbackData);
    } catch {
      console.error(
        "ERROR: callback_query data is not a valid JSON.",
        callbackData,
      );
      return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
      return;
    }
    await callbacks[request.method as keyof typeof callbacks](
      ctx,
      request.data,
    );
    //
    // if (callbackData.startsWith("callback_confirm_deploy_")) {
    //   console.info(" Click 🚀【Confirm to Create Memecoin】", callbackData);
    //   await ctx.reply(
    //     "The memecoin is deploying to the blockchain network, please wait…",
    //   );
    //   // 【Confirm to Create Memecoin】
    //   const memecoinId = callbackData.split("callback_confirm_deploy_")[1];
    //   let memecoin = await prisma.memecoin.findUnique({
    //     where: { id: BigInt(memecoinId) },
    //   });
    //
    //   if (memecoin) {
    //     if (memecoin.coinStatus == "Init") {
    //       await prisma.memecoin.update({
    //         where: { id: memecoin.id },
    //         data: {
    //           coinStatus: "Processing",
    //         },
    //       });
    //       console.info(
    //         `${memecoin.ticker}#${memecoin.id} status update from Init to Processing`,
    //       );
    //       let { opWallet, masterAddress, seqNo } = await tonDeployMaster(
    //         memecoin.name,
    //         memecoin.ticker,
    //         memecoin.description + ` [id:${memecoin.id}]`,
    //       );
    //
    //       let newMemecoin = await prisma.memecoin.findUnique({
    //         where: { id: BigInt(memecoinId) },
    //       });
    //       if (newMemecoin && newMemecoin.coinStatus !== "Processing") {
    //         console.error(
    //           `${memecoin.ticker}#${memecoin.id} status is Processing, 是因为快速重复点击 【🚀Confirm to Create Memecoin】`,
    //         );
    //         return;
    //       }
    //
    //       await prisma.memecoin.update({
    //         where: { id: memecoin.id },
    //         data: {
    //           masterAddress: masterAddress,
    //           opWalletAddress: toTonAddressStr(opWallet.address),
    //           opDeploySeqNo: seqNo,
    //           coinStatus: "Deploying",
    //         },
    //       });
    //
    //       console.info(
    //         `new master ${masterAddress} with seqNo ${seqNo} deployed for ${memecoin.id}`,
    //       );
    //
    //       await ctx.reply(
    //         "🏗<b>Memecoin " +
    //           memecoin.ticker +
    //           " #" +
    //           memecoin.id +
    //           " in deploying....</b>\n\n" +
    //           "" +
    //           "Name:" +
    //           memecoin.name +
    //           "\nTicker:" +
    //           memecoin.ticker +
    //           "\nDescription:" +
    //           memecoin.description,
    //         {
    //           parse_mode: "HTML",
    //           reply_markup: {
    //             inline_keyboard: [
    //               [
    //                 {
    //                   text: "🌐 View Transaction at Tonviewer",
    //                   url: tonviewerUrl(masterAddress),
    //                 },
    //               ],
    //               [
    //                 {
    //                   text: "Check Status",
    //                   callback_data: `callback_check_status_memecoin_${memecoin?.id}`,
    //                 },
    //               ],
    //             ],
    //           },
    //         },
    //       );
    //       console.info(
    //         "⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️   enter waitNextSeqNo ======>",
    //         Date.now(),
    //       );
    //       let { isNextSeq } = await waitNextSeqNo(opWallet, seqNo);
    //       console.info(
    //         "⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️  exit waitNextSeqNo ======>",
    //         Date.now(),
    //       );
    //       if (isNextSeq) {
    //         console.info(
    //           `Memecoin ${memecoin.id}-${memecoin.ticker} deployed.`,
    //         );
    //         await prisma.memecoin.update({
    //           where: { id: memecoin.id },
    //           data: {
    //             coinStatus: "Deployed",
    //           },
    //         });
    //       }
    //
    //       // 因为这个 memecoin 不是最新的数据库记录，所以要把 masterAddress 给它补上
    //       memecoin.masterAddress = masterAddress;
    //       memecoin.opWalletAddress = toTonAddressStr(opWallet.address);
    //       await memecoinDeployedNotify(ctx, memecoin);
    //     } else if (memecoin.coinStatus == "Deploying") {
    //       await ctx.reply(
    //         "This memecoin ${memecoin.name} is in deploying please wait...",
    //       );
    //     } else if (memecoin.coinStatus == "Deployed") {
    //       await ctx.reply(
    //         `The memecoin ${memecoin.ticker} #${memecoin.id} deployed, please pump it!`,
    //       );
    //     } else if (memecoin.coinStatus == "FailedToDeploy") {
    //       // await ctx.answerCallbackQuery("memecoin in deploying");
    //       // await ctx.answerCallbackQuery({ text: "⚠️警告", show_alert: true });
    //       await ctx.reply(
    //         "This memecoin ${memecoin.id} ${memecoin.name} failed to deploy.",
    //       );
    //     } else if (memecoin.coinStatus == "DexListing") {
    //       await ctx.reply(
    //         "This memecoin ${memecoin.name} is in DEX Listing, please wait...",
    //       );
    //     } else if (memecoin.coinStatus == "FailedToListing") {
    //       await ctx.reply(
    //         "This memecoin ${memecoin.name} ${memecoin.id} is in DEX Listing, please wait...",
    //       );
    //     } else if (memecoin.coinStatus == "DexListed") {
    //       await ctx.reply(
    //         "This memecoin ${memecoin.id} ${memecoin.name} is Listed in DEX.",
    //       );
    //     }
    //   } else {
    //     console.error(`memecoinId ${memecoinId} is not found`);
    //   }
    // } else if (callbackData.startsWith("callback_in_group_click_memecoinId_")) {
    //   let memecoinId = callbackData.split(
    //     "callback_in_group_click_memecoinId_",
    //   )[1];
    // } else if (callbackData.startsWith("callback_click_buy_btn_")) {
    //   let memecoinId = callbackData.split("callback_click_buy_btn_")[1];
    //   if (!memecoinId) {
    //     await contactAdminWithError(ctx, callbackData);
    //   }
    //   await handlerClickBuyBtn(ctx, Number(memecoinId));
    // } else if (callbackData.startsWith("click_buy_memecoin_")) {
    //   //   click_buy_memecoin_19_with_ton_100
    //   let memecoinInfo = callbackData.split("_with_ton_")[0];
    //   let memecoinId = memecoinInfo.split("click_buy_memecoin_")[1];
    //   let tonAmt = callbackData.split("_with_ton_")[1];
    //   await handlerBuyWithTon(ctx, Number(memecoinId), Number(tonAmt));
    // } else if (callbackData.startsWith("callback_click_sell_btn_")) {
    //   let memecoinId = callbackData.split("callback_click_sell_btn_")[1];
    //   if (!memecoinId) {
    //     await contactAdminWithError(ctx, callbackData);
    //   }
    //   await handlerClickSellBtn(ctx, Number(memecoinId));
    // } else if (callbackData.startsWith("click_sell_memecoin_")) {
    //   //click_sell_memecoin_12_percentage_50
    //   let memecoinInfo = callbackData.split("_percentage_")[0];
    //   let memecoinId = memecoinInfo.split("click_sell_memecoin_")[1];
    //   let sellPercentage = callbackData.split("_percentage_")[1];
    //   await handlerSellWithPercentage(
    //     ctx,
    //     Number(memecoinId),
    //     Number(sellPercentage),
    //   );
    // } else if (callbackData.startsWith("callback_show_memecoin_info_")) {
    //   let memecoinId = callbackData.split("callback_show_memecoin_info_")[1];
    //
    //   let findMemecoin = await prisma.memecoin.findUnique({
    //     where: { id: Number(memecoinId) },
    //   });
    //   if (!findMemecoin) {
    //     let errorInfo = `Memecoin ${memecoinId} not found.`;
    //     console.error(errorInfo);
    //     await ctx.reply(errorInfo);
    //     return;
    //   }
    //   let findGroup = await prisma.group.findUnique({
    //     where: { groupId: Number(findMemecoin.groupId) },
    //   });
    //   if (!findGroup) {
    //     let errorInfo = `Group ${findMemecoin.groupId} not found.`;
    //     console.error(errorInfo);
    //     await ctx.reply(errorInfo);
    //     return;
    //   }
    //   await sendPrivateChatMemecoinInfo(ctx, findGroup, findMemecoin);
    // } else if (callbackData.startsWith("callback_template____")) {
    // } else {
    //   await next();
    // }

    console.info(`callback_query - end ]`, ctx.from?.username, ctx.from?.id);
  });
}
