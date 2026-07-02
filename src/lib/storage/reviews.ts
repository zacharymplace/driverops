import type { MissionReview } from "@/types/review";

const KEY = "driverops.reviews";

export function loadMissionReviews(): MissionReview[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as MissionReview[];
  } catch {
    return [];
  }
}

export function saveMissionReviews(reviews: MissionReview[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(reviews));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function addMissionReview(review: MissionReview) {
  saveMissionReviews([review, ...loadMissionReviews()]);
}
