console.info(Math.floor(Math.random() * 100001));

export const walletMenuCallbacks = {
  chose_wallet: () => {},
  select_wallet: () => {},
  universal_qr: () => {},
};

const callbacks = {
  ...walletMenuCallbacks,
};

(async () => {
  let newVar = typeof callbacks;
  let selectWallet = "notkey" as keyof typeof callbacks;
})();
