import { Bot, NextFunction } from "grammy";
import { MyContext } from "./global.types";

export function use_time_tracer(bot: Bot<MyContext>) {
  const BOT_ADMIN: number = 5499157826;

  let middleware_config = async (ctx: MyContext, next: NextFunction) => {
    const before = Date.now();
    ctx.config = {
      botAdminId: BOT_ADMIN,
      isAdmin: ctx.from?.id === BOT_ADMIN,
    };

    // invoke downstream middleware
    await next(); // make sure to `await`!
    const after = Date.now(); // milliseconds
    console.log(`Response time: ${after - before} ms`);
  };

  bot.use(middleware_config);
}
