import { MyContext } from "../../global.types";
import prisma from "../../prisma";
import { InlineKeyboard } from "grammy";
import { BuyOrder, Memecoin } from "@prisma/client";

export function buildKeyboardWithBuyOrder(buyOrders: BuyOrder[]) {
  const inlineKeyboard = new InlineKeyboard();
  let i = 0;
  for (const buyOrder of buyOrders) {
    i++;
    inlineKeyboard.text(
      `${getEmoji(buyOrder.memecoinId)} #${buyOrder.memecoinId} - ${buyOrder.name}`,
      JSON.stringify({
        method: "processorShowMemecoinInfo",
        data: `${buyOrder.id}`,
      }),
    );
    if (i % 2 === 0) {
      inlineKeyboard.row();
    }
  }

  return inlineKeyboard;
}

export function buildKeyboardWithMemes(findMemecoins: Memecoin[]) {
  const inlineKeyboard = new InlineKeyboard();
  let i = 0;
  for (const memecoin of findMemecoins) {
    i++;
    inlineKeyboard.text(
      `${getEmoji(memecoin.id)} #${memecoin.id} - ${memecoin.name}`,
      JSON.stringify({
        method: "processorShowMemecoinInfo",
        data: `${memecoin.id}`,
      }),
    );
    if (i % 2 === 0) {
      inlineKeyboard.row();
    }
  }

  return inlineKeyboard;
}

export async function listNewMemes(ctx: MyContext): Promise<void> {
  let findMemecoins = await prisma.memecoin.findMany({
    orderBy: {
      createDt: "desc",
    },
    take: 10,
  });

  if (findMemecoins.length > 0) {
    let inlineKeyboard = buildKeyboardWithMemes(findMemecoins);
    await ctx.reply(
      "<b>🌟 New Memecoins</b>\n\n" +
        `Here are the latest ${findMemecoins.length} memecoins.\nClick to view details and pump it!`,
      {
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
      },
    );
  } else {
    await ctx.reply("Oops! No memecoin found.");
  }
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
