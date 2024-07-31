import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { getConnector } from "../ton-connect/connector";
import { getWalletInfo } from "../ton-connect/wallets";
import { CHAIN, toUserFriendlyAddress } from "@tonconnect/sdk";
import { contactAdminWithError } from "../com.utils";

export function bind_command_my_wallet(bot: Bot<MyContext>) {
  bot.command("my_wallet", async (ctx) => {
    console.info("command - /my_wallet [", ctx.from?.username, Date.now());
    const chatId = ctx.from?.id;
    if (!chatId) {
      await contactAdminWithError(ctx);
      return;
    }

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
      await ctx.reply("You didn't connect a wallet");
      return;
    }

    const walletName =
      (await getWalletInfo(connector.wallet!.device.appName))?.name ||
      connector.wallet!.device.appName;

    await ctx.reply(
      `Connected wallet: ${walletName}\nYour address: ${toUserFriendlyAddress(
        connector.wallet!.account.address,
        connector.wallet!.account.chain === CHAIN.TESTNET,
      )}`,
    );
    console.info("command - /my_wallet ]", ctx.from?.username, Date.now());
  });
}
