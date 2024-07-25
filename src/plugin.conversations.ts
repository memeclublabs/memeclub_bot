import { Bot } from "grammy";
import { MyContext, MyConversation } from "./global.types";
import { conversations, createConversation } from "@grammyjs/conversations";
import prisma from "./prisma";
import { bigintReplacer } from "./functions.common";

export function use_conversations(bot: Bot<MyContext>) {
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin
  // WARN: must run after sessions plugin

  // Install the conversations plugin.
  bot.use(conversations());

  bot.use(createConversation(movie));
  bot.use(createConversation(new_meme));
}

async function greeting(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Hi there! What is your name?");
  const { message } = await conversation.wait();
  await ctx.reply(`Welcome to the chat, ${message?.text}!`);
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

async function new_meme(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply(
    "Now let’s deploy a new meme coin.\n\n" +
      "Please choose a name for your meme coin? 1/4\n",
  );
  const memeName = await conversation.waitFor(":text");
  await ctx.reply("Good. Now let’s choose a ticker for this meme coin.  2/4 ");
  const ticker = await conversation.waitFor(":text");
  await ctx.reply(
    "Good. please enter a short description of the meme coin. 3/4 ",
  );
  const desc = await conversation.waitFor(":text");
  await ctx.reply(
    "Now upload a image for this meme coin.\n" +
      "\n" +
      "/empty to skip. /AIGC to generate by AI",
  );
  const photo = await conversation.waitFor(":photo");

  await conversation.external(async () => {
    console.info("run for external" + JSON.stringify(desc));
  });
  console.info(JSON.stringify(memeName));
  console.info(JSON.stringify(ticker));
  console.info(JSON.stringify(photo));
  await ctx.reply(` ${memeName} ${ticker} ${desc} ${photo}`);
}
