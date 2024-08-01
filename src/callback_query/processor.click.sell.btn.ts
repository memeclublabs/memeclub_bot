import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handlerClickSellBtn } from "./handler.click.sell.btn";

export async function processorClickSellBtn(
  ctx: MyContext,
  memecoinId: string,
): Promise<void> {
  if (!memecoinId) {
    await contactAdminWithError(ctx, memecoinId);
  }
  await handlerClickSellBtn(ctx, Number(memecoinId));
}
