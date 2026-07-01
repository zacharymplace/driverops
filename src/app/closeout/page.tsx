"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { scoreShift } from "@/lib/scoring/scoreShift";
import { getActiveShift, closeShift } from "@/engine/shift";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import type { Shift } from "@/types/shifts";

export default function CloseoutPage() {
  const [activeShift, setActiveShift] = useState<Shift | undefined>(() =>
    getActiveShift()
  );

  const [grossEarned, setGrossEarned] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [fuelSpent, setFuelSpent] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("0");
  const [notes, setNotes] = useState("");
  const [closedShift, setClosedShift] = useState<Shift | undefined>();

  const calculatedMiles = useMemo(() => {
    if (!activeShift?.startOdometer || !endOdometer) return milesDriven;
    return String(Number(endOdometer) - activeShift.startOdometer);
  }, [activeShift?.startOdometer, endOdometer, milesDriven]);

  function submitCloseout() {
    if (!activeShift) return;

    const vehicle = loadVehicleProfile();

    const shiftInput = {
      grossEarned: Number(grossEarned),
      milesDriven: Number(calculatedMiles),
      hoursOnline:
        (Date.now() - new Date(activeShift.startedAt).getTime()) /
        1000 /
        60 /
        60,
      fuelSpent: fuelSpent ? Number(fuelSpent) : undefined,
      otherExpenses: Number(otherExpenses),
    };

    const score = scoreShift(vehicle, shiftInput);

    const closed: Shift = {
      ...activeShift,
      status: "CLOSED",
      endedAt: new Date().toISOString(),
      endOdometer: endOdometer ? Number(endOdometer) : undefined,
      milesDriven: shiftInput.milesDriven,
      grossEarned: shiftInput.grossEarned,
      fuelSpent: shiftInput.fuelSpent,
      otherExpenses: shiftInput.otherExpenses,
      notes,
      netProfit: score.netProfit,
      netPerHour: score.netPerHour,
      netPerMile: score.netPerMile,
      taxReserve: score.taxReserve,
      vehicleReserve: score.vehicleReserve,
    };

    closeShift(closed);
    setClosedShift(closed);
    setActiveShift(undefined);
  }

  if (closedShift) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-3xl px-8 py-10">
          <h1 className="text-4xl font-bold">Shift Closed</h1>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <SummaryRow label="Net Profit" value={closedShift.netProfit} money />
            <SummaryRow label="Net / Hour" value={closedShift.netPerHour} money />
            <SummaryRow label="Net / Mile" value={closedShift.netPerMile} money />
            <SummaryRow label="Tax Reserve" value={closedShift.taxReserve} money />
            <SummaryRow label="Vehicle Reserve" value={closedShift.vehicleReserve} money />
          </section>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!activeShift) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-3xl px-8 py-10">
          <h1 className="text-4xl font-bold">Close Shift</h1>
          <p className="mt-3 text-zinc-400">No active shift found.</p>

          <Link
            href="/shift"
            className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Start Shift
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="text-4xl font-bold">Close Shift</h1>

        <p className="mt-3 text-zinc-400">
          Started {new Date(activeShift.startedAt).toLocaleString()} on{" "}
          {activeShift.platform}.
        </p>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="grid gap-5">
            <Field label="Gross earned" value={grossEarned} onChange={setGrossEarned} />
            <Field label="End odometer" value={endOdometer} onChange={setEndOdometer} />
            <Field label="Miles driven" value={calculatedMiles} onChange={setMilesDriven} />
            <Field label="Fuel spent optional" value={fuelSpent} onChange={setFuelSpent} />
            <Field label="Other expenses" value={otherExpenses} onChange={setOtherExpenses} />
          </div>

          <label className="mt-5 grid gap-2">
            <span className="text-sm text-zinc-400">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-28 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
            />
          </label>

          <button
            onClick={submitCloseout}
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            End Shift
          </button>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
  money = false,
}: {
  label: string;
  value?: number;
  money?: boolean;
}) {
  const display =
    typeof value === "number"
      ? money
        ? `$${value.toFixed(2)}`
        : value.toFixed(2)
      : "—";

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-3 last:border-b-0">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold">{display}</span>
    </div>
  );
}
