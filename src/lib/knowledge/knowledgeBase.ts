import { DEFAULT_KNOWLEDGE_ITEMS } from "@/lib/knowledge/defaultKnowledge";
import { loadKnowledgeItems, saveKnowledgeItems } from "@/lib/storage/knowledge";
import type { KnowledgeItem, KnowledgeSummary } from "@/types/knowledge";

export function getKnowledgeItems(): KnowledgeItem[] {
  const saved = loadKnowledgeItems();

  if (saved.length > 0) return saved;

  return DEFAULT_KNOWLEDGE_ITEMS;
}

export function seedDefaultKnowledge() {
  const existing = loadKnowledgeItems();

  if (existing.length > 0) return existing;

  saveKnowledgeItems(DEFAULT_KNOWLEDGE_ITEMS);
  return DEFAULT_KNOWLEDGE_ITEMS;
}

export function getKnowledgeSummary(): KnowledgeSummary {
  const items = getKnowledgeItems();

  return {
    totalItems: items.length,
    highConfidenceItems: items.filter((item) => item.confidence === "HIGH")
      .length,
    demandPatterns: items.filter((item) => item.type === "DEMAND_PATTERN")
      .length,
    costAssumptions: items.filter((item) => item.type === "COST_ASSUMPTION")
      .length,
    latestItem:
      [...items].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0] ?? null,
  };
}
