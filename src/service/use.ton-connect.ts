import { MyContext } from "../global.types";
import { getWallets } from "../ton-connect/wallets";
import { getConnector } from "../ton-connect/conenctor";
import { formatTonAddressStr } from "../util";

export async function tonConnectMenu(ctx: MyContext, chatId: number) {
  let connector = getConnector(chatId);
  await connector.restoreConnection();

  if (connector.connected) {
    await ctx.reply(
      `TON Wallet connected! \n\nAddress: ${formatTonAddressStr(connector.wallet?.account.address!)}`,
    );
    return;
  }

  //上面判断过未连接钱包，下面就准备连接菜单
  // 1. 如果连接状态变化，wallet 不为空，说明连接成功
  connector.onStatusChange((wallet) => {
    console.info(
      ">> connector.onStatusChange, wallet = ",
      JSON.stringify(wallet?.device?.appName),
    );
    if (wallet) {
      const walletName = wallet.device.appName;
      ctx.reply(
        `${walletName} wallet ${formatTonAddressStr(wallet.account.address)} connected!`,
      );
    }
  });

  const wallets = await getWallets();

  // 获得 TG 内置钱包
  const tgWallet = wallets.find(
    (wallet) => wallet.appName === "telegram-wallet",
  )!;
  const tgWalletLink = connector.connect({
    bridgeUrl: tgWallet.bridgeUrl,
    universalLink: tgWallet.universalLink,
  });

  // 获得 tonkeeper 钱包
  const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;
  const tonkeeperLink = connector.connect({
    bridgeUrl: tonkeeper.bridgeUrl,
    universalLink: tonkeeper.universalLink,
  });

  console.info(tgWalletLink);
  console.info(tonkeeperLink);
  await ctx.replyWithPhoto("https://www.memeclub.ai/bot/ton-connect.png", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Sign in with TG Wallet",
            url: tgWalletLink,
          },
        ],
        [
          {
            text: "Sign in with Tonkeeper",
            url: tonkeeperLink,
          },
        ],
      ],
    },
  });
}
