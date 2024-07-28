// src/commands-handlers.ts

import { CHAIN, toUserFriendlyAddress } from "@tonconnect/sdk";
import QRCode from "qrcode";
import { MyContext } from "../global.types";
import { getConnector } from "./conenctor";
import { getWalletInfo, getWallets } from "./wallets";

let newConnectRequestListenersMap = new Map<number, () => void>();

export async function handleConnectCommand(ctx: MyContext): Promise<void> {
  const chatId = ctx.msg?.chat.id;
  if (!chatId) {
    return;
  }
  let messageWasDeleted = false;

  newConnectRequestListenersMap.get(chatId)?.();

  const connector = getConnector(chatId, () => {
    unsubscribe();
    newConnectRequestListenersMap.delete(chatId);
    deleteMessage();
  });

  await connector.restoreConnection();
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

  const unsubscribe = connector.onStatusChange(async (wallet) => {
    if (wallet) {
      await deleteMessage();

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
  const image = await QRCode.toBuffer(link);

  const botMessage = await ctx.reply("image", {
    reply_markup: {
      inline_keyboard: [
        [
          // {
          //   text: "Choose a Wallet",
          //   callback_data: JSON.stringify({ method: "chose_wallet" }),
          // },
          {
            text: "Open Link",
            url: link,
          },
        ],
      ],
    },
  });

  const deleteMessage = async (): Promise<void> => {
    if (!messageWasDeleted) {
      messageWasDeleted = true;
      // todo
      // todo
      // todo
      // todo
      // await ctx.deleteMessage(botMessage.message_id);
    }
  };

  newConnectRequestListenersMap.set(chatId, async () => {
    unsubscribe();

    await deleteMessage();

    newConnectRequestListenersMap.delete(chatId);
  });
}

// ... other code
