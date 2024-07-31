import { Bot } from "grammy";
import { MyContext } from "../global.types";

export function on_message(bot: Bot<MyContext>) {
  bot.on("message", async (ctx) => {
    await ctx.reply(" " + ctx.msg?.text);
  });
  // bot.on("message", async (ctx) => {
  //   let msg_text = ctx.message.text;
  //
  //   if ("404" ==  msg_text) {
  //     await ctx
  //       .reply(
  //         "Welcome to ART 404 group",
  //         {
  //           parse_mode: "MarkdownV2",
  //             link_preview_options:{is_disabled:true}
  //         },
  //       )
  //       .catch((reason) => {
  //         console.error(reason);
  //       });
  //   }else if ("welcome"  == msg_text ) {
  //     await ctx
  //         .reply(
  //             "Welcome all new artists!\n\nART 404 is the first project which implement the ERC404 protocol on the Artela network, enhances NFT transaction liquidity through native support for NFT fragmentation.\n\n",
  //             {
  //               parse_mode: "HTML",
  //                 link_preview_options:{is_disabled:true}
  //             },
  //         )
  //         .catch((reason) => {
  //           console.error(reason);
  //         });
  //   }else if ("group_info"  == msg_text ) {
  //
  //       console.info(JSON.stringify(ctx));
  //
  //       let chatId = ctx.message.chat.id;
  //       let number = await ctx.api.getChatMemberCount(chatId);
  //       await ctx
  //           .reply(
  //               `group member count: ${number}`,
  //
  //           )
  //           .catch((reason) => {
  //               console.error(reason);
  //           });
  //
  //       // 如果在Private Chat中调用则异常
  //       // Error in middleware while handling update 434236390 GrammyError: Call to 'getChatAdministrators' failed! (400: Bad Request: there are no administrators in the private chat)
  //       let newVar = await ctx.api.getChatAdministrators(chatId);
  //
  //       console.log(newVar);
  //       console.info(JSON.stringify(newVar));
  //
  //       await ctx
  //           .reply(
  //               JSON.stringify(newVar),
  //
  //           )
  //           .catch((reason) => {
  //               console.error(reason);
  //           });
  //
  //   }
  //
  // });
}
