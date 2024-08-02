import { MyContext } from "../../global.types";
import prisma from "../../prisma";
import { contactAdminWithError } from "../../com.utils";
import { getStartReferralLink } from "../../com.referral";
import { InlineKeyboard } from "grammy";

export async function listAirdrop(ctx: MyContext): Promise<void> {
  let findUser = await prisma.user.findUnique({
    where: {
      tgId: ctx.from?.id,
    },
  });

  if (!findUser) {
    await contactAdminWithError(ctx, "user not found at listAirdrop");
    return;
  }

  // ==========================
  const inlineKeyboard = new InlineKeyboard();
  inlineKeyboard
    .text(
      "🔗 Get Referral Link",
      JSON.stringify({
        method: "triggerGetReferralLink",
        data: `${ctx.from?.id}`,
      }),
    )
    .row()
    .text("👬 My Friends", "dd-todo1")
    .text("🔖 Points History", "dd-todo2");
  let startReferralLink = getStartReferralLink(findUser.refCode);
  await ctx.reply(
    `<b>🎁 Airdrop & Referral </b>

🔗Your referral link: ${startReferralLink}

⭐️Your MEME Points: ${findUser.totalPoints}

💰Share and earn upto 10% commission forever from your friends!`,
    {
      parse_mode: "HTML",
      reply_markup: inlineKeyboard,
    },
  );
}
