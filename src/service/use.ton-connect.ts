import { MyContext } from "../global.types";
import { getConnector } from "../ton-connect/connector";
import { formatTonAddressStr } from "../com.utils";
import { getWallets } from "../ton-connect/wallets";
import TonConnect, { CHAIN, toUserFriendlyAddress } from "@tonconnect/sdk";
import {
  addTGReturnStrategy,
  convertDeeplinkToUniversalLink,
} from "../ton-connect/utils";

let newConnectRequestListenersMap = new Map<number, () => void>();

// 如果是相同的回话进入
//
// newConnectRequestListenersMap.set(chatId, async () => {
//     unsubscribe();
//
//     await deleteMessage();
//
//     newConnectRequestListenersMap.delete(chatId);
// });

export async function tonConnectInfoKeyboard(
  ctx: MyContext,
  chatId: number,
): Promise<{ isConnected: boolean; connector?: TonConnect }> {
  let result = { isConnected: false };
  let messageWasDeleted = false;

  // 注意⚠️：这一句先不执行，原方案是每次发起 connect 调用
  // newConnectRequestListenersMap.get(chatId)?.();

  // 当链接过期时，做 unsubscribe 操作，删除 map 中的变量，删除消息
  let connector = getConnector(chatId, () => {
    unsubscribe();
    newConnectRequestListenersMap.delete(chatId);
    deleteMessage();
  });

  await connector.restoreConnection();

  if (connector.connected) {
    return { isConnected: true, connector: connector };
  }

  //上面判断过未连接钱包，下面就准备连接菜单
  // 1. 如果连接状态变化，wallet 不为空，说明连接成功
  let unsubscribe = connector.onStatusChange(async (wallet) => {
    let hexAddress = wallet?.account?.address;
    if (hexAddress) {
      hexAddress = toUserFriendlyAddress(hexAddress);
    }
    console.info(
      `connector.onStatusChange ==> New App: ${wallet?.device?.appName}, Address: ${hexAddress} `,
    );

    if (wallet) {
      await deleteMessage();
      // ⚠️注意：当新的状态变化被处理过后， 取消状态变化的订阅
      // ⚠️注意：当新的状态变化被处理过后， 取消状态变化的订阅
      unsubscribe();
      newConnectRequestListenersMap.delete(chatId);

      await ctx.reply(
        `<b>💎 Wallet Connected!</b> \n
Wallet: ${wallet?.device?.appName}
Network: ${wallet!.account.chain === CHAIN.TESTNET ? "Testnet" : "Mainnet"}
Address:\n${formatTonAddressStr(connector.wallet?.account.address!)}`,
        { parse_mode: "HTML" },
      );
    }
  });

  const wallets = await getWallets();
  // 获得 tonkeeper 钱包
  const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;
  const tonkeeperLink = connector.connect({
    bridgeUrl: tonkeeper.bridgeUrl,
    universalLink: tonkeeper.universalLink,
  });

  // 获得 TG 内置钱包
  const tgWallet = wallets.find(
    (wallet) => wallet.appName === "telegram-wallet",
  )!;

  const universalLink = connector.connect(wallets);
  const tgWalletLink = tgWallet
    ? addTGReturnStrategy(
        convertDeeplinkToUniversalLink(universalLink, tgWallet?.universalLink),
        process.env.TELEGRAM_BOT_LINK!,
      )
    : undefined;
  let inlineKeyboard = [
    [
      {
        text: "Connect Tonkeeper",
        url: tonkeeperLink,
      },
    ],
  ];

  if (tgWalletLink) {
    inlineKeyboard.push([
      {
        text: "Connect TG Wallet",
        url: tgWalletLink,
      },
    ]);
  }

  let reply = await ctx.replyWithPhoto(
    "https://www.memeclub.ai/bot/ton-connect.png",
    {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    },
  );

  // -----------------------------------------------------------
  const deleteMessage = async (): Promise<void> => {
    if (!messageWasDeleted) {
      messageWasDeleted = true;
      try {
        await ctx.api.deleteMessage(chatId, reply.message_id);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.info("messageWasDeleted ", ctx);
    }
  };

  newConnectRequestListenersMap.set(chatId, async () => {
    unsubscribe();
    await deleteMessage();
    newConnectRequestListenersMap.delete(chatId);
  });
  // -----------------------------------------------------------

  return result;
}
