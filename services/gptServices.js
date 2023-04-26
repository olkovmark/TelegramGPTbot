import { Configuration, OpenAIApi } from "openai";
import config from "../config.js";
const model = {
  model: "gpt-3.5-turbo",
  temperature: 0.2,
  max_tokens: 1000,
};
let openai;
export default class gptSeervice {
  async init() {
    try {
      const configuration = new Configuration({
        apiKey: config.gpt,
      });
      openai = new OpenAIApi(configuration);
    } catch (error) {
      console.log(error);
    }
  }

  async sendChatMessage(messages, res) {
    try {
      const response = await openai.createChatCompletion({
        ...model,
        messages,
      });
      res(response.data.choices, response.data.usage.total_tokens);
    } catch (error) {
      if (error.response) console.log("error", error.response.data);
      return console.log(error);
    }
  }
}
