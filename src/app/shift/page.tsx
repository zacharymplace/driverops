"use client";

import { useState } from "react";
import Link from "next/link";

import { getActiveShift, startShift } from "@/engine/shift";
import type { Shift } from "@/types/shifts";

const platforms: Shift["platform"][] = [
  "Uber",
  "Lyft",
  "DoorDash",
  "Instacart",
  "Other",
];

export default function ShiftPage() {
  const [platform, setPlatform] = useState<Shift["platform"]>("Uber");
  const [startOdometer, setStartOdometer] = useState("");
  const [activeShift, setActiveShift] = useState<Shift | undefined>(() =>
    getActiveShift()
  );

  function beginShift() {
    const odometer = startOdometer ? Number(startOdometer) : undefined;
    const shift = startShift(platform, odometer);
    setActiveShift(shift);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="text-4xl font-bold">Plan Shift</h1>

        <p className="mt-3 text-zinc-400">
          Start a working session so DriverOps can calculate real margin.
        </p>

        {activeShift ? (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="text-sm uppercase tracking-wide text-zinc-500">
              Active Shift
            </div>

            <div className="mt-4 text-2xl font-bold">
              {activeShift.platform}
            </div>

            <p className="mt-2 text-zinc-400">
              Started {new Date(activeShift.startedAt).toLocaleString()}
            </p>

            <Link
              href="/closeout"
              className="mt-6 inline-block rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Close Shift
            </Link>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <label className="grid gap-2">
              <span className="text-sm text-zinc-400">Primary platform</span>

              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value as Shift["platform"])
                }
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
              >
                {platforms.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="mt-5 grid gap-2">
              <span className="text-sm text-zinc-400">
                Start odometer optional
              </span>

              <input
                type="number"
                value={startOdometer}
                onChange={(event) => setStartOdometer(event.target.value)}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none"
              />
            </label>

            <button
              onClick={beginShift}
              className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Start Shift
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
