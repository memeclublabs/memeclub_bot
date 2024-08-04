import { MyContext } from "../global.types";

export async function triggerClaimPoints(
  ctx: MyContext,
  _: string,
): Promise<void> {
  let text = `<b>⭐️ Claim Points to TON 💎</b>

💵 You can claim your points as 💎TON!

🚀 Will open to all users after first Memecoin is listed to DEX!

🎊 Refer more friends and pump more memecoins, stay tuned for further updates.
`;

  await ctx.reply(text, { parse_mode: "HTML" });
}
