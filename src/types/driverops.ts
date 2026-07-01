export type VehicleProfile = {
  monthlyPayment: number;
  monthlyInsurance: number;
  mpg: number;
  fuelPricePerGallon: number;
  maintenancePerMile: number;
  depreciationPerMile: number;
  taxReserveRate: number;
};

export type ShiftCloseout = {
  grossEarned: number;
  milesDriven: number;
  hoursOnline: number;
  fuelSpent?: number;
  otherExpenses: number;
};

export type ShiftScore = {
  netProfit: number;
  netPerHour: number;
  netPerMile: number;
  taxReserve: number;
  vehicleReserve: number;
  recommendation: "DRIVE" | "CONDITIONAL" | "DO_NOT_DRIVE";
};
