import { getWallets } from "./service/ton-connect/wallets";

console.info(Math.floor(Math.random() * 100001));

(async () => {
  let wallets = await getWallets();
  // console.info(wallets);
  // console.info("=================");
  // console.info(JSON.stringify(wallets));

  // let selectedApp = ["telegram-wallet", "tonkeeper", "mytonwallet", "tonhub"];
  let selectedApp = ["telegram-wal12let", "tonkee2per"];

  let selectedApp2 = [["telegram-wal12let"], ["tonkee2per"]];

  let filter = wallets.filter((wallet) => selectedApp.includes(wallet.appName));
  console.info(filter);
})();
