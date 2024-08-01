import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { createMemeConversation } from "./processor.meme.creator";
import { walletMenuCallbacks } from "../service/ton-connect-wallet-menu";
import { confirmDeploy } from "./processor.confirm.deploy";
import { processorClickBuyBtn } from "./processor.click.buy.btn";
import { processorClickSellBtn } from "./processor.click.sell.btn";
import { clickBuyWithTon } from "./processor.click.buy.with.ton";
import { processorClickSellWithPercentage } from "./processor.click.sell.with.percentage";
import { processorShowMemecoinInfo } from "./processor.show.memecoin.info";

export function on_callback_query(bot: Bot<MyContext>) {
  const callbacks = {
    createMemeConversation: createMemeConversation,
    processorShowMemecoinInfo: processorShowMemecoinInfo,
    confirmDeploy: confirmDeploy,
    processorClickBuyBtn: processorClickBuyBtn,
    processorClickSellBtn: processorClickSellBtn,
    clickBuyWithTon: clickBuyWithTon,
    processorClickSellWithPercentage: processorClickSellWithPercentage,
    ...walletMenuCallbacks,
  };

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
      //⚠️： this process CAN'T process, pass to next
      await next();
      return;
    }

    if (!callbacks[request.method as keyof typeof callbacks]) {
      //⚠️： this process CAN'T process, pass to next
      await next();
      return;
    }
    await callbacks[request.method as keyof typeof callbacks](
      ctx,
      request.data,
    );

    console.info(`callback_query - end ]`, ctx.from?.username, ctx.from?.id);
  });
}
