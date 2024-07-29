import { Bot } from "grammy";
import { MyContext } from "../global.types";
import { tonConnectMenu } from "../service/use.ton-connect";

export function bind_command_referral(bot: Bot<MyContext>) {
  bot.command("connect", async (ctx) => {
    const chatId = ctx.msg.chat.id;

    await tonConnectMenu(ctx, chatId);
    // let connector = getConnector(chatId);
    //
    // connector.onStatusChange((wallet) => {
    //   if (wallet) {
    //     ctx.reply(
    //       `${wallet.device.appName} wallet ${formatTonAddressStr(wallet.account.address)} connected!`,
    //     );
    //   }
    // });
    //
    // const wallets = await getWallets();
    // const tonkeeper = wallets.find((wallet) => wallet.appName === "tonkeeper")!;
    //
    // const link = connector.connect({
    //   bridgeUrl: tonkeeper.bridgeUrl,
    //   universalLink: tonkeeper.universalLink,
    // });
    // const image = await QRCode.toBuffer(link);
    //
    // await ctx.reply(link, {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [
    //         {
    //           text: "Sign in with Tonkeeper",
    //           url: link,
    //         },
    //       ],
    //     ],
    //   },
    // });
  });
}
