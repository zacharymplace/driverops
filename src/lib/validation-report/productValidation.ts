import { getForecastSet } from "@/lib/recommendations/forecasts";
import { getLearningSummary } from "@/lib/learning/learningEngine";
import { getTimelineSummary } from "@/lib/timeline/timelineSummary";
import { loadMissionReviews } from "@/lib/storage/reviews";

export type ProductValidationReport = {
  forecastCount: number;
  reviewCount: number;
  timelineEvents: number;
  calibrationCount: number;
  status: "READY_FOR_REAL_DATA" | "NEEDS_MORE_USAGE";
  nextAction: string;
};

export function getProductValidationReport(): ProductValidationReport {
  const forecasts = getForecastSet();
  const learning = getLearningSummary();
  const timeline = getTimelineSummary();
  const reviews = loadMissionReviews();

  const ready =
    forecasts.forecasts.length > 0 &&
    timeline.totalEvents >= 3 &&
    reviews.length >= 1;

  return {
    forecastCount: forecasts.forecasts.length,
    reviewCount: reviews.length,
    timelineEvents: timeline.totalEvents,
    calibrationCount: learning.calibrationCount,
    status: ready ? "READY_FOR_REAL_DATA" : "NEEDS_MORE_USAGE",
    nextAction: ready
      ? "Import real rideshare history and compare recommendations against actual outcomes."
      : "Run Mission Mode, close a shift, and generate at least one review.",
  };
}
