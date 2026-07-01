"use client";

import { useMemo, useState } from "react";

import type { VehicleProfile } from "@/types/driverops";
import { formatMoney } from "@/lib/finance/formatMoney";
import { getVehicleCostSummary } from "@/lib/finance/vehicleCosts";
import {
  loadVehicleProfile,
  saveVehicleProfile,
} from "@/lib/storage/vehicleProfile";

const sections: {
  title: string;
  fields: {
    key: keyof VehicleProfile;
    label: string;
    helper: string;
    suffix?: string;
  }[];
}[] = [
  {
    title: "Monthly Costs",
    fields: [
      {
        key: "monthlyPayment",
        label: "Monthly payment",
        helper: "Lease, loan, or rental cost assigned to the business vehicle.",
        suffix: "$",
      },
      {
        key: "monthlyInsurance",
        label: "Monthly insurance",
        helper: "Insurance cost for the vehicle, including rideshare coverage if applicable.",
        suffix: "$",
      },
    ],
  },
  {
    title: "Fuel",
    fields: [
      {
        key: "mpg",
        label: "MPG",
        helper: "Average fuel efficiency used to estimate fuel cost per mile.",
      },
      {
        key: "fuelPricePerGallon",
        label: "Fuel price / gallon",
        helper: "Average local fuel price used for shift margin estimates.",
        suffix: "$",
      },
    ],
  },
  {
    title: "Per-Mile Costs",
    fields: [
      {
        key: "maintenancePerMile",
        label: "Maintenance / mile",
        helper: "Reserve for oil, brakes, tires, service, and repairs.",
        suffix: "$",
      },
      {
        key: "depreciationPerMile",
        label: "Depreciation / mile",
        helper: "Estimated loss in vehicle value for every business mile driven.",
        suffix: "$",
      },
    ],
  },
  {
    title: "Taxes",
    fields: [
      {
        key: "taxReserveRate",
        label: "Tax reserve rate",
        helper: "Percent of gross earnings reserved for taxes. Use 0.22 for 22%.",
        suffix: "%",
      },
    ],
  },
];

export default function SetupPage() {
  const [profile, setProfile] = useState<VehicleProfile>(() => loadVehicleProfile());
  const [saved, setSaved] = useState(false);

  const summary = useMemo(() => getVehicleCostSummary(profile), [profile]);

  function updateField(key: keyof VehicleProfile, value: string) {
    const parsed = Number(value);

    setProfile((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? parsed : 0,
    }));

    setSaved(false);
  }

  function save() {
    saveVehicleProfile(profile);
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <header>
          <h1 className="text-4xl font-bold">Vehicle Setup</h1>

          <p className="mt-3 text-zinc-400">
            Define the operating assumptions DriverOps uses to calculate margin.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm uppercase tracking-wide text-zinc-500">
            Vehicle
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Primary Business Vehicle</h2>
              <p className="mt-2 text-zinc-400">
                Vehicle identity will be editable once fleet support is added.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-950 px-5 py-4 text-right">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                Profile Status
              </div>
              <div className="mt-1 text-lg font-bold text-emerald-400">
                Active
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h2 className="text-sm uppercase tracking-wide text-zinc-500">
                  {section.title}
                </h2>

                <div className="mt-5 grid gap-5">
                  {section.fields.map((field) => (
                    <label key={field.key} className="grid gap-2">
                      <span className="text-sm text-zinc-300">{field.label}</span>

                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 px-4">
                        <input
                          type="number"
                          step="0.01"
                          value={profile[field.key]}
                          onChange={(event) =>
                            updateField(field.key, event.target.value)
                          }
                          className="w-full bg-transparent py-3 text-white outline-none"
                        />

                        {field.suffix && (
                          <span className="text-zinc-500">{field.suffix}</span>
                        )}
                      </div>

                      <span className="text-xs text-zinc-500">
                        {field.helper}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={save}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Save Vehicle Profile
            </button>

            {saved && (
              <p className="text-sm text-emerald-400">
                Vehicle profile saved.
              </p>
            )}
          </section>

          <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="text-sm uppercase tracking-wide text-zinc-500">
              Estimated Operating Cost
            </div>

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Fixed / month"
                value={formatMoney(summary.fixedMonthlyCost)}
              />

              <SummaryRow
                label="Fuel / mile"
                value={`$${summary.fuelPerMile.toFixed(3)}`}
              />

              <SummaryRow
                label="Variable / mile"
                value={`$${summary.variablePerMile.toFixed(3)}`}
              />

              <div className="border-t border-zinc-800 pt-4">
                <SummaryRow
                  label="Total / mile"
                  value={`$${summary.totalPerMile.toFixed(3)}`}
                  strong
                />
              </div>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              This summary excludes platform fees and real-time demand. It is the cost baseline used before shift revenue is evaluated.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-zinc-400">{label}</span>
      <span className={strong ? "text-2xl font-bold" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
