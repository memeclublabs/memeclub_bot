import { MyContext } from "../global.types";
import prisma from "../prisma";
import { tonDeployMaster } from "../service/ton.deploy.master";
import { tonviewerUrl, toTonAddressStr } from "../com.utils";
import { waitNextSeqNo } from "../service/ton/util.helpers";
import { memecoinDeployedNotify } from "./memecoin.deployed.notify";

export async function confirmDeploy(
  ctx: MyContext,
  memecoinId: string,
): Promise<void> {
  await ctx.reply(
    "The memecoin is deploying to the blockchain network, please wait…",
  );
  // 【Confirm to Create Memecoin】
  let memecoin = await prisma.memecoin.findUnique({
    where: { id: BigInt(memecoinId) },
  });

  if (memecoin) {
    if (memecoin.coinStatus == "Init") {
      await prisma.memecoin.update({
        where: { id: memecoin.id },
        data: {
          coinStatus: "Processing",
        },
      });
      console.info(
        `${memecoin.ticker}#${memecoin.id} status update from Init to Processing`,
      );
      let { opWallet, masterAddress, seqNo } = await tonDeployMaster(
        memecoin.name,
        memecoin.ticker,
        memecoin.description + ` [id:${memecoin.id}]`,
        memecoin.image!,
      );

      let newMemecoin = await prisma.memecoin.findUnique({
        where: { id: BigInt(memecoinId) },
      });
      if (newMemecoin && newMemecoin.coinStatus !== "Processing") {
        console.error(
          `${memecoin.ticker}#${memecoin.id} status is Processing, 是因为快速重复点击 【🚀Confirm to Create Memecoin】`,
        );
        return;
      }

      await prisma.memecoin.update({
        where: { id: memecoin.id },
        data: {
          masterAddress: masterAddress,
          opWalletAddress: toTonAddressStr(opWallet.address),
          opDeploySeqNo: seqNo,
          coinStatus: "Deploying",
        },
      });

      console.info(
        `new master ${masterAddress} with seqNo ${seqNo} deployed for ${memecoin.id}`,
      );

      await ctx.reply(
        "🏗<b>Memecoin " +
          memecoin.ticker +
          " #" +
          memecoin.id +
          " in deploying....</b>\n\n" +
          "" +
          "Name:" +
          memecoin.name +
          "\nTicker:" +
          memecoin.ticker +
          "\nDescription:" +
          memecoin.description,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🌐 View Transaction at Tonviewer",
                  url: tonviewerUrl(masterAddress),
                },
              ],
              // [
              //   {
              //     text: "Check Status",
              //     callback_data: `callback_check_status_memecoin_${memecoin?.id}`,
              //   },
              // ],
            ],
          },
        },
      );
      console.info("⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️   enter waitNextSeqNo ======>", Date.now());
      let { isNextSeq } = await waitNextSeqNo(opWallet, seqNo);
      console.info("⚠️⚠️ ⚠️ ⚠️ ⚠️⚠️  exit waitNextSeqNo ======>", Date.now());
      if (isNextSeq) {
        console.info(`Memecoin ${memecoin.id}-${memecoin.ticker} deployed.`);
        await prisma.memecoin.update({
          where: { id: memecoin.id },
          data: {
            coinStatus: "Deployed",
          },
        });
      }

      // 因为这个 memecoin 不是最新的数据库记录，所以要把 masterAddress 给它补上
      memecoin.masterAddress = masterAddress;
      memecoin.opWalletAddress = toTonAddressStr(opWallet.address);
      await memecoinDeployedNotify(ctx, memecoin);
    } else if (memecoin.coinStatus == "Deploying") {
      await ctx.reply(
        "This memecoin ${memecoin.name} is in deploying please wait...",
      );
    } else if (memecoin.coinStatus == "Deployed") {
      await ctx.reply(
        `The memecoin ${memecoin.ticker} #${memecoin.id} deployed, please pump it!`,
      );
    } else if (memecoin.coinStatus == "FailedToDeploy") {
      // await ctx.answerCallbackQuery("memecoin in deploying");
      // await ctx.answerCallbackQuery({ text: "⚠️警告", show_alert: true });
      await ctx.reply(
        "This memecoin ${memecoin.id} ${memecoin.name} failed to deploy.",
      );
    } else if (memecoin.coinStatus == "DexListing") {
      await ctx.reply(
        "This memecoin ${memecoin.name} is in DEX Listing, please wait...",
      );
    } else if (memecoin.coinStatus == "FailedToListing") {
      await ctx.reply(
        "This memecoin ${memecoin.name} ${memecoin.id} is in DEX Listing, please wait...",
      );
    } else if (memecoin.coinStatus == "DexListed") {
      await ctx.reply(
        "This memecoin ${memecoin.id} ${memecoin.name} is Listed in DEX.",
      );
    }
  } else {
    console.error(`memecoinId ${memecoinId} is not found`);
  }
}
