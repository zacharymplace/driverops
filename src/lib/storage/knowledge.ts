import type { KnowledgeItem } from "@/types/knowledge";

const KEY = "driverops.knowledge";

export function loadKnowledgeItems(): KnowledgeItem[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as KnowledgeItem[];
  } catch {
    return [];
  }
}

export function saveKnowledgeItems(items: KnowledgeItem[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(items));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function upsertKnowledgeItem(item: KnowledgeItem) {
  const existing = loadKnowledgeItems();
  const withoutCurrent = existing.filter((candidate) => candidate.id !== item.id);

  saveKnowledgeItems([item, ...withoutCurrent]);
}
