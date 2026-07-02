import type { Experiment, ExperimentResult } from "@/types/experiments";

const EXPERIMENTS_KEY = "driverops.experiments";
const RESULTS_KEY = "driverops.experimentResults";

export function loadExperiments(): Experiment[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(EXPERIMENTS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Experiment[];
  } catch {
    return [];
  }
}

export function saveExperiments(experiments: Experiment[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(EXPERIMENTS_KEY, JSON.stringify(experiments));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function loadExperimentResults(): ExperimentResult[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(RESULTS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ExperimentResult[];
  } catch {
    return [];
  }
}

export function saveExperimentResults(results: ExperimentResult[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}
