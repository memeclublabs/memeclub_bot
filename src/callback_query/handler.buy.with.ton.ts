import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError, tonTestOnly } from "../com.utils";
import { tonConnectInfoKeyboard } from "../service/use.ton-connect";
import { isTelegramUrl, UserRejectsError } from "@tonconnect/sdk";
import {
  addTGReturnStrategy,
  pTimeout,
  pTimeoutException,
} from "../ton-connect/utils";
import { getWalletInfo } from "../ton-connect/wallets";
import { Address, fromNano, toNano } from "@ton/core";
import { buildBuyTokenMsg } from "../service/ton/dex/message/masterMsg";

export async function handlerBuyWithTon(
  ctx: MyContext,
  memecoinId: number,
  tonAmt: number,
) {
  const tgId = ctx.from?.id;
  if (!tgId) {
    await contactAdminWithError(ctx);
    return;
  }
  let { isConnected, connector } = await tonConnectInfoKeyboard(ctx, tgId);
  if (!isConnected) {
    return;
  }
  if (!connector) {
    return;
  }

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
      let findUser = await prisma.user.findUnique({ where: { tgId: tgId } });

      if (!findUser) {
        console.error("User not found", tgId);
        return;
      }
      let buyNotice2Group =
        "<b>🟢 Big Pump </b>\n" +
        `${findUser.firstName} ${findUser.lastName}` +
        `buy ${tonAmt} TON of ${findMeme.name}(${findMeme.ticker})`;

      await ctx.api.sendMessage(Number(findMeme.groupId), buyNotice2Group, {
        parse_mode: "HTML",
      });

      await ctx.reply(`✅ Transaction sent successfully`);
    })
    .catch(async (e) => {
      if (e === pTimeoutException) {
        await ctx.reply(`❗️Transaction was not confirmed`);
        return;
      }

      if (e instanceof UserRejectsError) {
        await ctx.reply(`You rejected the transaction`);
        return;
      }

      await ctx.reply(`Unknown error happened`);
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
