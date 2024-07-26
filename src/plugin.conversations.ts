import { Bot, InlineKeyboard } from "grammy";
import { MyContext, MyConversation } from "./global.types";
import { conversations, createConversation } from "@grammyjs/conversations";
import prisma from "./prisma";
import { bigintReplacer } from "./functions.common";
import { Prisma } from "@prisma/client";
import { processByCoinStatus } from "./service/memecoin.process.by.status";

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
  // ⚠️：因为 callback 参数只有 groupId，并且可以重复点击按钮，所以需要做幂等处理
  // ⚠️：因为 callback 参数只有 groupId，并且可以重复点击按钮，所以需要做幂等处理
  // ⚠️：因为 callback 参数只有 groupId，并且可以重复点击按钮，所以需要做幂等处理
  // 1. 从 session 中获取 groupId，取得群组信息
  // 2. 判断群组是否已经绑定 Memecoin
  // 2.1 没有绑定， 新建 Memecoin
  // 2.2 已经绑定， 根据 Memecoin 状态，发送不同消息

  const groupIdStr = ctx.session.groupId;
  const groupId = BigInt(groupIdStr);

  let findGroup = await prisma.group.findUnique({
    where: { groupId: groupId },
  });
  if (findGroup) {
    if (!findGroup.mainMemecoinId) {
      // 2.1 没有绑定， 新建 Memecoin

      // === Conversation Start ==========================

      await ctx.reply(
        "Please enter a name for this Memecoin?  [1/4]\n\n" +
          "Examples:\n" +
          "   - Dogecoin\n" +
          "   - Pepe\n" +
          "   - Ton Fish\n",
      );
      const nameMsg = await conversation.waitFor(":text");

      await ctx.reply(
        "Good. Now let’s enter a ticker for this Memecoin.  [2/4]\n\n" +
          "Examples:\n" +
          "   - DOGE\n" +
          "   - PEPE\n" +
          "   - FISH\n",
      );
      const tickerMsg = await conversation.waitFor(":text");
      await ctx.reply(
        "Good. please enter a short description for this Memecoin.  [3/4]\n\n" +
          "Example: \n" +
          "Dogecoin is the accidental crypto movement that makes people smile!\n",
      );
      const descMsg = await conversation.waitFor(":text");
      await ctx.reply(
        "Now upload an image for this Memecoin.  [4/4]\n\n" + "🌄🌅🏞🌃🌆",
        // "/empty to skip. /AIGC to generate by AI",
      );
      const photoMsg = await conversation.waitFor(":photo");

      await conversation.external(async () => {
        let name = nameMsg?.message?.text;
        let ticker = tickerMsg?.message?.text;
        let desc = descMsg?.message?.text;
        let photos = photoMsg?.message?.photo;

        let devTgId = nameMsg?.message?.from.id;

        let newData = {
          network: "TON-Mainnet",
          name: name,
          ticker: ticker,
          description: desc,
          devTgId: devTgId,
          groupId: groupId,
          coinStatus: "Init",
        } satisfies Prisma.MemecoinCreateInput;

        let newMemecoin = await prisma.memecoin.create({
          data: newData,
        });

        let updateGroup = await prisma.group.update({
          where: { groupId: groupId },
          data: {
            mainMemecoinId: newMemecoin.id,
          },
        });
        console.info(
          `${updateGroup.groupTitle} mainMemecoinId updated to  ${newMemecoin.id}`,
        );

        const keyboard = new InlineKeyboard().text(
          "🚀 Confirm to Create Memecoin",
          `callback_confirm_deploy_${newMemecoin.id}`,
        );

        await ctx.reply(
          `🔔<b>New Memecoin Information</b>
      
         Name: ${name}
         Ticker: ${ticker}
         Description: ${desc}`,
          { parse_mode: "HTML", reply_markup: keyboard },
        );
      });
      // === Conversation End==========================
    } else {
      // 2.2 已经绑定，既 findGroup.mainMemecoinId 不为空
      // 根据 Memecoin 状态，发送不同消息
      // 下面这个方法，会根据 Memecoin 的状态来发送不同的消息
      console.info("plugin.conversations.ts => 重复点击 Step2 按钮");
      await processByCoinStatus(
        ctx,
        Number(findGroup.inviterTgId),
        findGroup.mainMemecoinId,
        findGroup.groupTitle,
      );
    }
  } else {
    // 没有发现群组，异常
    console.error("🔴点击 Step2 按钮，找不到对应群组");
    await ctx.reply(
      `🔴 Cannot find group info ${groupIdStr}, pls contact memeclub helpdesk! ☎️`,
    );
  }
}
