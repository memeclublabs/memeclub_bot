import { MyContext } from "../global.types";
import { handlerSellWithPercentage } from "./handler.sell.with.percentage";

export async function clickSellWithPercentage(
  ctx: MyContext,
  data: string,
): Promise<void> {
  try {
    let split = data.split("###");
    let memecoinId = Number(split[0]);
    let percentage = Number(split[1]);
    await handlerSellWithPercentage(ctx, memecoinId, percentage);
  } catch {
    console.error("ERROR: clickSellWithPercentage", data);
    return;
  }
}
