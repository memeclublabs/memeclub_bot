import { MyContext } from "../global.types";

export async function createMemeConversation(
  ctx: MyContext,
  groupId: string,
): Promise<void> {
  ctx.session.groupId = Number(groupId);
  await ctx.conversation.enter("newMemeWithValidation");
}
