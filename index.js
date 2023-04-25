import config from "./config.js";
import TelegramBot from "node-telegram-bot-api";

const userOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Username", callback_data: "username" },
        { text: "FirstName", callback_data: "firstname" },
        { text: "LastName", callback_data: "lastname" },
      ],
    ],
  }),
};

const start = () => {
  const bot = new TelegramBot(config.bot, { polling: true });

  bot.setMyCommands([{ command: "/username", description: "Username" }]);
  bot.on("message", async (e) => {
    console.log(e);
    const chat = e.chat.id;
    const entities = e.entities;
    if (e.text === "/username@UkrainkaGPTbot")
      return bot.sendMessage(chat, "-", userOptions);

    if (entities)
      if (entities[0].type === "mention")
        return bot.sendMessage(chat, "Відповідь");

    if (e.reply_to_message)
      if (e.reply_to_message.from.username === "UkrainkaGPTbot")
        return bot.sendMessage(chat, "Відповідь");
  });

  bot.on("callback_query", (msg) => {
    console.log(msg);
    const message = msg.message;
    const chat = message.chat.id;

    if (msg.data === "lastname")
      return bot.sendMessage(chat, msg.from.last_name);
    if (msg.data === "firstname")
      return bot.sendMessage(chat, msg.from.first_name);
    if (msg.data === "username")
      return bot.sendMessage(chat, msg.from.username);
  });
};

start();
