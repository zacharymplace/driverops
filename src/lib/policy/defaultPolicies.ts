import type { PolicyRule } from "@/types/policy";

export const DEFAULT_POLICY_RULES: PolicyRule[] = [
  {
    id: "minimum-hourly-net",
    label: "Minimum Hourly Net",
    severity: "BLOCKER",
    description: "Do not recommend driving below $25 net per hour.",
  },
  {
    id: "maximum-work-hours",
    label: "Maximum Work Hours",
    severity: "BLOCKER",
    description: "Do not recommend shifts longer than 10 hours.",
  },
  {
    id: "minimum-confidence",
    label: "Minimum Confidence",
    severity: "WARNING",
    description: "Warn when recommendation confidence is below 70%.",
  },
  {
    id: "tax-reserve",
    label: "Tax Reserve",
    severity: "WARNING",
    description: "Warn when tax reserve rate is below 25%.",
  },
  {
    id: "vehicle-cost-floor",
    label: "Vehicle Cost Floor",
    severity: "BLOCKER",
    description: "Do not recommend driving when net per mile is below vehicle cost per mile.",
  },
];
