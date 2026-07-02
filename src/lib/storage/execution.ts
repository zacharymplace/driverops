import type { ExecutionPlan } from "@/types/execution";

const KEY = "driverops.executionPlan";

export function loadExecutionPlan(): ExecutionPlan | null {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ExecutionPlan;
  } catch {
    return null;
  }
}

export function saveExecutionPlan(plan: ExecutionPlan) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(plan));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function clearExecutionPlan() {
  if (typeof localStorage === "undefined") return;

  localStorage.removeItem(KEY);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}
