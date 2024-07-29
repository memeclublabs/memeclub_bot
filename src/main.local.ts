import { getWalletInfo, getWallets } from "./ton-connect/wallets";

console.info(Math.floor(Math.random() * 100001));

(async () => {
  let walletInfoRemotes = await getWallets();

  console.info(walletInfoRemotes);

  let tk = await getWalletInfo("Tonkeeper");

  console.info(tk);
})();
