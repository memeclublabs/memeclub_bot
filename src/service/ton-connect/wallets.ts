import {
  isWalletInfoRemote,
  WalletInfoRemote,
  WalletsListManager,
} from "@tonconnect/sdk";

const walletsListManager = new WalletsListManager({
  cacheTTLMs: Number(process.env.WALLETS_LIST_CACHE_TTL_MS),
});

export async function getWallets(): Promise<WalletInfoRemote[]> {
  const wallets = await walletsListManager.getWallets();
  return wallets.filter(isWalletInfoRemote);
}

export async function getWalletInfo(
  walletAppName: string,
): Promise<WalletInfoRemote | undefined> {
  const wallets = await getWallets();
  return wallets.find(
    (wallet) => wallet.appName.toLowerCase() === walletAppName.toLowerCase(),
  );
}

function info() {
  let all = [
    {
      name: "Wallet",
      appName: "telegram-wallet",
      imageUrl: "https://wallet.tg/images/logo-288.png",
      aboutUrl: "https://wallet.tg/",
      platforms: ["ios", "android", "macos", "windows", "linux"],
      bridgeUrl: "https://bridge.tonapi.io/bridge",
      universalLink: "https://t.me/wallet?attach=wallet",
    },
    {
      name: "Tonkeeper",
      appName: "tonkeeper",
      imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
      aboutUrl: "https://tonkeeper.com",
      tondns: "tonkeeper.ton",
      platforms: ["ios", "android", "chrome", "firefox"],
      bridgeUrl: "https://bridge.tonapi.io/bridge",
      universalLink: "https://app.tonkeeper.com/ton-connect",
      jsBridgeKey: "tonkeeper",
      injected: false,
      embedded: false,
    },
    {
      name: "MyTonWallet",
      appName: "mytonwallet",
      imageUrl: "https://mytonwallet.io/icon-256.png",
      aboutUrl: "https://mytonwallet.io",
      platforms: ["chrome", "windows", "macos", "linux"],
      jsBridgeKey: "mytonwallet",
      injected: false,
      embedded: false,
      bridgeUrl: "https://tonconnectbridge.mytonwallet.org/bridge/",
      universalLink: "https://connect.mytonwallet.org",
    },
    {
      name: "Tonhub",
      appName: "tonhub",
      imageUrl: "https://tonhub.com/tonconnect_logo.png",
      aboutUrl: "https://tonhub.com",
      platforms: ["ios", "android"],
      jsBridgeKey: "tonhub",
      injected: false,
      embedded: false,
      bridgeUrl: "https://connect.tonhubapi.com/tonconnect",
      universalLink: "https://tonhub.com/ton-connect",
    },
  ];
}
