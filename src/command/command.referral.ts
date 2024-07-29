import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { tonConnectMenu } from "../service/use.ton-connect";
import { getConnector } from "../ton-connect/connector";
import { getWalletInfo } from "../ton-connect/wallets";
import { CHAIN, toUserFriendlyAddress } from "@tonconnect/sdk";

export function bind_command_referral(bot: Bot<MyContext>) {
  bot.command("connect", async (ctx) => {
    const chatId = ctx.msg.chat.id;
    await tonConnectMenu(ctx, chatId);
  });

  bot.command("disconnect", async (ctx) => {
    console.info("disconnect()");
    const chatId = ctx.msg.chat.id;
    const connector = getConnector(chatId);
    await connector.restoreConnection();
    if (!connector.connected) {
      await ctx.reply("You didn't connect a wallet");
      return;
    }
    console.info("before call connector.disconnect()");
    await connector.disconnect();
    console.info("after call connector.disconnect()");
    await ctx.reply("Wallet has been disconnected");
  });

  bot.command("my_wallet", async (ctx) => {
    const chatId = ctx.msg.chat.id;

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
  });
}
