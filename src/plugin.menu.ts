import { Bot } from "grammy";
import { MyContext } from "./global.types";
//
// export const menu_memecoin_info = new Menu<MyContext>("menu_memecoin_info")
//   .submenu("🟢 Buy", "submenu_memecoin_buy")
//   .submenu("🔴 Sell", "submenu_memecoin_sell")
//   .row();

export function use_menu_plugin(bot: Bot<MyContext>) {
  // const submenu_memecoin_buy = new Menu<MyContext>("submenu_memecoin_buy")
  //   .text("2 TON", async (ctx: MyContext) => {
  //     let memecoinId = ctx.session.memecoinId;
  //     let findMemecoin = await prisma.memecoin.findUnique({
  //       where: { id: memecoinId },
  //     });
  //     if (!findMemecoin) {
  //       await ctx.reply("Cannot find memecoin, contact system admin.");
  //       return;
  //     }
  //
  //     await handleBuyMeme(ctx, findMemecoin, 2);
  //   })
  //   .text("10 TON", (ctx: MyContext) => {})
  //   .row()
  //   .back("◀️ Go Back", async (ctx) => {});
  // const submenu_memecoin_sell = new Menu<MyContext>("submenu_memecoin_sell")
  //   .text("50%", (ctx: MyContext) => {})
  //   .text("80%", (ctx: MyContext) => {})
  //   .text("100%", async (ctx: MyContext) => {
  //     console.info(ctx);
  //   })
  //   .row()
  //   .back("◀️ Go Back", async (ctx) => {});
  // menu_memecoin_info.register(submenu_memecoin_buy);
  // menu_memecoin_info.register(submenu_memecoin_sell);
  // bot.use(menu_memecoin_info);
}
