import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError } from "../com.utils";
import { tonConnectInfoKeyboard } from "../service/use.ton-connect";
import { isTelegramUrl, UserRejectsError } from "@tonconnect/sdk";
import {
  addTGReturnStrategy,
  pTimeout,
  pTimeoutException,
} from "../ton-connect/utils";
import { getWalletInfo } from "../ton-connect/wallets";

export async function handlerBuyWithTon(
  ctx: MyContext,
  memecoinId: number,
  tonAmt: number,
) {
  const chatId = ctx.from?.id;
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }
  let { isConnected, connector } = await tonConnectInfoKeyboard(ctx, chatId);
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

  pTimeout(
    connector.sendTransaction({
      validUntil: Math.round(
        (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
          1000,
      ),
      messages: [
        {
          amount: "1000000",
          address:
            "0:0000000000000000000000000000000000000000000000000000000000000000",
        },
      ],
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
  )
    .then(() => {
      ctx.reply(`Transaction sent successfully`);
    })
    .catch((e) => {
      if (e === pTimeoutException) {
        ctx.reply(`Transaction was not confirmed`);
        return;
      }

      if (e instanceof UserRejectsError) {
        ctx.reply(`You rejected the transaction`);
        return;
      }

      ctx.reply(`Unknown error happened`);
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
