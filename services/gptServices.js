import { Configuration, OpenAIApi } from "openai";

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
        apiKey: "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",
      });
      openai = new OpenAIApi(configuration);
    } catch (error) {
      console.log(error.response);
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
