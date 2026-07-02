export type OperationsEventType =
  | "MISSION_CREATED"
  | "EXECUTION_PLAN_CREATED"
  | "MISSION_PROGRESS_CHECKED"
  | "EXECUTION_RECOMMENDATION_GENERATED"
  | "MISSION_CLEARED"
  | "SHIFT_CLOSED"
  | "CALIBRATION_RECORDED"
  | "LEARNING_APPLIED"
  | "POLICY_CHECKED"
  | "SIMULATION_RUN"
  | "EXPERIMENT_EVALUATED";

export type OperationsTimelineEvent = {
  id: string;
  type: OperationsEventType;
  title: string;
  detail?: string;
  entityId?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
};
