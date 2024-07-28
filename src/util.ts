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
