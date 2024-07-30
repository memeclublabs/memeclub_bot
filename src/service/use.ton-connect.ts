import { MyContext } from "../global.types";

export async function tonConnectInfoKeyboard(ctx: MyContext, chatId: number) {
  // let connector = getConnector(chatId);
  // await connector.restoreConnection();
  //
  // if (connector.connected) {
  //   await ctx.reply(
  //     `TON Wallet connected! \n\nAddress: ${formatTonAddressStr(connector.wallet?.account.address!)}`,
  //   );
  //   return;
  // }
  //
  // //上面判断过未连接钱包，下面就准备连接菜单
  // // 1. 如果连接状态变化，wallet 不为空，说明连接成功
  // connector.onStatusChange(async (wallet) => {
  //   console.info(
  //     "connector.onStatusChange @use.ton-connect.ts ",
  //     wallet?.device?.appName,
  //     wallet?.account?.address,
  //   );
  //   if (wallet) {
  //     await ctx.reply(
  //       `${wallet.device.appName} wallet ${formatTonAddressStr(wallet.account.address)} connected!`,
  //     );
  //   }
  // });
  //
  // const wallets = await getWallets();
  // // 获得 tonkeeper 钱包
  // const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;
  // const tonkeeperLink = connector.connect({
  //   bridgeUrl: tonkeeper.bridgeUrl,
  //   universalLink: tonkeeper.universalLink,
  // });
  //
  // // 获得 TG 内置钱包
  // // const tgWallet = wallets.find(
  // //   (wallet) => wallet.appName === "telegram-wallet",
  // // )!;
  //
  // let tgWalletLink = "";
  // // const universalLink = connector.connect(wallets);
  // // const tgWalletLink = tgWallet
  // //   ? addTGReturnStrategy(
  // //       convertDeeplinkToUniversalLink(universalLink, tgWallet?.universalLink),
  // //       process.env.TELEGRAM_BOT_LINK!,
  // //     )
  // //   : undefined;
  // // console.info("========== TG Wallet ============");
  // // console.info(tgWalletLink);
  //
  // let inlineKeyboard = [
  //   [
  //     {
  //       text: "Connect Tonkeeper Wallet",
  //       url: tonkeeperLink,
  //     },
  //   ],
  // ];
  //
  // // if (tgWalletLink) {
  // //   inlineKeyboard.unshift([
  // //     {
  // //       text: "Connect TG Wallet",
  // //       url: tgWalletLink,
  // //     },
  // //   ]);
  // // }
  //
  // await ctx.replyWithPhoto("https://www.memeclub.ai/bot/ton-connect.png", {
  //   reply_markup: {
  //     inline_keyboard: inlineKeyboard,
  //   },
  // });
}
