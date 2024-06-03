import { Bot, NextFunction } from "grammy";
import { MyContext } from "./global.types";
import { I18n } from "@grammyjs/i18n";

export function register_i18n(bot: Bot<MyContext>) {
  const i18n = new I18n<MyContext>({
    defaultLocale: "en",
    directory: "locales", // Load all translation files from locales/.
  });
  bot.use(i18n);
}
