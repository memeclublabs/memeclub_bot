import { MyContext } from "../global.types";
import prisma from "../prisma";
import { contactAdminWithError } from "../com.utils";
import { getStartReferralLink } from "../com.referral";

export async function triggerGetReferralLink(
  ctx: MyContext,
  tgId: string,
): Promise<void> {
  let findUser = await prisma.user.findUnique({
    where: {
      tgId: ctx.from?.id,
    },
  });

  if (!findUser) {
    await contactAdminWithError(ctx, "user not found at listAirdrop");
    return;
  }

  let text =
    "🥇#1 Memecoin launchpad on TON \n" +
    "\n" +
    "🚀Make Memes Great Again\n\n" +
    getStartReferralLink(findUser.refCode);

  await ctx.reply(text, { parse_mode: "HTML" });
}
