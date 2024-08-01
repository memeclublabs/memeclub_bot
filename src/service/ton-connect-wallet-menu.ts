import { getWalletInfo, getWallets } from "./ton-connect/wallets";
import { getConnector } from "./ton-connect/connector";
import { isTelegramUrl } from "@tonconnect/sdk";
import { Message } from "@grammyjs/types";
import {
  addTGReturnStrategy,
  buildUniversalKeyboard,
} from "./ton-connect/ton-connect-utils";
import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";

export const walletMenuCallbacks = {
  chose_wallet: onChooseWalletClick,
  select_wallet: onWalletClick,
  universal_qr: onOpenUniversalQRClick,
};
async function onChooseWalletClick(ctx: MyContext, _: string): Promise<void> {
  const wallets = await getWallets();

  await ctx.editMessageReplyMarkup({
    reply_markup: {
      inline_keyboard: [
        wallets.map((wallet) => ({
          text: wallet.name,
          callback_data: JSON.stringify({
            method: "select_wallet",
            data: wallet.appName,
          }),
        })),
        [
          {
            text: "« Back",
            callback_data: JSON.stringify({
              method: "universal_qr",
            }),
          },
        ],
      ],
    },
  });
}

async function onOpenUniversalQRClick(
  ctx: MyContext,
  _: string,
): Promise<void> {
  const chatId = ctx.from?.id;
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }
  const wallets = await getWallets();

  const connector = getConnector(chatId);

  const link = connector.connect(wallets);

  // await editQR(query.message!, link);

  const keyboard = await buildUniversalKeyboard(link, wallets);

  await ctx.editMessageReplyMarkup({
    reply_markup: {
      inline_keyboard: [keyboard],
    },
  });
}

async function onWalletClick(ctx: MyContext, data: string): Promise<void> {
  const chatId = ctx.from?.id;
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }

  const connector = getConnector(chatId);
  if (connector.connected) {
    console.error("Already connected", connector);
    return;
  }

  const selectedWallet = await getWalletInfo(data);
  if (!selectedWallet) {
    return;
  }

  let buttonLink = connector.connect({
    bridgeUrl: selectedWallet.bridgeUrl,
    universalLink: selectedWallet.universalLink,
  });

  let qrLink = buttonLink;

  if (isTelegramUrl(selectedWallet.universalLink)) {
    buttonLink = addTGReturnStrategy(
      buttonLink,
      process.env.TELEGRAM_BOT_LINK!,
    );
    qrLink = addTGReturnStrategy(qrLink, "none");
  }

  // await editQR(query.message!, qrLink);

  await ctx.editMessageReplyMarkup({
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "« Back",
            callback_data: JSON.stringify({ method: "chose_wallet" }),
          },
          {
            text: `Open ${selectedWallet.name}`,
            url: buttonLink,
          },
        ],
      ],
    },
  });
}

async function editQR(message: Message, link: string): Promise<void> {
  // const fileName = "QR-code-" + Math.round(Math.random() * 10000000000);
  //
  // await QRCode.toFile(`./${fileName}`, link);
  //
  // await bot.editMessageMedia(
  //   {
  //     type: "photo",
  //     media: `attach://${fileName}`,
  //   },
  //   {
  //     message_id: message?.message_id,
  //     chat_id: message?.chat.id,
  //   },
  // );
  //
  // await new Promise((r) => fs.rm(`./${fileName}`, r));
}
