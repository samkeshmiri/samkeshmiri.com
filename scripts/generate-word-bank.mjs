import fs from "node:fs/promises";

const SOURCE_PATH = new URL("../src/data/dictionary.json", import.meta.url);
const OUTPUT_PATH = new URL("../src/data/wordBank.js", import.meta.url);
const WORD_COUNT = 730;

const blockedDefinitionPattern =
  /(Bot\.|Zo[oö]l\.|Surg\.|Chem\.|Law\.|Math\.|Med\.|Mil\.|Min\.|Phys\.|Anat\.|Gram\.|Logic|Theol\.|Arch\.|Mus\.|Elec\.|Geol\.|Astron\.|Naut\.)/i;
const blockedDefinitionStartPattern =
  /^(See\b|Same as\b|Alt\. of\b|(A|An) (genus|species|family|division|group|class|order)\b)/i;
const blockedCitationPattern =
  /(Halliwell|Bacon|Longfellow|Shak\.|Milton|Dryden|Spenser|Johnson|Cowper|Ure\.|Dana\.|Brande)/i;
const blockedGrammarPattern =
  /(past or preterit tense|comparative of|superlative of|pl\. of|sing\. of|p\. p\.|p\. pr\.|obs\. form)/i;

const source = JSON.parse(await fs.readFile(SOURCE_PATH, "utf8"));

const wordBank = [...new Map(
  source
    .flatMap((group) => Object.entries(group))
    .map(([word, definition]) => ({
      word: word.toLowerCase(),
      definition: cleanDefinition(definition),
    }))
    .filter(({ word, definition }) => /^[a-z]+$/.test(word))
    .filter(({ word }) => word.length >= 5 && word.length <= 11)
    .filter(({ definition }) => definition.length >= 28 && definition.length <= 140)
    .filter(({ definition }) => !blockedDefinitionStartPattern.test(definition))
    .filter(({ definition }) => !blockedDefinitionPattern.test(definition))
    .filter(({ definition }) => !blockedCitationPattern.test(definition))
    .filter(({ definition }) => !blockedGrammarPattern.test(definition))
    .filter(({ definition }) => !/\d/.test(definition))
    .filter(({ definition }) => !/--/.test(definition))
    .filter(({ definition }) => !/Note:/.test(definition))
    .filter(({ definition }) => /[.!?]$/.test(definition))
    .sort((left, right) => hash(`${left.word}:${left.definition}`) - hash(`${right.word}:${right.definition}`))
    .slice(0, WORD_COUNT)
    .map((entry) => [entry.word, entry]),
).values()];

const fileContents = `${[
  "// Generated from src/data/dictionary.json by scripts/generate-word-bank.mjs.",
  "// Re-run `node scripts/generate-word-bank.mjs` after updating the source dictionary.",
  `export const wordBank = ${JSON.stringify(wordBank, null, 2)};`,
  "",
].join("\n")}`;

await fs.writeFile(OUTPUT_PATH, fileContents, "utf8");

function cleanDefinition(definition) {
  return definition
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*Syn\..*$/i, "")
    .replace(/\s*Cf\..*$/i, "")
    .trim();
}

function hash(text) {
  let value = 2166136261;

  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }

  return value >>> 0;
}
