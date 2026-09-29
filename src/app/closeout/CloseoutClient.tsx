"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { scoreShift } from "@/lib/scoring/scoreShift";
import {
  formatMetric,
  getShiftDurationMinutes,
  isReliableHourlyRate,
} from "@/lib/finance/profitGuards";
import { getActiveShift, closeShift } from "@/engine/shift";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import { validateShiftCloseout } from "@/lib/validation/shiftCloseout";
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewedAt] = useState(() => Date.now());

  const calculatedMiles = useMemo(() => {
    if (!activeShift?.startOdometer || !endOdometer) return milesDriven;
    return String(Number(endOdometer) - activeShift.startOdometer);
  }, [activeShift, endOdometer, milesDriven]);

  const liveScore = useMemo(() => {
    if (!activeShift) return undefined;

    const gross = Number(grossEarned);
    const miles = Number(calculatedMiles);
    const expenses = Number(otherExpenses);

    if (!Number.isFinite(gross) || !Number.isFinite(miles)) return undefined;

    return scoreShift(loadVehicleProfile(), {
      grossEarned: gross,
      milesDriven: miles,
      hoursOnline:
        (previewedAt - new Date(activeShift.startedAt).getTime()) /
        1000 /
        60 /
        60,
      fuelSpent: fuelSpent ? Number(fuelSpent) : undefined,
      otherExpenses: Number.isFinite(expenses) ? expenses : 0,
    });
  }, [activeShift, calculatedMiles, fuelSpent, grossEarned, otherExpenses, previewedAt]);

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

    const validation = validateShiftCloseout(shiftInput);

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors([]);

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
            <SummaryRow
              label="Net / Hour"
              value={
                isReliableHourlyRate(
                  getShiftDurationMinutes(closedShift.startedAt, closedShift.endedAt)
                )
                  ? formatMetric(closedShift.netPerHour, { money: true })
                  : "Collecting data"
              }
            />
            <SummaryRow label="Net / Mile" value={closedShift.netPerMile} money />
            <SummaryRow label="Estimated Taxes" value={formatMetric(closedShift.taxReserve, { money: true })} />
            <SummaryRow label="Vehicle Wear" value={formatMetric(closedShift.vehicleReserve, { money: true })} />
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

          {liveScore && (
            <section className="mt-6 rounded-xl bg-zinc-950 p-5">
              <div className="text-sm uppercase tracking-wide text-zinc-500">
                Live Profit Preview
              </div>

              <div className="mt-4 grid gap-3">
                <SummaryRow label="Estimated Net Profit" value={liveScore.netProfit} money />
                <SummaryRow
                  label="Net / Hour"
                  value={
                    isReliableHourlyRate(
                      getShiftDurationMinutes(activeShift.startedAt)
                    )
                      ? formatMetric(liveScore.netPerHour, { money: true })
                      : "Collecting data"
                  }
                />
                <SummaryRow label="Net / Mile" value={liveScore.netPerMile} money />
                <SummaryRow label="Estimated Taxes" value={formatMetric(liveScore.taxReserve, { money: true })} />
                <SummaryRow label="Vehicle Wear" value={formatMetric(liveScore.vehicleReserve, { money: true })} />
              </div>
            </section>
          )}

          {validationErrors.length > 0 && (
            <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-5">
              <div className="font-semibold text-red-300">
                Closeout needs attention
              </div>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-red-200">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

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
  value?: number | string;
  money?: boolean;
}) {
  const display =
    typeof value === "string"
      ? value
      : typeof value === "number"
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
