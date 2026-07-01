export type DriveRecommendation = {
  status: "GO" | "WAIT" | "PREPARE" | "STAND_DOWN";
  confidence: number;
  expectedNet: number;
  recommendedStart: string;
  reasons: string[];
};

export function getDriveRecommendation(): DriveRecommendation {
  return {
    status: "WAIT",
    confidence: 82,
    expectedNet: 165,
    recommendedStart: "4:45 PM",
    reasons: [
      "Airport arrivals increase in 71 minutes.",
      "Current demand is below target margin.",
      "Fuel cost is above weekly average.",
      "Uber should lead, Lyft should stay as backup.",
    ],
  };
}
