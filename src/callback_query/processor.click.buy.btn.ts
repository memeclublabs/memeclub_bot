import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import { handlerClickBuyBtn } from "./handler.click.buy.btn";

export async function processorClickBuyBtn(
  ctx: MyContext,
  memecoinId: string,
): Promise<void> {
  if (!memecoinId) {
    await contactAdminWithError(ctx, memecoinId);
  }
  await handlerClickBuyBtn(ctx, Number(memecoinId));
}
