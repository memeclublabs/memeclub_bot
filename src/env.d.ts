// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    API_URL: string;
    PORT: number;
    NODE_ENV: "dev" | "production";
    CHAIN_NETWORK: "Testnet" | "Mainnet";
    PHRASES_1: string;
    PHRASES_2: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_BOT_NAME: string;
    TELEGRAM_BOT_LINK: string;
    BACKEND_SERVICE_URL: string;
  }
}
