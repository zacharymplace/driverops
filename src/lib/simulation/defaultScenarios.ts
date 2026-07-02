import type { SimulationScenario } from "@/types/simulation";

export const DEFAULT_SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "fuel-up-20",
    label: "Fuel +20%",
    description: "Fuel costs rise by 20%.",
    fuelPriceMultiplier: 1.2,
    demandMultiplier: 1,
    confidenceMultiplier: 1,
    vehicleCostMultiplier: 1,
  },
  {
    id: "demand-down-15",
    label: "Demand -15%",
    description: "Expected demand drops by 15%.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 0.85,
    confidenceMultiplier: 0.95,
    vehicleCostMultiplier: 1,
  },
  {
    id: "vehicle-cost-up-50",
    label: "Vehicle Cost +50%",
    description: "Maintenance and depreciation assumptions rise by 50%.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 1,
    confidenceMultiplier: 0.95,
    vehicleCostMultiplier: 1.5,
  },
  {
    id: "strong-market",
    label: "Strong Market",
    description: "Demand and confidence improve together.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 1.18,
    confidenceMultiplier: 1.08,
    vehicleCostMultiplier: 1,
  },
];
