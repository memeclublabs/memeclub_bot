import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError, isMainnet, tonTestOnly } from "../com.utils";
import { tonConnectInfoKeyboard } from "../service/use.ton-connect";
import { TonClient, TupleItem } from "@ton/ton";
import {
  BASE_NANO_NUMBER,
  ENDPOINT_MAINNET_RPC,
  ENDPOINT_TESTNET_RPC,
} from "../com.static";
import { Address, beginCell, toNano } from "@ton/core";
import {
  addTGReturnStrategy,
  pTimeout,
  pTimeoutException,
} from "../ton-connect/utils";
import { isTelegramUrl, UserRejectsError } from "@tonconnect/sdk";
import { getWalletInfo } from "../ton-connect/wallets";
import { buildBurnTokenMsg } from "../service/ton/dex/message/walletMsg";

export async function handlerSellWithPercentage(
  ctx: MyContext,
  memecoinId: number,
  sellPercentage: number,
) {
  const chatId = ctx.from?.id;
  if (!chatId) {
    await contactAdminWithError(ctx);
    return;
  }
  let { isConnected, connector } = await tonConnectInfoKeyboard(
    ctx,
    chatId,
    false,
  );
  if (!isConnected) {
    return;
  }
  if (!connector) {
    return;
  }

  let findMeme = await prisma.memecoin.findUnique({
    where: { id: memecoinId },
  });

  if (!findMeme) {
    await contactAdminWithError(ctx, ` memecoin ${memecoinId} not found`);
    return;
  }

  let findGroup = await prisma.group.findUnique({
    where: { groupId: Number(findMeme.groupId) },
  });
  if (!findGroup) {
    await contactAdminWithError(ctx, `group ${findMeme.groupId} not found`);
    return;
  }

  //    ==================================================================

  const client = new TonClient({
    endpoint: isMainnet() ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
  });

  // ------------
  let userWalletAddressStr = connector.account?.address;

  if (!userWalletAddressStr) {
    await contactAdminWithError(
      ctx,
      `userWallet address ${userWalletAddressStr}`,
    );
    return;
  }
  let userWalletAddress = Address.parse(userWalletAddressStr!);

  let jettonWalletAddress = await getJettonAddress(
    findMeme.masterAddress!,
    userWalletAddressStr!,
    client,
  );
  // ------------

  const jetton_wallet_tx = await client.runMethod(
    jettonWalletAddress,
    "get_wallet_data",
  );
  let jetton_wallet_result = jetton_wallet_tx.stack;
  let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
  let jettonBalance: string = Number(
    Number(jetton_balance_bigint) / BASE_NANO_NUMBER,
  ).toFixed(3);
  //    ==================================================================
  //   todo:
  //   todo: 没有余额，卖个毛线
  //   todo: 没有余额，卖个毛线
  //   todo: 没有余额，卖个毛线
  //   todo: 没有余额，卖个毛线
  //   todo:
  //   todo:
  let sell_gas = 0.1;
  let payloadCell = buildBurnTokenMsg(
    Number(jetton_balance_bigint) / BASE_NANO_NUMBER,
    userWalletAddress,
    3n,
  );
  let payloadBase64 = payloadCell.toBoc().toString("base64");
  pTimeout(
    connector.sendTransaction({
      validUntil: Math.round(
        (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
          1000,
      ),
      messages: [
        {
          address: jettonWalletAddress.toString({
            bounceable: true,
            testOnly: tonTestOnly(),
          }),
          amount: "" + toNano(sell_gas),
          payload: payloadBase64,
        },
      ],
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
  )
    .then(() => {
      ctx.reply(`Transaction sent successfully`);
    })
    .catch((e) => {
      if (e === pTimeoutException) {
        ctx.reply(`Transaction was not confirmed`);
        return;
      }

      if (e instanceof UserRejectsError) {
        ctx.reply(`You rejected the transaction`);
        return;
      }

      ctx.reply(`Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());

  let deeplink = "";
  const walletInfo = await getWalletInfo(connector.wallet!.device.appName);
  if (walletInfo) {
    deeplink = walletInfo.universalLink;
  }

  if (isTelegramUrl(deeplink)) {
    const url = new URL(deeplink);
    url.searchParams.append("startattach", "tonconnect");
    deeplink = addTGReturnStrategy(
      url.toString(),
      process.env.TELEGRAM_BOT_LINK!,
    );
  }

  await ctx.reply(
    `Open ${walletInfo?.name || connector.wallet!.device.appName} and confirm transaction`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Open ${walletInfo?.name || connector.wallet!.device.appName}`,
              url: deeplink,
            },
          ],
        ],
      },
    },
  );
}

async function getJettonAddress(
  masterAddress: string,
  walletAddress: string,
  client: TonClient,
): Promise<Address> {
  let ownerAddressCell = beginCell()
    .storeAddress(Address.parse(walletAddress))
    .endCell();
  let stack: TupleItem[] = [];
  stack.push({ type: "slice", cell: ownerAddressCell });
  const master_tx = await client.runMethod(
    Address.parse(masterAddress),
    "get_wallet_address",
    stack,
  );
  let jetton_master_result = master_tx.stack;
  return jetton_master_result.readAddress();
}
