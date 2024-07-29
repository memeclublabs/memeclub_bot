// src/ton-connect/wallets.ts

import {
  isWalletInfoRemote,
  WalletInfo,
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
): Promise<WalletInfo | undefined> {
  const wallets = await getWallets();
  return wallets.find(
    (wallet) => wallet.appName.toLowerCase() === walletAppName.toLowerCase(),
  );
}

function getStaticWalletInfo() {
  return [
    {
      name: "Wallet",
      appName: "telegram-wallet",
      imageUrl: "https://wallet.tg/images/logo-288.png",
      aboutUrl: "https://wallet.tg/",
      tondns: undefined,
      platforms: ["ios", "android", "macos", "windows", "linux"],
      bridgeUrl: "https://bridge.ton.space/bridge",
      universalLink: "https://t.me/wallet?attach=wallet",
      deepLink: undefined,
    },
    {
      name: "Tonkeeper",
      appName: "tonkeeper",
      imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
      aboutUrl: "https://tonkeeper.com",
      tondns: "tonkeeper.ton",
      platforms: ["ios", "android", "chrome", "firefox", "macos"],
      bridgeUrl: "https://bridge.tonapi.io/bridge",
      universalLink: "https://app.tonkeeper.com/ton-connect",
      deepLink: "tonkeeper-tc://",
      jsBridgeKey: "tonkeeper",
      injected: false,
      embedded: false,
    },
    {
      name: "MyTonWallet",
      appName: "mytonwallet",
      imageUrl: "https://static.mytonwallet.io/icon-256.png",
      aboutUrl: "https://mytonwallet.io",
      tondns: undefined,
      platforms: [
        "chrome",
        "windows",
        "macos",
        "linux",
        "ios",
        "android",
        "firefox",
      ],
      jsBridgeKey: "mytonwallet",
      injected: false,
      embedded: false,
      bridgeUrl: "https://tonconnectbridge.mytonwallet.org/bridge/",
      universalLink: "https://connect.mytonwallet.org",
      deepLink: undefined,
    },
    {
      name: "Tonhub",
      appName: "tonhub",
      imageUrl: "https://tonhub.com/tonconnect_logo.png",
      aboutUrl: "https://tonhub.com",
      tondns: undefined,
      platforms: ["ios", "android"],
      jsBridgeKey: "tonhub",
      injected: false,
      embedded: false,
      bridgeUrl: "https://connect.tonhubapi.com/tonconnect",
      universalLink: "https://tonhub.com/ton-connect",
      deepLink: undefined,
    },
    {
      name: "DeWallet",
      appName: "dewallet",
      imageUrl:
        "https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png",
      aboutUrl: "https://delabwallet.com",
      tondns: undefined,
      platforms: ["ios", "android"],
      bridgeUrl: "https://sse-bridge.delab.team/bridge",
      universalLink: "https://t.me/dewallet?attach=wallet",
      deepLink: undefined,
    },
    {
      name: "Bitget Wallet",
      appName: "bitgetTonWallet",
      imageUrl:
        "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget_wallet_logo_0_gas_fee.png",
      aboutUrl: "https://web3.bitget.com",
      tondns: undefined,
      platforms: ["ios", "android", "chrome"],
      jsBridgeKey: "bitgetTonWallet",
      injected: false,
      embedded: false,
      bridgeUrl: "https://bridge.tonapi.io/bridge",
      universalLink: "https://bkcode.vip/ton-connect",
      deepLink: "bitkeep://",
    },
    {
      name: "SafePal",
      appName: "safepalwallet",
      imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
      aboutUrl: "https://www.safepal.com",
      tondns: "",
      platforms: ["ios", "android", "chrome", "firefox"],
      bridgeUrl: "https://ton-bridge.safepal.com/tonbridge/v1/bridge",
      universalLink: "https://link.safepal.io/ton-connect",
      deepLink: "safepal-tc://",
      jsBridgeKey: "safepalwallet",
      injected: false,
      embedded: false,
    },
    {
      name: "OKX Wallet",
      appName: "okxTonWallet",
      imageUrl:
        "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
      aboutUrl: "https://www.okx.com/web3",
      tondns: undefined,
      platforms: ["chrome", "safari", "firefox", "ios", "android"],
      jsBridgeKey: "okxTonWallet",
      injected: false,
      embedded: false,
      bridgeUrl: "https://www.okx.com/tonbridge/discover/rpc/bridge",
      universalLink: "https://www.okx.com/ul/uYJPB0",
      deepLink: undefined,
    },
    {
      name: "OKX TR Wallet",
      appName: "okxTonWalletTr",
      imageUrl:
        "https://static.okx.com/cdn/assets/imgs/247/587A8296F0BB640F.png",
      aboutUrl: "https://tr.okx.com/web3",
      tondns: undefined,
      platforms: ["chrome", "safari", "firefox", "ios", "android"],
      jsBridgeKey: "okxTonWallet",
      injected: false,
      embedded: false,
      bridgeUrl: "https://www.okx.com/tonbridge/discover/rpc/bridge",
      universalLink: "https://tr.okx.com/ul/uYJPB0?entityId=5",
      deepLink: undefined,
    },
  ];
}
