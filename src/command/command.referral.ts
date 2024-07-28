import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { getWallets } from "../ton-connect/wallets";
import QRCode from "qrcode";
import { getConnector } from "../ton-connect/conenctor";
import { formatTonAddressStr } from "../util";

export function bind_command_referral(bot: Bot<MyContext>) {
  bot.command("referral", async (ctx) => {
    const chatId = ctx.msg.chat.id;
    const wallets = await getWallets();

    let connector = getConnector(chatId);

    connector.onStatusChange((wallet) => {
      if (wallet) {
        ctx.reply(
          `${wallet.device.appName} wallet ${formatTonAddressStr(wallet.account.address)} connected!`,
        );
      }
    });

    const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;

    const link = connector.connect({
      bridgeUrl: tonkeeper.bridgeUrl,
      universalLink: tonkeeper.universalLink,
    });
    const image = await QRCode.toBuffer(link);

    await ctx.reply(link, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Sign in with Tonkeeper",
              url: link,
            },
          ],
        ],
      },
    });
  });
}
