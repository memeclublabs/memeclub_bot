import { D1Database } from "@cloudflare/workers-types";

export default interface Env {
  TELEGRAM_BOT_NAME: string;
  TELEGRAM_BOT_API_TOKEN: string;
  TELEGRAM_BOT_SECRET_TOKEN: string;
  DB: D1Database;
  // KV Namespaces
  // Declare your KV Namespaces here
  // The name of the variable must be the same as the KV Binding name
  //
  // BINDING_NAME_1: KVNamespace;
  // BINDING_NAME_2: KVNamespace;
  // ...
}
