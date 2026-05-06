const router = require("express").Router();
const ollama = require("../utils/ollama");
const auth = require("../middleware/authMiddleware");

// Generate a typing passage
router.post("/generate-text", auth, async (req, res) => {
  const requested = String(req.body.level || "medium").toLowerCase();
  const level = ["easy", "medium", "hard"].includes(requested) ? requested : "medium";

  const prompt = `You are generating text for a keyboard typing game. Output ONLY the passage — no titles, no quotes, no explanation, no markdown.
Difficulty: ${level === "easy" ? "short common words, max 5 letters each" : level === "hard" ? "technical jargon, compound words, uncommon vocabulary" : "mix of short and medium words"}
Style: blend cyberpunk and ancient/traditional language — e.g. "the oracle compiled silence into stone"
Length: 40 to 50 words exactly.
Output: raw words only, plain text, single paragraph.`;  

  try {
    const text = await ollama(prompt);
    res.json({ text });
  } catch {
    res.status(503).json({ error: "Ollama not running. Start with: ollama run llama3" });
  }
});

// Analyze performance and return coaching tips
router.post("/analyze", auth, async (req, res) => {
  const mpm = Number(req.body.mpm);
  const accuracy = Number(req.body.accuracy);
  const mistakes = Array.isArray(req.body.mistakes)
    ? req.body.mistakes.slice(0, 20).map((m) => String(m).slice(0, 24))
    : [];

  if (!Number.isFinite(mpm) || !Number.isFinite(accuracy)) {
    return res.status(400).json({ error: "mpm and accuracy must be numbers" });
  }

  const prompt = `Typing coach. User stats: ${mpm} MPM, ${accuracy}% accuracy${mistakes.length ? `, struggled with: ${mistakes.join(", ")}` : ""}.
Write exactly 3 improvement tips. Rules:
- No markdown, no bold, no asterisks, no headers
- Each tip is one sentence, max 20 words
- Start each with a number and period: "1. ", "2. ", "3. "
- Be direct and specific, no filler phrases
Output only the 3 lines, nothing else.`;  

  try {
    const feedback = await ollama(prompt);
    res.json({ feedback });
  } catch {
    res.status(503).json({ error: "Ollama not running. Start with: ollama run llama3" });
  }
});

// Generate practice text targeting weak keys
router.post("/practice", auth, async (req, res) => {
  const weakKeys = Array.isArray(req.body.weakKeys)
    ? req.body.weakKeys.slice(0, 20).map((k) => String(k).trim()).filter(Boolean)
    : [];

  if (!weakKeys?.length)
    return res.status(400).json({ error: "Provide weakKeys array" });

  const prompt = `Typing practice passage. Must heavily repeat these letters/patterns: ${weakKeys.join(", ")}. Cyber-traditional style. 40 words. Plain text only, no explanation, no quotes.`;  

  try {
    const text = await ollama(prompt);
    res.json({ text });
  } catch {
    res.status(503).json({ error: "Ollama not running. Start with: ollama run llama3" });
  }
});

module.exports = router;
