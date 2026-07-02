import { getKnowledgeItems } from "@/lib/knowledge/knowledgeBase";
import { getSimulationSet } from "@/lib/simulation/simulationEngine";
import { loadMissionReviews } from "@/lib/storage/reviews";
import { loadShifts } from "@/lib/storage/shifts";
import { loadTimelineEvents } from "@/lib/storage/timeline";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import type { PrelaunchCheck, PrelaunchReadiness } from "@/types/prelaunch";

export function getPrelaunchReadiness(): PrelaunchReadiness {
  const vehicle = loadVehicleProfile();
  const shifts = loadShifts();
  const reviews = loadMissionReviews();
  const timeline = loadTimelineEvents();
  const simulations = getSimulationSet();
  const knowledge = getKnowledgeItems();

  const checks: PrelaunchCheck[] = [
    {
      id: "vehicle-costs",
      label: "Vehicle cost assumptions",
      detail: "Fuel, mileage, maintenance, depreciation, and tax reserve are configured.",
      status:
        vehicle.milesPerGallon > 0 &&
        vehicle.fuelPricePerGallon > 0 &&
        vehicle.maintenancePerMile >= 0 &&
        vehicle.depreciationPerMile >= 0 &&
        vehicle.taxReserveRate > 0
          ? "PASS"
          : "MISSING",
    },
    {
      id: "knowledge-base",
      label: "Starting knowledge base",
      detail: "Default operating knowledge is available before real data exists.",
      status: knowledge.length > 0 ? "PASS" : "MISSING",
    },
    {
      id: "simulations",
      label: "Simulated missions",
      detail: "Run scenario simulations before trusting live recommendations.",
      status: simulations.scenarios.length >= 3 ? "PASS" : "MISSING",
    },
    {
      id: "timeline",
      label: "Operations timeline",
      detail: "Mission events should be recorded once dry runs or real shifts begin.",
      status: timeline.length > 0 ? "PASS" : "NEEDS_REVIEW",
    },
    {
      id: "real-shifts",
      label: "Real shift history",
      detail: "At least one completed real shift is needed before recommendations should be trusted.",
      status: shifts.length > 0 ? "PASS" : "MISSING",
    },
    {
      id: "mission-reviews",
      label: "Mission reviews",
      detail: "At least one review is needed before learning can be trusted.",
      status: reviews.length > 0 ? "PASS" : "MISSING",
    },
  ];

  const passCount = checks.filter((check) => check.status === "PASS").length;
  const score = Math.round((passCount / checks.length) * 100);

  return {
    ready: checks.every((check) => check.status === "PASS"),
    score,
    checks,
    recommendation:
      score >= 100
        ? "Ready for cautious live use."
        : "Do not trust recommendations yet. Complete prelaunch checks, run simulated missions, then complete one real test shift.",
  };
}
