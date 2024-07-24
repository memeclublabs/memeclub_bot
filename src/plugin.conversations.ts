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
