import { MyContext } from "../global.types";
import { contactAdminWithError, tonTestOnly } from "../com.utils";
import prisma from "../prisma";
import { Address, fromNano, toNano } from "@ton/core";
import { buildBuyTokenMsg } from "../service/ton/dex/message/masterMsg";
import { getConnector } from "../service/ton-connect/connector";
import {
  pTimeout,
  pTimeoutException,
} from "../service/ton-connect/ton-connect-utils";
import { UserRejectsError } from "@tonconnect/sdk";

export async function clickBuyWithTon(
  ctx: MyContext,
  data: string,
): Promise<void> {
  try {
    let split = data.split("###");
    let memecoinId = Number(split[0]);
    let tonAmt = Number(split[1]);
    await handlerBuyWithTon(ctx, memecoinId, tonAmt);
  } catch {
    console.error("ERROR: clickBuyWithTon", data);
    return;
  }
}

async function handlerBuyWithTon(
  ctx: MyContext,
  memecoinId: number,
  tonAmt: number,
) {
  const tgId = ctx.from?.id;
  if (!tgId) {
    await contactAdminWithError(ctx);
    return;
  }
  const connector = getConnector(tgId);
  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("Connect wallet to send transaction");
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

  let buyGasFee = 0.1; //0.1 TON
  let gasAndTonAmount = toNano(tonAmt + buyGasFee);
  console.log("gasAndTonAmount:", fromNano(gasAndTonAmount));

  let toAddress = Address.parse(findMeme.masterAddress!);

  let payloadCell = buildBuyTokenMsg(tonAmt, 0n);
  let payloadBase64 = payloadCell.toBoc().toString("base64");

  pTimeout(
    connector.sendTransaction({
      validUntil: Math.round(
        (Date.now() + Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS)) /
          1000,
      ),
      messages: [
        {
          address: toAddress.toString({
            bounceable: false,
            testOnly: tonTestOnly(),
          }),
          amount: "" + gasAndTonAmount,
          payload: payloadBase64,
        },
      ],
    }),
    Number(process.env.DELETE_SEND_TX_MESSAGE_TIMEOUT_MS),
  )
    .then(async () => {
      let findUser = await prisma.user.findUnique({ where: { tgId: tgId } });

      if (!findUser) {
        console.error("User not found", tgId);
        return;
      }
      let buyNotice2Group =
        "<b>🟢 Big Pump </b>\n" +
        `${findUser.firstName} ${findUser.lastName}` +
        `buy ${tonAmt} TON of ${findMeme.name}(${findMeme.ticker})`;

      await ctx.api.sendMessage(Number(findMeme.groupId), buyNotice2Group, {
        parse_mode: "HTML",
      });

      await ctx.reply(`✅ Transaction sent successfully`);
    })
    .catch(async (e) => {
      if (e === pTimeoutException) {
        await ctx.reply(`❗️Transaction was not confirmed`);
        return;
      }

      if (e instanceof UserRejectsError) {
        await ctx.reply(`You rejected the transaction`);
        return;
      }

      await ctx.reply(`Unknown error happened`);
    })
    .finally(() => connector.pauseConnection());
}
