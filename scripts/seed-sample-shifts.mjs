import { writeFileSync } from "node:fs";

const count = Number(process.argv[2] ?? 5);
const now = Date.now();

const shifts = Array.from({ length: count }, (_, index) => {
  const startedAt = new Date(now - (index + 1) * 24 * 60 * 60 * 1000);
  const endedAt = new Date(startedAt.getTime() + 4 * 60 * 60 * 1000);

  const netProfit = 120 + index * 8;
  const netPerHour = netProfit / 4;
  const milesDriven = 86 + index * 5;
  const netPerMile = netProfit / milesDriven;

  return {
    id: `sample-shift-${index + 1}`,
    status: "CLOSED",
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    platform: index % 2 === 0 ? "Uber" : "Lyft",
    milesDriven,
    grossEarned: 190 + index * 10,
    fuelSpent: 14 + index,
    otherExpenses: 0,
    notes: "Seeded sample shift for Hybrid mode testing.",
    netProfit,
    netPerHour,
    netPerMile,
    taxReserve: 40 + index * 2,
    vehicleReserve: 22 + index,
  };
});

const payload = JSON.stringify(shifts, null, 2);
const browserCommand = `localStorage.setItem("driverops.shifts", ${JSON.stringify(
  JSON.stringify(shifts)
)}); window.dispatchEvent(new Event("driverops:state-change")); location.reload();`;

writeFileSync("sample-shifts.json", payload + "\n");

console.log("Wrote sample-shifts.json");
console.log("");
console.log("Paste this into your browser console on http://localhost:3000:");
console.log("");
console.log(browserCommand);
