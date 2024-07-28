// src/ton-connect/storage.ts

import { IStorage } from "@tonconnect/sdk";

// temporary storage implementation. We will replace it with the redis later
const storage = new Map<string, string>();

export class TonConnectStorage implements IStorage {
  // we need to have different stores for different users
  constructor(private readonly chatId: number) {}

  private getKey(key: string): string {
    // we will simply have different keys prefixes for different users
    return this.chatId.toString() + key;
  }

  async removeItem(key: string): Promise<void> {
    storage.delete(this.getKey(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    storage.set(this.getKey(key), value);
  }

  async getItem(key: string): Promise<string | null> {
    return storage.get(this.getKey(key)) || null;
  }
}
