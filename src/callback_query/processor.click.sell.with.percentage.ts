import { MyContext } from "../global.types";
import { contactAdminWithError, isMainnet, tonviewerUrl } from "../com.utils";
import prisma from "../prisma";
import { TonClient } from "@ton/ton";
import { ENDPOINT_MAINNET_RPC, ENDPOINT_TESTNET_RPC } from "../com.static";
import { Address, toNano } from "@ton/core";
import { buildBurnTokenMsg } from "../service/ton/dex/message/walletMsg";
import {
  addTGReturnStrategy,
  pTimeout,
  pTimeoutException,
} from "../service/ton-connect/ton-connect-utils";
import { isTelegramUrl, UserRejectsError } from "@tonconnect/sdk";
import { getWalletInfo } from "../service/ton-connect/wallets";
import { getConnector } from "../service/ton-connect/connector";
import { Prisma } from "@prisma/client";
import { updateBuyOrSellReward } from "../service/user/user.dao";
import { ActionTypes } from "../com.enums";
import { getJettonWalletInfo } from "../service/jetton/get.jetton.balance";

export async function clickSellWithPercentage(
  ctx: MyContext,
  data: string,
): Promise<void> {
  try {
    let split = data.split("###");
    let memecoinId = Number(split[0]);
    let percentage = Number(split[1]);
    await handlerSellWithPercentage(ctx, memecoinId, percentage);
  } catch (e) {
    console.error("ERROR: clickSellWithPercentage", data);
    console.error(e);
    return;
  }
}

export async function handlerSellWithPercentage(
  ctx: MyContext,
  memecoinId: number,
  sellPercentage: number,
) {
  const tgId = ctx.from?.id;
  if (!tgId) {
    await contactAdminWithError(ctx, "handlerSellWithPercentage");
    return;
  }
  const connector = getConnector(tgId);
  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("Connect wallet to send transaction");
    return;
  }
  let userAddress: string | undefined = connector.account?.address;

  let findMeme = await prisma.memecoin.findUnique({
    where: { id: memecoinId },
  });

  if (!findMeme) {
    await contactAdminWithError(ctx, ` memecoin ${memecoinId} not found`);
    return;
  }

  let findGroup = await prisma.group.findUnique({
    where: { groupId: Number(findMeme.groupId) },
  });
  if (!findGroup) {
    await contactAdminWithError(ctx, `group ${findMeme.groupId} not found`);
    return;
  }

  //    ==================================================================

  const client = new TonClient({
    endpoint: isMainnet() ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
  });

  // ------------
  let userWalletAddressStr = connector.account?.address;
  if (!userWalletAddressStr) {
    await contactAdminWithError(
      ctx,
      `userWallet address ${userWalletAddressStr}`,
    );
    return;
  }
  let userWalletAddress = Address.parse(userWalletAddressStr!);
  let jettonBalanceResult = await getJettonWalletInfo(
    connector,
    findMeme.masterAddress!,
  );

  if (!jettonBalanceResult.success) {
    await ctx.reply(
      `♦️Fail to get balance of ${findMeme.name}(${findMeme.ticker}). \n ` +
        jettonBalanceResult.msg,
    );
    return;
  }
  if (jettonBalanceResult.success && jettonBalanceResult.balance == 0) {
    await ctx.reply(
      `🤡You don't have any balance of ${findMeme.name}(${findMeme.ticker}) to sell.`,
    );
    return;
  }

  let sell_gas = 0.1;
  let burnAmount = (jettonBalanceResult.balance! * sellPercentage) / 100;
  console.info("sellPercentage", sellPercentage);
  console.info("burnAmount", burnAmount);

  let payloadCell = buildBurnTokenMsg(burnAmount, userWalletAddress, 3n);
  let payloadBase64 = payloadCell.toBoc().toString("base64");
  pTimeout(
    connector.sendTransaction({
      validUntil: Math.round(
        (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
          1000,
      ),
      messages: [
        {
          address: jettonBalanceResult.jettonWalletAddress!,
          amount: "" + toNano(sell_gas),
          payload: payloadBase64,
        },
      ],
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
  )
    .then(async () => {
      if (!userAddress) {
        userAddress = jettonBalanceResult.jettonWalletAddress;
      }
      await ctx.reply(`✅ Sell transaction sent successfully`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌐 View Transaction",
                url: tonviewerUrl(userAddress),
              },
            ],
          ],
        },
      });

      // sell order & award start
      let insertData = {
        memecoinId: memecoinId,
        sellMode: "Percentage",
        sellPercent: sellPercentage,
        toCoin: "TON",
      } satisfies Prisma.SellOrderCreateInput;
      await prisma.sellOrder.create({ data: insertData });
      await updateBuyOrSellReward(tgId, ActionTypes.MemeSell, 1);
      // sell order & award end

      //   sell alert
      let findUser = await prisma.user.findUnique({ where: { tgId: tgId } });
      if (!findUser) {
        console.error("User not found", tgId);
        return;
      }
      let buyNotice2Group =
        `<b>🔴 Sell Alert ${Number(sellPercentage) == 100 ? " 📉 Big Dump" : " "} </b>\n\n` +
        `${findUser.firstName} ${findUser.lastName}` +
        ` sold ${sell_gas}% of ${findMeme.name}(${findMeme.ticker})`;
      await ctx.api.sendMessage(Number(findMeme.groupId), buyNotice2Group, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌐 View Transaction",
                url: tonviewerUrl(userAddress),
              },
            ],
          ],
        },
      });

      //   sell alert end
    })
    .catch(async (e) => {
      if (e === pTimeoutException) {
        await ctx.reply(
          `🔸Sell transaction was not confirmed. \nPlease refer to TON network for the final result.`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "🌐 View Transaction",
                    url: tonviewerUrl(userAddress),
                  },
                ],
              ],
            },
          },
        );
        return;
      }

      if (e instanceof UserRejectsError) {
        await ctx.reply(`🔸You rejected the sell transaction.`);
        return;
      }

      console.error(e);
      // ctx.reply(`Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

  let deeplink = "";
  const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
  if (walletInfo) {
    deeplink = walletInfo.universalLink;
  }

  if (isTelegramUrl(deeplink)) {
    const url = new URL(deeplink);
    url.searchParams.append("startattach", "tonconnect");
    deeplink = addTGReturnStrategy(
      url.toString(),
      process.env.TELEGRAM_BOT_LINK!,
    );
  }

  await ctx.reply(
    `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Open ${walletInfo?.name || connector.wallet!.device.appName}`,
              url: deeplink,
            },
          ],
        ],
      },
    },
  );
}
