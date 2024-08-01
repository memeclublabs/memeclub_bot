import { Context, SessionFlavor } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { I18nFlavor } from "@grammyjs/i18n";

export interface BotConfig {
  botAdminId: number;
  isAdmin: boolean;
}

export interface SessionData {
  userDefinedIds?: string[];
  referCode?: string;
  groupId?: number;
  memecoinId?: number;
}

export type MyContext = Context &
  I18nFlavor &
  ConversationFlavor & {
    config: BotConfig;
  } & SessionFlavor<SessionData>;

export type MyConversation = Conversation<MyContext>;
