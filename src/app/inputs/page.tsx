"use client";

import { useState } from "react";
import Link from "next/link";

import {
  loadRecommendationInputs,
  saveRecommendationInputs,
} from "@/lib/storage/recommendationInputs";
import type { RecommendationInputs } from "@/types/recommendationInputs";

const fields: {
  key: keyof RecommendationInputs;
  label: string;
  helper: string;
  suffix?: string;
}[] = [
  {
    key: "estimatedNetPerHour",
    label: "Estimated net / hour",
    helper: "Current estimate of hourly margin after costs and reserves.",
    suffix: "$",
  },
  {
    key: "estimatedNetPerMile",
    label: "Estimated net / mile",
    helper: "Current estimate of margin per mile after fuel and vehicle wear.",
    suffix: "$",
  },
  {
    key: "estimatedDailyNet",
    label: "Estimated daily net",
    helper: "Expected net result for the recommended work window.",
    suffix: "$",
  },
  {
    key: "marketDemandScore",
    label: "Market demand score",
    helper: "Manual market confidence score from 0 to 100.",
  },
  {
    key: "fuelPricePerGallon",
    label: "Fuel price / gallon",
    helper: "Fuel price used in recommendation checks.",
    suffix: "$",
  },
];

export default function InputsPage() {
  const [inputs, setInputs] = useState<RecommendationInputs>(() =>
    loadRecommendationInputs()
  );
  const [saved, setSaved] = useState(false);

  function updateField(key: keyof RecommendationInputs, value: string) {
    const parsed = Number(value);

    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));

    setSaved(false);
  }

  function save() {
    saveRecommendationInputs(inputs);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold [overflow-wrap:anywhere]">Recommendation Inputs</h1>

            <p className="mt-3 max-w-2xl text-zinc-400">
              Edit the current market and earnings estimates that feed the
              DriverOps recommendation engine.
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
                    value={inputs[field.key]}
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
            Save Inputs
          </button>

          {saved && (
            <p className="mt-4 text-sm text-emerald-400">
              Inputs saved. Dashboard recommendations will use these estimates.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
