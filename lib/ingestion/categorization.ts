const rules: Record<string, string> = {
  agent: "AI Agents",
  framework: "Agent Frameworks",
  coding: "Coding Assistants",
  rag: "RAG Tools",
  vector: "Vector Databases",
  workflow: "Workflow Automation",
  image: "Image Generation",
  video: "Video Generation",
  voice: "Audio / Voice",
  search: "Search / Research",
  security: "Security",
  eval: "Evaluation / Observability",
  training: "Fine-Tuning / Training"
};

export function inferCategory(text: string): string {
  const haystack = text.toLowerCase();
  for (const [needle, category] of Object.entries(rules)) {
    if (haystack.includes(needle)) return category;
  }
  return "Other";
}

export function extractKeywords(text: string): string[] {
  const candidates = ["agent", "rag", "vector-search", "code-generation", "local-llm", "evals", "workflows", "open-source", "multimodal", "devtools", "openai", "llama", "mcp", "github", "slack"];
  const t = text.toLowerCase();
  return candidates.filter((k) => t.includes(k.replace("-", " ")) || t.includes(k));
}
