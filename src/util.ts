import { Address } from "@ton/core";

export function tonTestOnly() {
  return process.env.CHAIN_NETWORK == "Testnet";
}

export function tonNetwork() {
  return tonTestOnly() ? "Testnet" : "Mainnet";
}

export function tonAddressStr(address: Address) {
  return address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: tonTestOnly(),
  });
}

export function tonviewerUrl(address: String | null) {
  let url = tonTestOnly()
    ? "https://testnet.tonviewer.com/"
    : "https://tonviewer.com/";

  if (address) {
    return url + address;
  } else {
    return url;
  }
}

export function botStatusValid(botStatus: string) {
  return botStatus === "member" || botStatus === "administrator";
}
