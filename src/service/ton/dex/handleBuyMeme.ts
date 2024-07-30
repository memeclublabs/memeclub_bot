//
// export async function handleBuyMeme(
//   ctx: MyContext,
//   memecoin: Memecoin,
//   tonAmt: number,
// ) {
//   let userTgId = ctx.from?.id;
//   if (!userTgId) {
//     return;
//   }
//   const connector = getConnector(userTgId);
//   await connector.restoreConnection();
//   if (!connector.connected) {
//     await ctx.reply("Connect wallet to send transaction");
//     return;
//   } else {
//     await ctx.reply(
//       `Wallet connected!!. ${formatTonAddressStr(connector.wallet?.account.address!)}`,
//     );
//   }
//
//   // send tx
//   let sendTransactionResponsePromise = connector.sendTransaction({
//     validUntil: Math.round(Date.now() / 1000) + 600, // timeout is SECONDS
//     messages: [
//       {
//         amount: "1000000",
//         address:
//           "0:0000000000000000000000000000000000000000000000000000000000000000",
//       },
//     ],
//   });
//
//   sendTransactionResponsePromise
//     .then((res) => {
//       ctx.reply(`Transaction sent successfully`);
//     })
//     .catch((e) => {
//       if (e instanceof UserRejectsError) {
//         ctx.reply(`You rejected the transaction`);
//         return;
//       }
//
//       ctx.reply(`Unknown error happened when trying to send transaction.`);
//     })
//     .finally(() => connector.pauseConnection());
// }
