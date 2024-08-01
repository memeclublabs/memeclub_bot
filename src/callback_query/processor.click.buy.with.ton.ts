import { MyContext } from "../global.types";
import { handlerBuyWithTon } from "./handler.buy.with.ton";

export async function clickBuyWithTon(
  ctx: MyContext,
  json: string,
): Promise<void> {
  let request: { memecoinId: number; tonAmt: number };
  try {
    request = JSON.parse(json);
  } catch {
    console.error("ERROR: clickBuyWithTon", json);
    return;
  }
  await handlerBuyWithTon(ctx, request.memecoinId, request.tonAmt);
}
