import { Address } from "@ton/core";
import { MyContext } from "./global.types";
import { Group, Memecoin } from "@prisma/client";

export function tonTestOnly() {
  return process.env.CHAIN_NETWORK == "Testnet";
}

export function isMainnet() {
  return !tonTestOnly();
}

export function toFriendlyAddress(addressArg: Address | string) {
  let oneAddress: Address;
  if (addressArg instanceof Address) {
    oneAddress = addressArg;
  } else {
    try {
      oneAddress = Address.parse(addressArg);
    } catch (e) {
      return "InvalidAddress";
    }
  }
  return oneAddress.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: tonTestOnly(),
  });
}

export function toTonAddressStr(address: Address): string {
  return address.toString({
    urlSafe: true,
    bounceable: false,
    testOnly: tonTestOnly(),
  });
}

export function tonviewerUrl(address: String | null | undefined): string {
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

export function buildMemecoinInfoText(
  memecoin: Memecoin,
  group: Group,
  title?: string,
  description?: string,
) {
  if (!title) {
    title = `🤡 Memecoin Information #${memecoin.id}`;
  }

  if (!description) {
    description = `Let's make a big pump!`;
  }

  return `<b>${title}</b>
  
Name: ${memecoin.name}
Ticker: ${memecoin.ticker}
Group: ${group.groupTitle} 👥(${group.memberCount})
Description: ${memecoin.description}

${description}\n


`;
}
