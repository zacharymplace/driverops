import type { DriverRules } from "@/types/rules";
import { DEFAULT_DRIVER_RULES } from "@/lib/rules/defaultRules";

const KEY = "driverops.rules";

export function loadDriverRules(): DriverRules {
  if (typeof localStorage === "undefined") return DEFAULT_DRIVER_RULES;

  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_DRIVER_RULES;

  try {
    return {
      ...DEFAULT_DRIVER_RULES,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_DRIVER_RULES;
  }
}

export function saveDriverRules(rules: DriverRules) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(rules));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}
