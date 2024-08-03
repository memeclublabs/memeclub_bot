import { MyContext } from "../global.types";
import { buildMemecoinInfoText, contactAdminWithError } from "../com.utils";
import prisma from "../prisma";
import { InlineKeyboard } from "grammy";
import { getJettonWalletInfo } from "../service/jetton/get.jetton.balance";
import { getConnector } from "../service/ton-connect/connector";
import { handleConnectCommand } from "../service/ton-connect-commands-handlers";
import { BASE_NANO_NUMBER } from "../com.static";

export async function processorClickSellBtn(
  ctx: MyContext,
  memecoinId: string,
): Promise<void> {
  if (!memecoinId) {
    await contactAdminWithError(ctx, memecoinId);
  }
  await handlerClickSellBtn(ctx, Number(memecoinId));
}

export async function handlerClickSellBtn(ctx: MyContext, memecoinId: number) {
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

  let inlineKeyboard = new InlineKeyboard()
    .text(
      "25%",
      JSON.stringify({
        method: "clickSellWithPercentage",
        data: `${findMeme.id}###25`,
      }),
    )
    .text(
      "50%",
      JSON.stringify({
        method: "clickSellWithPercentage",
        data: `${findMeme.id}###50`,
      }),
    )
    .row()
    .text(
      "75%",
      JSON.stringify({
        method: "clickSellWithPercentage",
        data: `${findMeme.id}###75`,
      }),
    )
    .text(
      "100%",
      JSON.stringify({
        method: "clickSellWithPercentage",
        data: `${findMeme.id}###100`,
      }),
    );

  // description add meme balance of this user start.
  const connector = getConnector(ctx.from?.id!);
  await connector.restoreConnection();
  if (!connector.connected) {
    await ctx.reply("💎 Connect wallet to sell.");
    await handleConnectCommand(ctx);
    return;
  }
  let jettonBalanceResult = await getJettonWalletInfo(
    connector,
    findMeme.masterAddress!,
  );

  if (!jettonBalanceResult.success) {
    await ctx.reply(
      `♦️You don't have any balance of ${findMeme.name}(${findMeme.ticker}) or network is processing.\n\n Please buy it first and try again later.  `,
    );
    return;
  }
  if (jettonBalanceResult.success && jettonBalanceResult.nanoBalance == 0n) {
    await ctx.reply(
      `🤡 You don't have any balance of ${findMeme.name}(${findMeme.ticker}) to sell.`,
    );
    return;
  }

  let desc = `💰Your ${findMeme.ticker} Balance: ${(Number(jettonBalanceResult.nanoBalance!) / BASE_NANO_NUMBER).toFixed(2)}`;

  // description add meme balance of this user end.

  let text = buildMemecoinInfoText(
    findMeme,
    findGroup,
    "🔴 Sell Memecoin",
    desc,
  );
  await ctx.reply(text, { parse_mode: "HTML", reply_markup: inlineKeyboard });
}
