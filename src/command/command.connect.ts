import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { tonConnectInfoKeyboard } from "../service/use.ton-connect";
import { contactAdminWithError, formatTonAddressStr } from "../com.utils";
import { CHAIN } from "@tonconnect/sdk";

export function bind_command_connect(bot: Bot<MyContext>) {
  bot.command("connect", async (ctx) => {
    console.info("command - /connect [", ctx.from?.username, Date.now());

    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }
    let { isConnected, connector } = await tonConnectInfoKeyboard(ctx, chatId);
    console.info("wallet connection:", isConnected);
    let wallet = connector?.wallet;
    if (wallet) {
      await ctx.reply(
        `<b>💎 Wallet Connected!</b> \n
Wallet: ${wallet?.device?.appName}
Network: ${wallet!.account.chain === CHAIN.TESTNET ? "Testnet" : "Mainnet"}
Address:\n${formatTonAddressStr(wallet?.account.address!)}`,
        { parse_mode: "HTML" },
      );
    }
    console.info("command - /connect ]", ctx.from?.username, Date.now());
  });
}
