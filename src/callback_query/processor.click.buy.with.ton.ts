import { MyContext } from "../global.types";
import { contactAdminWithError, tonTestOnly, tonviewerUrl } from "../com.utils";
import prisma from "../prisma";
import { Address, fromNano, toNano } from "@ton/core";
import { buildBuyTokenMsg } from "../service/ton/dex/message/masterMsg";
import { getConnector } from "../service/ton-connect/connector";
import {
  addTGReturnStrategy,
  pTimeout,
  pTimeoutException,
} from "../service/ton-connect/ton-connect-utils";
import { isTelegramUrl, UserRejectsError } from "@tonconnect/sdk";
import { getWalletInfo } from "../service/ton-connect/wallets";
import { Prisma } from "@prisma/client";
import { updateBuyOrSellReward } from "../service/user/user.dao";
import { ActionTypes } from "../com.enums";

export async function clickBuyWithTon(
  ctx: MyContext,
  data: string,
): Promise<void> {
  try {
    let split = data.split("###");
    let memecoinId = Number(split[0]);
    let tonAmt = Number(split[1]);
    await handlerBuyWithTon(ctx, memecoinId, tonAmt);
  } catch {
    console.error("ERROR: clickBuyWithTon", data);
    return;
  }
}

async function handlerBuyWithTon(
  ctx: MyContext,
  memecoinId: number,
  tonAmt: number,
) {
  const tgId = ctx.from?.id;
  if (!tgId) {
    await contactAdminWithError(ctx);
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

  let buyGasFee = 0.1; //0.1 TON
  let gasAndTonAmount = toNano(tonAmt + buyGasFee);
  console.log("gasAndTonAmount:", fromNano(gasAndTonAmount));
  let toAddress = Address.parse(findMeme.masterAddress!);
  let payloadCell = buildBuyTokenMsg(tonAmt, 0n);
  let payloadBase64 = payloadCell.toBoc().toString("base64");

  pTimeout(
    connector.sendTransaction({
      validUntil: Math.round(
        (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
          1000,
      ),
      messages: [
        {
          address: toAddress.toString({
            bounceable: false,
            testOnly: tonTestOnly(),
          }),
          amount: "" + gasAndTonAmount,
          payload: payloadBase64,
        },
      ],
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
  )
    .then(async () => {
      if (!userAddress) {
        userAddress = toAddress.toString();
      }
      await ctx.reply(`✅ Buy transaction sent successfully`, {
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

      // buy order & award start
      let insertData = {
        memecoinId: memecoinId,
        fromCoin: "TON",
        fromAmt: tonAmt,
      } satisfies Prisma.BuyOrderCreateInput;
      await prisma.buyOrder.create({ data: insertData });
      await updateBuyOrSellReward(tgId, ActionTypes.MemeBuy, tonAmt);
      // buy order & award end

      let findUser = await prisma.user.findUnique({ where: { tgId: tgId } });
      if (!findUser) {
        console.error("User not found", tgId);
        return;
      }
      let buyNotice2Group =
        `<b>🟢 Buy Alert ${tonAmt >= 10 ? " 📈 Big Pump" : " "} </b>\n\n` +
        `${findUser.firstName} ${findUser.lastName}` +
        ` bought ${tonAmt} TON of ${findMeme.name}(${findMeme.ticker})`;
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
    })
    .catch(async (e) => {
      if (e === pTimeoutException) {
        await ctx.reply(
          `🔸Buy transaction was not confirmed.\nPlease refer to TON network for the final result.`,
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
        await ctx.reply(
          `🔸You rejected the transaction.\nPlease refer to TON network for the final result.`,
        );
        return;
      }
      console.error(e);
      // await ctx.reply(`🔸Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

  // send Sign Btn to user

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
