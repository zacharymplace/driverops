"use client";

import { useState } from "react";
import Link from "next/link";

import { saveDriverRules, loadDriverRules } from "@/lib/storage/rules";
import type { DriverRules } from "@/types/rules";

const fields: {
  key: keyof DriverRules;
  label: string;
  helper: string;
  suffix?: string;
}[] = [
  {
    key: "minimumNetPerHour",
    label: "Minimum net / hour",
    helper: "DriverOps will avoid recommending work below this hourly margin.",
    suffix: "$",
  },
  {
    key: "minimumNetPerMile",
    label: "Minimum net / mile",
    helper: "Protects against trips that convert vehicle wear into cash.",
    suffix: "$",
  },
  {
    key: "targetDailyNet",
    label: "Target daily net",
    helper: "Expected take-home target after fuel, wear, expenses, and reserves.",
    suffix: "$",
  },
  {
    key: "maxFuelPricePerGallon",
    label: "Max fuel price / gallon",
    helper: "Used to downgrade recommendations when fuel costs are elevated.",
    suffix: "$",
  },
  {
    key: "preferredStartHour",
    label: "Preferred start hour",
    helper: "24-hour clock. Example: 17 means 5:00 PM.",
  },
  {
    key: "latestStartHour",
    label: "Latest start hour",
    helper: "24-hour clock. Example: 20 means 8:00 PM.",
  },
];

export default function RulesPage() {
  const [rules, setRules] = useState<DriverRules>(() => loadDriverRules());
  const [saved, setSaved] = useState(false);

  function updateField(key: keyof DriverRules, value: string) {
    const parsed = Number(value);

    setRules((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));

    setSaved(false);
  }

  function save() {
    saveDriverRules(rules);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">Rules Settings</h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Define the thresholds DriverOps uses to decide whether you should
              drive, prepare, wait, or stand down.
            </p>
          </div>

          <Link
            href="/"
            className="shrink-0 rounded-xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Dashboard
          </Link>
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="grid gap-5">
            {fields.map((field) => (
              <label key={field.key} className="grid gap-2">
                <span className="text-sm text-zinc-300">{field.label}</span>

                <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 px-4">
                  <input
                    type="number"
                    step="0.01"
                    value={rules[field.key]}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    className="w-full bg-transparent py-3 text-white outline-none"
                  />

                  {field.suffix && (
                    <span className="text-zinc-500">{field.suffix}</span>
                  )}
                </div>

                <span className="text-xs text-zinc-500">{field.helper}</span>
              </label>
            ))}
          </div>

          <button
            onClick={save}
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Save Rules
          </button>

          {saved && (
            <p className="mt-4 text-sm text-emerald-400">
              Rules saved. Dashboard recommendations will use these thresholds.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
