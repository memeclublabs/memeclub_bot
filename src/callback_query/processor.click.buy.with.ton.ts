import { MyContext } from "../global.types";
import { handlerBuyWithTon } from "./handler.buy.with.ton";

export async function clickBuyWithTon(
  ctx: MyContext,
  data: string,
): Promise<void> {
  try {
    let split = data.split("###");
    let memecoinId = Number(split[0]);
    let tonAmt = Number(split[1]);
    await handlerBuyWithTon(ctx, memecoinId, tonAmt);
  } catch {
    console.error("ERROR: clickBuyWithTon", data);
    return;
  }
}
