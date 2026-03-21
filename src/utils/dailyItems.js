import { getWordOfDay } from "./wordOfDay.js";

export function getDailyItems(date = new Date()) {
  const wordOfDay = getWordOfDay(date);

  return [
    {
      label: "Word of the day",
      text: `${wordOfDay.word}: ${wordOfDay.definition}`,
    },
  ];
}
