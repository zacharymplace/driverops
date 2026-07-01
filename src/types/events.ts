export type BusinessEventType =
  | "VEHICLE_PROFILE_UPDATED"
  | "SHIFT_STARTED"
  | "SHIFT_CLOSED"
  | "CHECK_PASSED";

export type BusinessEvent = {
  id: string;
  type: BusinessEventType;
  title: string;
  detail?: string;
  createdAt: string;
};
