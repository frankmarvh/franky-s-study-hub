import OpenAI from "openai";

const apiKey =
  process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing OPENAI_API_KEY.",
  );
}

export const openai =
  new OpenAI({
    apiKey,

    timeout: 60_000,

    maxRetries: 2,
  });

export const OPENAI_MODEL =
  process.env.OPENAI_MODEL ||
  "gpt-5.5";
