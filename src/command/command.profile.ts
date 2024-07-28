import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { getConnector } from "../ton-connect/conenctor";
import { formatTonAddressStr } from "../util";
import { UserRejectsError } from "@tonconnect/sdk";
import { getWallets } from "../ton-connect/wallets";

export function bind_command_profile(bot: Bot<MyContext>) {
  bot.command("profile", async (ctx) => {
    const chatId = ctx.msg.chat.id;

    const connector = getConnector(chatId);

    await connector.restoreConnection();
    if (!connector.connected) {
      await ctx.reply("Connect wallet to send transaction");
      return;
    } else {
      await ctx.reply(
        `Wallet connected!!. ${formatTonAddressStr(connector.wallet?.account.address!)}`,
      );
    }

    // send tx
    let sendTransactionResponsePromise = connector.sendTransaction({
      validUntil: Math.round(Date.now() / 1000) + 600, // timeout is SECONDS
      messages: [
        {
          amount: "1000000",
          address:
            "0:0000000000000000000000000000000000000000000000000000000000000000",
        },
      ],
    });

    sendTransactionResponsePromise
      .then((res) => {
        ctx.reply(`Transaction sent successfully`);
      })
      .catch((e) => {
        if (e instanceof UserRejectsError) {
          ctx.reply(`You rejected the transaction`);
          return;
        }

        ctx.reply(`Unknown error happened when trying to send transaction.`);
      })
      .finally(() => connector.pauseConnection());
    //---------------

    const wallets = await getWallets();
    const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;
    let deeplink = tonkeeper.universalLink;

    await ctx.reply(
      `Open Wallet ${connector.wallet!.device.appName} and confirm transaction`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Open Your Wallet",
                url: deeplink,
              },
            ],
          ],
        },
      },
    );
    //---------------
  });
}
