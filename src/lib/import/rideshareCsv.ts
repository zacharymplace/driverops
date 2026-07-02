export type ImportedRide = {
  completedAt: string;
  grossEarned: number;
  milesDriven: number;
  hoursOnline: number;
};

export function parseRideshareCsv(csv: string): ImportedRide[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());

  return rows
    .filter(Boolean)
    .map((row) => {
      const values = row.split(",").map((v) => v.trim());
      const record = Object.fromEntries(headers.map((h, i) => [h, values[i]]));

      return {
        completedAt: record.completedAt || record.date || new Date().toISOString(),
        grossEarned: Number(record.grossEarned || record.earnings || 0),
        milesDriven: Number(record.milesDriven || record.miles || 0),
        hoursOnline: Number(record.hoursOnline || record.hours || 0),
      };
    })
    .filter(
      (ride) =>
        ride.grossEarned > 0 && ride.milesDriven >= 0 && ride.hoursOnline > 0
    );
}
