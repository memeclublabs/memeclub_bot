import { Address } from "@ton/core";
import { MyContext } from "./global.types";

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

// 自定义 replacer 函数，将 BigInt 转换为字符串
export function bigintReplacer(key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

export async function contactAdminWithError(ctx: MyContext, clue?: string) {
  console.error(
    "There is a unexpected exception, please try again or contact system admin.",
    clue,
  );

  await ctx.reply(
    "There is a unexpected exception, please try again or contact system admin.\n\n" +
      "" +
      `[Clue: ${clue}]`,
  );
}
