

## InlineKeyboard 的 text 数据翻译

```TypeScript
let inlineKeyboard = new InlineKeyboard()
    .text("1", "11")
    .text("2", "二二") //callback_data
    .row()
    .text("3", "33");

await ctx.reply("inlineKeyboard", { reply_markup: inlineKeyboard });
```


```JSON
{"reply_markup": {
      "inline_keyboard": [
        [
          {
            "text": "1",
            "callback_data": "11"
          },
          {
            "text": "2",
            "callback_data": "二二"
          }
        ],
        [
          {
            "text": "3",
            "callback_data": "33"
          }
        ]
      ]
    }
}
```



最终的 callback 消息，最终的 "data" 字段是真实点击的按钮

```JSON
{
  "id": "2086464781613424491",
  "from": {
    "id": 6928243882,
    "is_bot": false,
    "first_name": "Andy",
    "last_name": "King",
    "username": "AndySkyKing",
    "language_code": "en"
  },
  "message": {
    "message_id": 177,
    "from": {
      "id": 7212911867,
      "is_bot": true,
      "first_name": "MemeClub AppBot",
      "username": "MemeClubAppBot"
    },
    "chat": {
      "id": 6928243882,
      "first_name": "Andy",
      "last_name": "King",
      "username": "AndySkyKing",
      "type": "private"
    },
    "text": "inlineKeyboard",
    "reply_markup": {
      "inline_keyboard": [
        [
          {
            "text": "1",
            "callback_data": "11"
          },
          {
            "text": "2",
            "callback_data": "22"
          }
        ],
        [
          {
            "text": "3",
            "callback_data": "33"
          }
        ]
      ]
    }
  },
  "data": "33"
}


```