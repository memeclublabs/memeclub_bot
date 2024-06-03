import { Dish, MyContext, SessionData } from "./global.types";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { Menu, MenuRange } from "@grammyjs/menu";

export function menuDemo(bot: Bot<MyContext>) {
  const dishDatabase: Dish[] = [
    { id: "pasta", name: "Pasta" },
    { id: "pizza", name: "Pizza" },
    { id: "sushi", name: "Sushi" },
  ];

  bot.use(
    session({
      initial(): SessionData {
        return { favoriteIds: [] };
      },
    }),
  );

  // Create a dynamic menu that lists all dishes in the dishDatabase,
  // one button each
  const mainText = "Pick a dish to rate it!";

  const mainMenu = new Menu<MyContext>("food");

  mainMenu.dynamic(() => {
    // todo : 在构建submenu 时候，加上
    const range = new MenuRange<MyContext>();
    for (const dish of dishDatabase) {
      range
        .submenu(
          { text: dish.name, payload: dish.id }, // label and payload
          "dish", // navigation target menu
          async (ctx) =>
              await ctx.editMessageText(dishText(dish.name), {
                parse_mode: "HTML",
              }), // handler
        )
        .row();
    }
    return range;
  });

  // Create the sub-menu that is used for rendering dishes
  const dishText = (dish: string) => `<b>${dish}</b>\n\nYour rating:`;
  const dishMenu = new Menu<MyContext>("dish");
  dishMenu.dynamic((ctx) => {
    const dish = ctx.match;
    if (typeof dish !== "string") throw new Error("No dish chosen!");
    return createDishMenu(dish);
  });
  /** Creates a menu that can render any given dish */
  function createDishMenu(dish: string) {
    return new MenuRange<MyContext>()
      .text(
        {
          text: async (ctx) =>
              await ctx.session.favoriteIds.includes(dish) ? "Yummy!" : "Meh.",
          payload: dish,
        },
        async (ctx) => {
          const set = new Set(ctx.session.favoriteIds);
          if (!set.delete(dish)) set.add(dish);
          ctx.session.favoriteIds = Array.from(set.values());
          await ctx.menu.update();
        },
      )
      .row()
      .back({ text: "X Delete", payload: dish }, async (ctx) => {
        const index = dishDatabase.findIndex((d) => d.id === dish);
        dishDatabase.splice(index, 1);
        await ctx.editMessageText("Pick a dish to rate it!");
      })
      .row()
      .back({ text: "Back", payload: dish });
  }

  mainMenu.register(dishMenu);
  bot.use(mainMenu);
  bot.command("start", async (ctx) =>
      await ctx.reply(mainText, {reply_markup: mainMenu}),
  );

  bot.catch(console.error.bind(console));
}
