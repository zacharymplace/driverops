"use client";

import Link from "next/link";

import { getPrelaunchReadiness } from "@/lib/prelaunch/prelaunchReadiness";

export default function PrelaunchPage() {
  const readiness = getPrelaunchReadiness();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold [overflow-wrap:anywhere]">Prelaunch Mode</h1>
            <p className="mt-3 text-zinc-400">
              DriverOps is not validated until real operating data exists. Use this checklist before trusting recommendations.
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
            Readiness
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="text-5xl font-bold">{readiness.score}%</div>
              <p className="mt-3 text-zinc-400">{readiness.recommendation}</p>
            </div>

            <div
              className={
                readiness.ready
                  ? "rounded-xl bg-emerald-950 shrink-0 px-5 py-4 font-bold text-emerald-300"
                  : "rounded-xl bg-yellow-950 shrink-0 px-5 py-4 font-bold text-yellow-300"
              }
            >
              {readiness.ready ? "READY" : "PRELAUNCH"}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {readiness.checks.map((check) => (
            <div
              key={check.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <div className="font-semibold">{check.label}</div>
                  <p className="mt-1 text-sm text-zinc-400">{check.detail}</p>
                </div>

                <div
                  className={
                    check.status === "PASS"
                      ? "font-bold text-emerald-400"
                      : check.status === "NEEDS_REVIEW"
                        ? "font-bold text-yellow-300"
                        : "font-bold text-red-400"
                  }
                >
                  {check.status}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm uppercase tracking-wide text-zinc-500">
            First real-world validation loop
          </div>

          <ol className="mt-5 list-decimal space-y-2 pl-5 text-zinc-300">
            <li>Confirm vehicle costs.</li>
            <li>Run scenario simulations.</li>
            <li>Create one Mission Mode plan.</li>
            <li>Complete one real test shift.</li>
            <li>Close out the shift manually.</li>
            <li>Compare forecast against actuals.</li>
            <li>Adjust rules only after evidence exists.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
