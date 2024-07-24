// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    API_URL: string;
    PORT: number;
    TELEGRAM_BOT_NAME: string;
    TELEGRAM_BOT_API_TOKEN: string;
    TELEGRAM_BOT_SECRET_TOKEN: string;
  }
}
