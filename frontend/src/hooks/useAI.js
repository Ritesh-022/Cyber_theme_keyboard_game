import { useState } from "react";
import api from "../utils/api";

export function useAI() {
  const [loading, setLoading] = useState(false);

  const generateText = async (level = "medium") => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/generate-text", { level });
      return data.text;
    } finally {
      setLoading(false);
    }
  };

  const analyze = async (mpm, accuracy, mistakes = []) => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/analyze", { mpm, accuracy, mistakes });
      return data.feedback;
    } finally {
      setLoading(false);
    }
  };

  const practice = async (weakKeys) => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/practice", { weakKeys });
      return data.text;
    } finally {
      setLoading(false);
    }
  };

  return { generateText, analyze, practice, loading };
}
