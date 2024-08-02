import { MyContext } from "../../global.types";
import { Prisma, User } from "@prisma/client";
import { FROM_GROUP_VIEW_MEME, Invite_ } from "../../com.static";
import prisma from "../../prisma";
import { generateReferralCode } from "../../com.referral";

async function getReferralUser(match: string): Promise<User | undefined> {
  if (match.startsWith(Invite_)) {
    // https://t.me/your_bot?start=Invite_ABCDEFGHIJK
    let userByRefCode = await prisma.user.findUnique({
      where: { refCode: match },
    });
    // if not find, userByRefCode is null
    if (userByRefCode) {
      return userByRefCode;
    }
  } else if (match.startsWith(FROM_GROUP_VIEW_MEME)) {
    // 通过群里点击 meme Buy/Sell 按钮加入，这个推荐关系要算到邀请人身上
    const memecoinId = match.split(FROM_GROUP_VIEW_MEME)[1];
    let findMeme = await prisma.memecoin.findUnique({
      where: { id: Number(memecoinId) },
    });
    if (findMeme) {
      let findGroup = await prisma.group.findUnique({
        where: { groupId: Number(findMeme.groupId) },
      });
      if (findGroup) {
        let findUser = await prisma.user.findUnique({
          where: { tgId: findGroup.inviterTgId },
        });
        if (findUser) {
          return findUser;
        }
      }
    }
  }
}

export async function createNewUser(ctx: MyContext) {
  let match = ctx.match;
  let referUser: User | undefined = undefined;
  if (typeof match == "string") {
    referUser = await getReferralUser(match);
    if (referUser) {
      await ctx.reply(
        `You are invited by ${referUser.firstName} ${referUser.lastName}`,
      );
    }
  }

  if (!ctx.from) {
    console.error("ERROR: ctx.from is null when create user", ctx);
    return;
  }
  let tgId = ctx.from.id;
  const userData = {
    tgId: tgId,
    tgUsername: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
    refCode: generateReferralCode(tgId),
    isPremium: ctx.from.is_premium,
    langCode: ctx.from.language_code,
    createBy: tgId,
    ...(referUser ? { referBy: referUser.tgId } : {}),
  } satisfies Prisma.UserCreateInput;
  let newUser = await prisma.user.create({ data: userData });
  console.info(`new user created. ${newUser.id}`);

  return newUser;
}
