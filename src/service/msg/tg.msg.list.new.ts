import { MyContext } from "../../global.types";
import prisma from "../../prisma";
import { InlineKeyboard } from "grammy";

export async function listNewMemes(ctx: MyContext): Promise<void> {
  let findMemecoins = await prisma.memecoin.findMany({
    orderBy: {
      createDt: "desc",
    },
    take: 10,
  });

  if (findMemecoins.length > 0) {
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
