import { MyContext } from "../../global.types";
import { Group, Memecoin } from "@prisma/client";
import { InlineKeyboardButton } from "@grammyjs/types";
import { buildMemecoinInfoText, tonviewerUrl } from "../../com.utils";

export async function sendPrivateChatMemecoinInfo(
  ctx: MyContext,
  group: Group,
  memecoin: Memecoin,
) {
  if (group == null || memecoin == null) {
    console.error("group or memecoin not found");
    return;
  }

  let text = buildMemecoinInfoText(memecoin, group);
  let masterAddress = memecoin.masterAddress;

  let groupInfoLine: InlineKeyboardButton[] = [];
  if (group.groupUsername) {
    groupInfoLine.push({
      text: `Join ${memecoin.name} Group  👥(${group.memberCount})`,
      url: `https://t.me/${group.groupUsername}`,
    });
  } else {
    groupInfoLine.push({
      text: `${group.groupTitle} 👥(${group.memberCount}) is private.`,
      callback_data: `callback_join_private_group_${group.groupId}`,
    });
  }
  let inlineKeyboard: InlineKeyboardButton[][] = [
    [
      {
        text: "🟢 Buy",
        callback_data: JSON.stringify({
          method: "processorClickBuyBtn",
          data: `${Number(memecoin?.id)}`,
        }),
      },
      {
        text: "🔴 Sell",
        callback_data: JSON.stringify({
          method: "processorClickSellBtn",
          data: `${Number(memecoin?.id)}`,
        }),
      },
    ],
  ];
  inlineKeyboard.push(groupInfoLine);
  inlineKeyboard.push([
    {
      text: "🌐 View Transaction",
      url: tonviewerUrl(masterAddress),
    },
  ]);

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  });
}

function getEmoji(index: bigint): string {
  let result = Number(index % 100n);
  let emojiArray = [
    "🤡",
    "🐬",
    "😈",
    "👽",
    "🤖",
    "🎃",
    "😻",
    "👨‍🚀",
    "🦹‍",
    "🧚‍",
    "🧜‍",
    "🤴",
    "👑",
    "🐸",
    "🐻",
    "🦊",
    "🦄",
    "🐞",
    "🐡",
    "🍄",
    "💥",
    "🍌",
    "🍓",
    "🍉",
    "🍕",
    "🍭",
    "🍺",
    "🎱",
    "🏀",
    "⚽️",
    "🏆",
    "🥇",
    "🎰",
    "🚀",
    "🗽",
    "💸",
    "💎",
    "🔫",
    "🦠",
    "🎉",
    "🧧",
    "🎏",
    "🧸",
    "🔑",
    "💊",
    "❤️",
    "🆘",
    "⚠️",
    "🔱",
    "💹",
    "📣",
    "🚩",
    "🎠",
    "🗾",
    "🏦",
    "🛝",
    "🗺",
    "⚓️",
    "✈️",
    "🎹",
    "🏓",
    "🥎",
    "🍪",
    "🥟",
    "🍣",
    "🍟",
    "🍔",
    "🍑",
    "🍇",
    "🥐",
    "❄️",
    "🌊",
    "🌍",
    "🍀",
    "🐏",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐝",
    "🐤",
  ];

  return emojiArray[result];
}
