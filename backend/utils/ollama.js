const axios = require("axios");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = process.env.OLLAMA_MODEL || "llama3";

async function ollama(prompt) {
  const { data } = await axios.post(OLLAMA_URL, {
    model: MODEL,
    prompt,
    stream: false
  });
  return data.response.trim();
}

module.exports = ollama;
