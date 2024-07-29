# GrammY Built-in Session

https://grammy.dev/plugins/session



Grammy 的 Session 和 Web 开发中的 Session 有很大的不同，这里的 Session 更多是给 bot 用的。

Session 数据默认存储在内存中。因此一旦您的机器人停止，所有数据都会丢失。
当您开发机器人或运行自动测试（无需数据库设置）时，这很方便， 但是，这在生产中很可能是不需要的。
在生产中，您可能希望将数据保留在文件、数据库或其他存储中。

如下代码，在定义 session 的时候，storage 默认是 MemorySessionStorage。

```bash
bot.use(session({
  initial: ...
  storage: new MemorySessionStorage() // also the default value
}));

```


## Storage Adapters

默认情况下，所有数据都将存储在 RAM 中。这意味着一旦您的机器人停止，所有会话都会丢失。

Grammy 提供了一个免费的存储如下所示，用于测试和实验性项目。
```bash
import { freeStorage } from "@grammyjs/storage-free";

bot.use(session({
  initial: ...
  storage: freeStorage<SessionData>(bot.token),
}));

```

TODO ： 可选的存储到 PostgreSQL，等多个服务实例的时候需要
https://github.com/grammyjs/storages/tree/main/packages/psql






