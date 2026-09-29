"use client";

import { useState } from "react";
import Link from "next/link";

import { createSampleClosedShifts } from "@/lib/dev/sampleShifts";
import { createDriverOpsSnapshotJson } from "@/lib/export/driverOpsSnapshot";

export default function DevPage() {
  const [message, setMessage] = useState("");

  function exportSnapshot() {
    const snapshot = createDriverOpsSnapshotJson();
    const blob = new Blob([snapshot], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `driverops-snapshot-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    anchor.click();

    URL.revokeObjectURL(url);
    setMessage("DriverOps snapshot exported.");
  }

  function seedSampleShifts() {
    const shifts = createSampleClosedShifts(5);

    localStorage.setItem("driverops.shifts", JSON.stringify(shifts));
    window.dispatchEvent(new Event("driverops:state-change"));

    setMessage("Seeded 5 sample closed shifts. Hybrid mode should now be active.");
  }

  function clearShifts() {
    localStorage.removeItem("driverops.shifts");
    window.dispatchEvent(new Event("driverops:state-change"));

    setMessage("Cleared all saved shifts.");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold [overflow-wrap:anywhere]">Dev Tools</h1>

            <p className="mt-3 text-zinc-400">
              Local-only utilities for testing DriverOps behavior quickly.
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
          <div className="text-sm uppercase tracking-wide text-zinc-500">
            Sample Shift Data
          </div>

          <p className="mt-3 text-zinc-400">
            Seed 5 closed shifts to test shift-history averages and Hybrid mode.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={seedSampleShifts}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                Seed Sample Shifts
              </button>

              <button
                onClick={exportSnapshot}
                className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Export Snapshot
              </button>
            </div>

            <button
              onClick={clearShifts}
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
            >
              Clear Shifts
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-xl bg-zinc-950 p-4 text-sm text-zinc-300">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
