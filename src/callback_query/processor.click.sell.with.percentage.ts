import { MyContext } from "../global.types";
import { handlerSellWithPercentage } from "./handler.sell.with.percentage";

export async function processorClickSellWithPercentage(
  ctx: MyContext,
  json: string,
): Promise<void> {
  let request: { memecoinId: number; percentage: number };
  try {
    request = JSON.parse(json);
  } catch {
    console.error("ERROR: processorClickSellWithPercentage", json);
    return;
  }
  await handlerSellWithPercentage(ctx, request.memecoinId, request.percentage);
}
