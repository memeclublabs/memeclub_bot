# Conversation


## 一、通用输入等待 wait()

一个 update 可以意味着用户发送了一条文本消息，或者按下了一个按钮，或者编辑了一些东西，或者是任何其他用户执行的动作。 
请在 [这里](https://core.telegram.org/bots/api#update) 参考 Telegram 官方文档。
```bash

  // 等待下一个 update：
  const newContext = await conversation.wait();

```


### wait() 输入类型判断

```bash
async function waitForText(conversation: MyConversation, ctx: MyContext) {
  // 等待下一个 update：
  ctx = await conversation.wait();
  // 检查文本消息：
  if (ctx.message?.text) {
    // ...
  }
  
  // 检查图片消息：
  if (ctx.message?.photo) {
    // ...
  }
      
    await ctx.reply("发给我一张照片！");
    const { message } = await conversation.wait();
    if (!message?.photo) {
      await ctx.reply("啊，这不是一张照片！");
      return;
    }
  
}

```

## 二、等待过滤器 waitFor()

通过 [API 参考](https://grammy.dev/ref/conversations/conversationhandle#wait) 来查看所有与 wait 类似的方法。

```bash
 // 等待下一个文本消息的 update：
  const { msg: { text } } = await conversation.waitFor("message:text");
```

```bash
const ticker = await conversation.waitFor(":text");

// 等待下一个图片消息
const ticker = await conversation.waitFor(":photo");
```