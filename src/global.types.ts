import { Context, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { I18nFlavor } from "@grammyjs/i18n";

export interface BotConfig {
  botAdminId: number;
  isAdmin: boolean;
}
export interface Dish {
  id: string;
  name: string;
}

export interface SessionData {
  userDefinedIds: string[];
  groupId: string;
  referCode: string;
}

export type MyContext = Context &
  I18nFlavor &
  ConversationFlavor & {
    config: BotConfig;
  } & SessionFlavor<SessionData>;

export type MyConversation = Conversation<MyContext>;
