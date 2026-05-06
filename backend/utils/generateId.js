function generateUniqueId() {
  const prefixes = ["CYB", "TRD", "NEO"];
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefixes[Math.floor(Math.random() * prefixes.length)] + "-" + rand;
}

async function createUniqueIdWithRetry(isAvailable, maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const candidate = generateUniqueId();
    if (await isAvailable(candidate)) return candidate;
  }
  throw new Error("Unable to generate a unique ID");
}

module.exports = generateUniqueId;
module.exports.createUniqueIdWithRetry = createUniqueIdWithRetry;
