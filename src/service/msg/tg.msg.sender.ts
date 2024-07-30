import { MyContext } from "../../global.types";
import { Group, Memecoin } from "@prisma/client";
import { tonviewerUrl } from "../../util";
import { InlineKeyboardButton } from "@grammyjs/types/markup";
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
        `#${memecoin.id} - ${memecoin.name}`,
        `callback_show_menu_memecoin_${memecoin.id}`,
      );
      if (i % 2 === 0) {
        inlineKeyboard.row();
      }
    }
    await ctx.reply(
      "<b>🌟 New Listing Memes</b>\n\n" +
        "Click the button to view details of each Memecoin.",
      {
        parse_mode: "HTML",
        reply_markup: inlineKeyboard,
      },
    );
  } else {
    await ctx.reply("Oops! No memecoin found.");
  }
}

export async function sendPrivateChatMemecoinInfo(
  ctx: MyContext,
  group: Group,
  memecoin: Memecoin,
) {
  if (group == null || memecoin == null) {
    console.error("group or memecoin not found");
    return;
  }
  let text =
    "<b>🎉Memecoin " +
    memecoin.ticker +
    " #" +
    memecoin.id +
    " from group</b>\n\n" +
    "" +
    "<b>Name: </b>" +
    memecoin.name +
    "\n<b>Ticker: </b>" +
    memecoin.ticker +
    "\n<b>Group: </b>" +
    group.groupTitle +
    " 👥(" +
    group.memberCount +
    ")" +
    "\n<b>Description: </b>" +
    memecoin.description;
  let masterAddress = memecoin.masterAddress;
  let lastLine: InlineKeyboardButton[] = [];
  if (group.groupUsername) {
    lastLine.push({
      text: `Join ${memecoin.name} Group  👥(${group.memberCount})`,
      url: `https://t.me/${group.groupUsername}`,
    });
  } else {
    lastLine.push({
      text: `${group.groupTitle} 👥(${group.memberCount}) is private.`,
      callback_data: `callback_join_private_group_${group.groupId}`,
    });
  }
  let inlineKeyboard: InlineKeyboardButton[][] = [
    [
      {
        text: "🟢 Buy",
        callback_data: `callback_buy_memecoin_${memecoin?.id}`,
      },
      {
        text: "🔴 Sell",
        callback_data: `callback_sell_memecoin_${memecoin?.id}`,
      },
    ],
    [
      {
        text: "🌐 View Transaction at Tonviewer",
        url: tonviewerUrl(masterAddress),
      },
    ],
  ];
  inlineKeyboard.push(lastLine);
  let replyMarkupPersonal = {
    inline_keyboard: inlineKeyboard,
  };

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: replyMarkupPersonal,
  });
}

export async function sendPrivateMemecoinInfoMenu(
  ctx: MyContext,
  memecoin: Memecoin,
  text: string,
) {
  let masterAddress = memecoin.masterAddress;
  let replyMarkupPersonal = {
    inline_keyboard: [
      [
        {
          text: "🟢 Buy",
          callback_data: `callback_buy_memecoin_${memecoin?.id}`,
        },
        {
          text: "🔴 Sell",
          callback_data: `callback_sell_memecoin_${memecoin?.id}`,
        },
      ],
      [
        {
          text: "🌐 View Transaction at Tonviewer",
          url: tonviewerUrl(masterAddress),
        },
      ],
    ],
  };

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_markup: replyMarkupPersonal,
  });
}
