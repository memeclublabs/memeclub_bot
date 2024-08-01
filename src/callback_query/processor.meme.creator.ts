import { MyContext } from "../global.types";

export async function createMemeConversation(
  ctx: MyContext,
  groupId: string,
): Promise<void> {
  let groupId1 = Number(groupId);
  ctx.session.groupId = groupId1;
  await ctx.conversation.enter("newMemeWithValidation");
}
