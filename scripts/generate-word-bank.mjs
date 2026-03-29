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
    .filter(({ word, definition }) => !isDerivedWordFamilyDefinition(word, definition))
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

function isDerivedWordFamilyDefinition(word, definition) {
  const reference = extractReferenceWord(definition);

  if (!reference || !sharesStem(word, reference)) {
    return false;
  }

  const boundaryMatch = definition.match(
    /^(?:Of or pertaining to|Pertaining to|Relating to|Having the form of|Of the nature of|Resembling)\s+.+?(?<boundary>[.;]|$)/i,
  );
  const tail = boundaryMatch
    ? definition.slice(boundaryMatch[0].length).trim()
    : "";

  if (!tail) {
    return true;
  }

  const tailSentences = tail
    .replace(/^;\s*/, "")
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  return tailSentences.length > 0
    && tailSentences.every((sentence) => isDependentTailSentence(sentence, word, reference));
}

function extractReferenceWord(definition) {
  const match = definition.match(
    /^(?:Of or pertaining to|Pertaining to|Relating to|Having the form of|Of the nature of|Resembling)\s+(.+?)(?:[.;]|$)/i,
  );

  if (!match) {
    return null;
  }

  const reference = match[1]
    .replace(/^(?:an?|the)\s+/i, "")
    .split(/\s+(?:or|and)\s+/i)[0]
    .split(/\s+/)[0]
    .replace(/[^a-z-]/gi, "");

  return reference || null;
}

function isDependentTailSentence(sentence, word, reference) {
  if (/^(?:as,|see\b|cf\.\b)/i.test(sentence)) {
    return true;
  }

  if (/^[A-Z][A-Za-z.'&-]*(?:\s+[A-Z][A-Za-z.'&-]*)*\.?$/.test(sentence)) {
    return true;
  }

  const [firstToken = ""] = sentence.split(/\s+/);
  const firstWord = normalizeWord(firstToken);

  if (firstWord && sharesStem(firstWord, word)) {
    return true;
  }

  const havingMatch = sentence.match(/^having\s+([A-Za-z-]+)/i);
  if (havingMatch && sharesStem(havingMatch[1], reference)) {
    return true;
  }

  return false;
}

function sharesStem(left, right) {
  const normalizedLeft = normalizeWord(left);
  const normalizedRight = normalizeWord(right);

  if (!normalizedLeft || !normalizedRight) {
    return false;
  }

  const prefixLength = getCommonPrefixLength(normalizedLeft, normalizedRight);
  return prefixLength >= 5
    && prefixLength / Math.min(normalizedLeft.length, normalizedRight.length) >= 0.6;
}

function normalizeWord(word) {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

function getCommonPrefixLength(left, right) {
  let index = 0;

  while (index < left.length && index < right.length && left[index] === right[index]) {
    index += 1;
  }

  return index;
}

function hash(text) {
  let value = 2166136261;

  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }

  return value >>> 0;
}
