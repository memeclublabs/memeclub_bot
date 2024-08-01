import {
  CHAIN,
  isTelegramUrl,
  toUserFriendlyAddress,
  UserRejectsError,
} from "@tonconnect/sdk";
import { getWalletInfo, getWallets } from "./ton-connect/wallets";
import { getConnector } from "./ton-connect/connector";
import {
  addTGReturnStrategy,
  buildUniversalKeyboard,
  pTimeout,
  pTimeoutException,
} from "./ton-connect/ton-connect-utils";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";

let newConnectRequestListenersMap = new Map<number, () => void>();

export async function handleConnectCommand(ctx: MyContext): Promise<void> {
  const chatId = ctx.msg?.from?.id;

  if (ctx.from?.id != ctx.msg?.from?.id) {
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  } else {
    console.info(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  }

  console.error(
    "ctx.from?.id=",
    ctx.from?.id,
    "ctx.msg?.from?.id=",
    ctx.msg?.from?.id,
  );
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }
  let messageWasDeleted = false;

  console.info(
    `##### 1. ######  handleConnectCommand ${chatId} `,
    ctx.msg?.from?.username,
  );

  console.info(
    `##### 2. ######  newConnectRequestListenersMap ${chatId} `,
    ctx.from?.username,
    ctx.from?.id,
  );
  newConnectRequestListenersMap.get(chatId)?.();

  console.info(
    `##### 2.1. ######  already clear cache ${chatId} `,
    ctx.from?.username,
  );

  const connector = getConnector(chatId, () => {
    unsubscribe();
    newConnectRequestListenersMap.delete(chatId);
    // deleteMessage();
  });

  console.info(
    `##### 3. ######  connector ${chatId} `,
    ctx.msg?.from?.username,
    Date.now(),
  );

  await connector.restoreConnection();

  console.info(
    `##### 4. ######  restoreConnection ${chatId} `,
    ctx.msg?.from?.username,
    connector.connected,
    Date.now(),
  );
  if (connector.connected) {
    const connectedName =
      (await getWalletInfo(connector.wallet!.device.appName))?.name ||
      connector.wallet!.device.appName;
    await ctx.reply(
      `You have already connect ${connectedName} wallet\nYour address: ${toUserFriendlyAddress(
        connector.wallet!.account.address,
        connector.wallet!.account.chain === CHAIN.TESTNET,
      )}\n\n Disconnect wallet firstly to connect a new one`,
    );

    return;
  }

  console.info(
    `##### 5. ######  onStatusChange ${chatId} `,
    ctx.msg?.from?.username,
    connector.connected,
    Date.now(),
  );

  const unsubscribe = connector.onStatusChange(async (wallet) => {
    console.info("connector.onStatusChange.....", wallet);

    if (wallet) {
      // await deleteMessage();

      const walletName =
        (await getWalletInfo(wallet.device.appName))?.name ||
        wallet.device.appName;
      await ctx.reply(`${walletName} wallet connected successfully`);
      unsubscribe();
      newConnectRequestListenersMap.delete(chatId);
    }
  });

  const wallets = await getWallets();

  const link = connector.connect(wallets);

  const keyboard = await buildUniversalKeyboard(link, wallets);

  const botMessage = await ctx.replyWithPhoto(
    "https://www.memeclub.ai/bot/bot-img-memeclub.png",
    {
      reply_markup: {
        inline_keyboard: [keyboard],
      },
    },
  );

  // const deleteMessage = async (): Promise<void> => {
  //   if (!messageWasDeleted) {
  //     messageWasDeleted = true;
  //
  //     await ctx.deleteMessage();
  //     // await ctx.deleteMessage(chatId, botMessage.message_id);
  //   }
  // };

  newConnectRequestListenersMap.set(chatId, async () => {
    unsubscribe();

    // await deleteMessage();

    newConnectRequestListenersMap.delete(chatId);
  });
}

export async function handleSendTXCommand(ctx: MyContext): Promise<void> {
  const chatId = ctx.msg?.from?.id;
  if (ctx.from?.id != ctx.msg?.from?.id) {
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  } else {
    console.info(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  }
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }

  const connector = getConnector(chatId);

  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("Connect wallet to send transaction");
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

export async function handleDisconnectCommand(ctx: MyContext): Promise<void> {
  const chatId = ctx.msg?.from?.id;
  if (ctx.from?.id != ctx.msg?.from?.id) {
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
    console.error(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  } else {
    console.info(
      "ctx.from?.id=",
      ctx.from?.id,
      "ctx.msg?.from?.id=",
      ctx.msg?.from?.id,
    );
  }
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }

  const connector = getConnector(chatId);

  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("You didn't connect a wallet");
    return;
  }

  await connector.disconnect();

  await ctx.reply("Wallet has been disconnected");
}

export async function handleShowMyWalletCommand(ctx: MyContext): Promise<void> {
  const chatId = ctx.msg?.from?.id;
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }

  const connector = getConnector(chatId);

  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("You didn't connect a wallet");
    return;
  }

  const walletName =
    (await getWalletInfo(connector.wallet!.device.appName))?.name ||
    connector.wallet!.device.appName;

  await ctx.reply(
    `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
      connector.wallet!.account.address,
      connector.wallet!.account.chain === CHAIN.TESTNET,
    )}`,
  );
}
