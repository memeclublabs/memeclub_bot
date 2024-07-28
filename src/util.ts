import { Address } from "@ton/core";

export function tonTestOnly() {
  return process.env.CHAIN_NETWORK == "Testnet";
}

export function tonNetwork() {
  return tonTestOnly() ? "Testnet" : "Mainnet";
}

export function toTonAddressStr(address: Address): string {
  return address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: tonTestOnly(),
  });
}

export function formatTonAddressStr(address: string): string {
  let addressObj = Address.parse(address);
  return toTonAddressStr(addressObj);
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
