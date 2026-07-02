export const ARCHITECTURE_FREEZE_STATUS = {
  frozen: true,
  phase: "pre-operations-alpha",
  reason:
    "Architecture is frozen so DriverOps can move from subsystem expansion to real-world validation.",
  allowedChanges: [
    "bug fixes",
    "UI polish",
    "copy improvements",
    "real data import improvements",
    "validation reports",
    "persistence hardening",
    "onboarding improvements",
    "accessibility improvements",
    "tests",
    "documentation",
  ],
  blockedChanges: [
    "new engines",
    "new conceptual layers",
    "new decision subsystems",
    "major recommendation pipeline rewrites",
    "weaker prelaunch warnings",
    "reduced test coverage",
  ],
  validationTargets: {
    completedMissions: 5,
    closeouts: 5,
    forecastComparisons: 5,
    importedRealDataFiles: 1,
    weeklyReviews: 1,
  },
} as const;

export function isArchitectureChangeAllowed(changeType: string) {
  return ARCHITECTURE_FREEZE_STATUS.allowedChanges.includes(
    changeType as (typeof ARCHITECTURE_FREEZE_STATUS.allowedChanges)[number]
  );
}
