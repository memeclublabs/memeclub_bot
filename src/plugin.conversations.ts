import { Bot, InlineKeyboard } from "grammy";
import { MyContext, MyConversation } from "./global.types";
import { conversations, createConversation } from "@grammyjs/conversations";
import prisma from "./prisma";
import { bigintReplacer } from "./functions.common";
import { Prisma } from "@prisma/client";

export function use_conversations(bot: Bot<MyContext>) {
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin

  // Install the conversations plugin.
  bot.use(conversations());

  bot.use(createConversation(movie));
  bot.use(createConversation(newMemeWithValidation));
}

async function movie(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("How many favorite movies do you have?");
  const count = await conversation.form.number();
  const movies: string[] = [];
  for (let i = 0; i < count; i++) {
    await ctx.reply(`Tell me number ${i + 1}!`);
    const titleCtx = await conversation.waitFor(":text");
    movies.push(titleCtx.msg.text);
  }
  await ctx.reply("Here is a better ranking!");
  movies.sort();

  await conversation.external(async () => {
    console.info("run for external" + JSON.stringify(movies));
    let prismaPromise = await prisma.user.findMany();
    console.info(
      "run for external" + JSON.stringify(prismaPromise, bigintReplacer),
    );
  });
  await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join("\n"));
}

/**
 * - name: name too long: it must be less than 32 characters
 * - ticker: ticker must be less than 11 characters
 * - desc: description must be less than 256 characters
 *
 * @param conversation
 * @param ctx
 */
async function newMemeWithValidation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply(
    "Please enter a name for your meme coin?  [1/4]\n\n" +
      "Examples:\n" +
      "   - Dogecoin\n" +
      "   - Pepe\n" +
      "   - Ton Fish\n",
  );
  const nameMsg = await conversation.waitFor(":text");

  await ctx.reply(
    "Good. Now let’s enter a ticker for this meme coin.  [2/4]\n\n" +
      "Examples:\n" +
      "   - DOGE\n" +
      "   - PEPE\n" +
      "   - FISH\n",
  );
  const tickerMsg = await conversation.waitFor(":text");
  await ctx.reply(
    "Good. please enter a short description of the meme coin.  [3/4]\n\n" +
      "Example: \n" +
      "Dogecoin is the accidental crypto movement that makes people smile!\n",
  );
  const descMsg = await conversation.waitFor(":text");
  await ctx.reply(
    "Now upload an image for this meme coin.  [4/4]\n",
    // "/empty to skip. /AIGC to generate by AI",
  );
  const photoMsg = await conversation.waitFor(":photo");

  await conversation.external(async () => {
    let name = nameMsg?.message?.text;
    let ticker = tickerMsg?.message?.text;
    let desc = descMsg?.message?.text;
    let photos = photoMsg?.message?.photo;

    let devTgId = nameMsg?.message?.from.id;

    // 从会话中获取参数
    const groupIdStr = ctx.session.groupId;
    let groupId = Number(groupIdStr);
    let newData = {
      network: "TON-Mainnet",
      name: name,
      ticker: ticker,
      description: desc,
      devTgId: devTgId,
      groupId: groupId,
    } satisfies Prisma.MemecoinCreateInput;

    // todo: 只要点击 【Step 2: 创建 Memecoin按钮】,就能够获取绑定的 chatId
    // todo: 这里要判断一下，对应的 chat 是否已经有 memecoin
    // todo: 如果有，就继续推进，而不是新建一个

    let newMemecoin = await prisma.memecoin.create({
      data: newData,
    });

    let newGroup = await prisma.group.update({
      where: { groupId: groupId },
      data: {
        mainMemecoinId: newMemecoin.id,
      },
    });
    console.info(
      `${newGroup.groupTitle} mainMemecoinId updated to  ${newMemecoin.id}`,
    );

    const keyboard = new InlineKeyboard().text(
      "Confirm to Create Memecoin",
      `callback_confirm_deploy_${newMemecoin.id}`,
    );

    await ctx.reply(
      `📝<b>New Memecoin Information</b>
      
         Name: ${name}
         Ticker: ${ticker}
         Description: ${desc}`,
      { parse_mode: "HTML", reply_markup: keyboard },
    );
  });
}
