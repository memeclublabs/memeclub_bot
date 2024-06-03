# wrangler 


# webhookCallback 适配器区别

- cloudflare
- cloudflare-mod


[Cloudflare Workers 现已支持 JavaScript 模块](https://blog.cloudflare.com/zh-cn/workers-javascript-modules-zh-cn/)

```javascript
// 旧的 “Service Worker”API 模式
addEventListener("fetch", (event) => {
  event.respondWith(new Response("Hello Worker!"));
}

```

```javascript
// 新的 JavaScript 模块也称为 ECMAScript（缩略为“ES”）模块 模式
export default {
  async fetch(request, environment, context) {
    return new Response("I’m a module!");
  },
  async scheduled(controller, environment, context) {
    // await doATask();
  }
}
```


# 相关产品

 - R2：S3
 - D1：SQL Database
 - Queues：发送和接受消息
 - Durable Objects：强一致性存储
 - KV：全局KV存储，类似 MongoDB
 - Zaraz：第三方服务上云加速
