import { useState, useEffect, useRef, useCallback } from "react";

const WORD_POOL = [
  "typo", "error", "node", "sync", "flux", "grid", "data", "core", "link",
  "byte", "code", "hack", "loop", "port", "scan", "void", "wave",
  "pulse", "drift", "echo", "neon", "trace", "shift", "glitch", "proxy",
  "token", "stack", "cache", "queue", "spawn", "forge", "nexus", "relay",
  "cipher", "rune", "glyph", "sigil", "arc", "mesh", "veil", "shard"
];

function getWords(n = 60) {
  return Array.from({ length: n }, () =>
    WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
  );
}

export function useTypingGame(duration = 60, words = null) {
  const [_words] = useState(() => words || getWords(60));
  const activeWords = _words;  // stable — remount via key to change words
  const [input, setInput] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  // Per-second snapshot: [{second, mpm, accuracy}]
  const [snapshots, setSnapshots] = useState([]);
  const timerRef = useRef(null);
  const correctRef = useRef(0);
  const errorsRef = useRef(0);
  const elapsedRef = useRef(0);

  const start = useCallback(() => {
    if (!started) setStarted(true);
  }, [started]);

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        const elapsed = elapsedRef.current;
        const snap = {
          second: elapsed,
          mpm: Math.round((correctRef.current / elapsed) * 60),
          accuracy: correctRef.current + errorsRef.current === 0
            ? 100
            : Math.round((correctRef.current / (correctRef.current + errorsRef.current)) * 100)
        };
        setSnapshots(s => [...s, snap]);

        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  const handleInput = useCallback((val) => {
    if (finished) return;
    start();

    if (val.endsWith(" ")) {
      const typed = val.trim();
      if (typed === activeWords[wordIndex]) {
        correctRef.current += 1;
        setCorrectWords(c => c + 1);
      } else {
        errorsRef.current += 1;
        setErrors(e => e + 1);
      }
      setWordIndex(i => i + 1);
      setInput("");
    } else {
      setInput(val);
    }
  }, [finished, start, activeWords, wordIndex]);

  const elapsed = duration - timeLeft;
  const mpm = finished
    ? Math.round((correctWords / duration) * 60)
    : Math.round((correctWords / Math.max(1, elapsed)) * 60);

  const accuracy = correctWords + errors === 0
    ? 100
    : Math.round((correctWords / (correctWords + errors)) * 100);

  return { words: activeWords, input, wordIndex, timeLeft, mpm, accuracy, finished, handleInput, snapshots };
}
