import config from "../config.js";
import TelegramBot from "node-telegram-bot-api";
import gptSeervice from "./gptServices.js";

const history = {};

// const userOptions = {
//   reply_markup: JSON.stringify({
//     inline_keyboard: [
//       [
//         { text: "Username", callback_data: "username" },
//         { text: "FirstName", callback_data: "firstname" },
//         { text: "LastName", callback_data: "lastname" },
//       ],
//     ],
//   }),
// };
const gpt = new gptSeervice();

const bot = new TelegramBot(config.bot, { polling: true });
export const telegramServices = () => {
  gpt.init();

  bot.on("message", async (e) => {
    console.log(e);
    if (e.entities) {
      if (e.entities[0].type === "mention") {
        return sendGPT(e, true);
      }
      if (e.entities[0].type === "bot_command") {
        const promt = e.text
          .replace(["/image"], "")
          .replace(["@UkrainkaGPTbot"], "");
        // const promt = e.text.slice(e.text.indexOf(" ") + 1);

        console.log(promt);
        if (promt.length > 4) {
          gpt.getImage(promt, (url) => {
            bot.sendPhoto(e.chat.id, url);
          });
        } else {
          bot.sendMessage(e.chat.id, "Short message");
        }
        return;
      }
    }

    if (e.reply_to_message)
      if (e.reply_to_message.from.username === "UkrainkaGPTbot") {
        return sendGPT(e);
      }
  });
};

function sendGPT(e, isNew) {
  const chat = e.chat.id;
  const user = e.from.id;
  let message = e.text;
  if (isNew) message = message.slice(message.indexOf(" ") + 1);

  if (!history[chat]) history[chat] = {};
  if (!history[chat][user] || isNew)
    history[chat][user] = {
      messages: [],
    };

  history[chat][user].messages.push({
    role: "user",
    content: message,
  });

  try {
    return gpt.sendChatMessage(history[chat][user].messages, (res, tokens) => {
      history[chat][user].messages.push(res[0].message);
      bot.sendMessage(chat, res[0].message.content + `(${tokens})`);
    });
  } catch (error) {
    console.log(error);
  }
}
