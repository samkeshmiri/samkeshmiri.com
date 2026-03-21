import { wordBank } from "../data/wordBank.js";

const WORD_OF_DAY_TIME_ZONE = "Europe/London";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: WORD_OF_DAY_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getWordOfDay(date = new Date()) {
  const dateKey = getDateKey(date);
  const index = hash(dateKey) % wordBank.length;
  return wordBank[index];
}

function getDateKey(date) {
  const parts = Object.fromEntries(
    dateFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function hash(text) {
  let value = 2166136261;

  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }

  return value >>> 0;
}
