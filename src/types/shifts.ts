export type ShiftStatus = "ACTIVE" | "CLOSED";

export type Shift = {
  id: string;
  status: ShiftStatus;
  startedAt: string;
  endedAt?: string;
  platform: "Uber" | "Lyft" | "DoorDash" | "Instacart" | "Other";
  startOdometer?: number;
  endOdometer?: number;
  milesDriven?: number;
  grossEarned?: number;
  fuelSpent?: number;
  otherExpenses?: number;
  notes?: string;
  netProfit?: number;
  netPerHour?: number;
  netPerMile?: number;
  taxReserve?: number;
  vehicleReserve?: number;
};
