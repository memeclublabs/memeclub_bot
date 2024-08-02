import { MyContext } from "../../global.types";
import { Prisma, User } from "@prisma/client";
import { FROM_GROUP_VIEW_MEME, Invite_ } from "../../com.static";
import prisma from "../../prisma";
import { generateReferralCode } from "../../com.referral";
import { ActionTypes } from "../../com.enums";

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

async function addUserActionRecord(
  tgId: number | bigint,
  displayName: string,
  actionType: string,
  selfReward: bigint | number,
) {
  const userActionData = {
    opTgId: tgId,
    opDisplayName: displayName,
    actionType: actionType,
    selfReward: selfReward,
  } satisfies Prisma.UserActionCreateInput;
  await prisma.userAction.create({ data: userActionData });
}

async function addUserActionWithTargetRecord(
  tgId: number | bigint,
  displayName: string,
  actionType: string,
  selfReward: bigint | number,
  targetTgId: number | bigint,
  targetReward: bigint | number,
  targetDisplayName: string,
) {
  const userActionData = {
    opTgId: tgId,
    opDisplayName: displayName,
    actionType: actionType,
    selfReward: selfReward,
    targetTgId: targetTgId,
    targetReward: targetReward,
    targetDisplayName: targetDisplayName,
  } satisfies Prisma.UserActionCreateInput;
  await prisma.userAction.create({ data: userActionData });
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

  const userData = {
    tgId: ctx.from.id,
    tgUsername: ctx.from.username,
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name,
    refCode: generateReferralCode(ctx.from.id),
    isPremium: ctx.from.is_premium,
    totalPoints: ctx.from.is_premium ? 1000 : 100,
    langCode: ctx.from.language_code,
    createBy: ctx.from.id,
    ...(referUser ? { referBy: referUser.tgId } : {}),
  } satisfies Prisma.UserCreateInput;
  let newUser = await prisma.user.create({ data: userData });
  console.info(`new user created. ${newUser.id}`);

  const userActionData = {
    opTgId: ctx.from.id,
    opDisplayName: ctx.from.first_name + " " + ctx.from.last_name,
    actionType: ctx.from.is_premium
      ? ActionTypes.RegisterPremium
      : ActionTypes.Register,
    selfReward: ctx.from.is_premium ? 1000 : 100,
  } satisfies Prisma.UserActionCreateInput;
  await prisma.userAction.create({ data: userActionData });

  // refer award start
  if (referUser) {
    let referPoint = ctx.from.is_premium ? 200n : 20n;
    let newPoints = referUser.totalPoints + referPoint;
    await updateUserTotalPoints(referUser.tgId, newPoints);

    let actionType = ctx.from.is_premium
      ? ActionTypes.InvitedPremium
      : ActionTypes.InvitedUser;
    let referName = referUser.firstName + " " + referUser.lastName;
    await addUserActionRecord(
      referUser.tgId,
      referName,
      actionType,
      referPoint,
    );
  }

  // refer award end

  return newUser;
}

export async function updateUserActionUnified(
  tgId: number,
  actionType: ActionTypes,
  deltaPoints: bigint,
) {
  let findUser = await prisma.user.findUnique({
    where: {
      tgId: tgId,
    },
  });
  if (findUser) {
    let newPoints = findUser.totalPoints + deltaPoints;
    await updateUserTotalPoints(tgId, newPoints);
    await addUserActionRecord(
      tgId,
      findUser.firstName + " " + findUser.lastName,
      actionType,
      deltaPoints,
    );
  }
}

export async function updateBuyOrSellReward(
  opTgId: number,
  actionType: ActionTypes,
  amtRate: number,
) {
  let opUser = await prisma.user.findUnique({
    where: {
      tgId: opTgId,
    },
  });
  if (opUser) {
    let opReward = Math.ceil(amtRate * 100);
    let targetTgId = opUser.referBy;
    if (targetTgId) {
      let targetUser = await prisma.user.findUnique({
        where: {
          tgId: targetTgId,
        },
      });
      if (targetUser) {
        let targetReward = Math.ceil(amtRate * 10);
        await updateUserTotalPoints(
          opTgId,
          opUser.totalPoints + BigInt(opReward),
        );
        await addUserActionWithTargetRecord(
          opTgId,
          opUser.firstName + " " + opUser.lastName,
          actionType,
          opReward,
          targetTgId,
          targetReward,
          targetUser.firstName + " " + targetUser.lastName,
        );
      }
    } else {
      await updateUserActionUnified(opTgId, actionType, BigInt(opReward));
    }
  }
}

async function updateUserTotalPoints(tgId: bigint | number, newPoints: bigint) {
  await prisma.user.update({
    where: { tgId: tgId },
    data: {
      totalPoints: newPoints,
    },
  });
}
