import gptSeervice from "./services/gptServices.js";
import { telegramServices } from "./services/telegramServices.js";

const start = () => {
  telegramServices();

};

start();
