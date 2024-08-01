import { MyContext } from "../global.types";
import { contactAdminWithError } from "../com.utils";
import prisma from "../prisma";
import { sendPrivateChatMemecoinInfo } from "../service/msg/tg.msg.sender";

export async function processorShowMemecoinInfo(
  ctx: MyContext,
  memecoinId: string,
): Promise<void> {
  if (!memecoinId) {
    await contactAdminWithError(ctx, memecoinId);
  }

  let findMemecoin = await prisma.memecoin.findUnique({
    where: { id: Number(memecoinId) },
  });
  if (!findMemecoin) {
    let errorInfo = `Memecoin ${memecoinId} not found.`;
    console.error(errorInfo);
    await ctx.reply(errorInfo);
    return;
  }
  let findGroup = await prisma.group.findUnique({
    where: { groupId: Number(findMemecoin.groupId) },
  });
  if (!findGroup) {
    let errorInfo = `Group ${findMemecoin.groupId} not found.`;
    console.error(errorInfo);
    await ctx.reply(errorInfo);
    return;
  }
  await sendPrivateChatMemecoinInfo(ctx, findGroup, findMemecoin);
}
