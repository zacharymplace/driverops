"use client";

import Link from "next/link";
import { useState } from "react";

import {
  calculateExecutionProgress,
  createExecutionPlan,
  evaluateExecutionProgress,
} from "@/lib/execution/executionEngine";
import {
  clearExecutionPlan,
  loadExecutionPlan,
  saveExecutionPlan,
} from "@/lib/storage/execution";
import { recordTimelineEvent } from "@/lib/storage/timeline";
import { formatMoney } from "@/lib/finance/formatMoney";
import type {
  ExecutionPlan,
  ExecutionProgress,
  ExecutionRecommendation,
} from "@/types/execution";

export default function MissionPage() {
  const [plan, setPlan] = useState<ExecutionPlan | null>(() =>
    loadExecutionPlan()
  );
  const [grossEarned, setGrossEarned] = useState("");
  const [hoursElapsed, setHoursElapsed] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [progress, setProgress] = useState<ExecutionProgress | null>(null);
  const [recommendation, setRecommendation] =
    useState<ExecutionRecommendation | null>(null);

  function createPlan() {
    const nextPlan = createExecutionPlan();

    saveExecutionPlan(nextPlan);
    recordTimelineEvent({
      type: "MISSION_CREATED",
      title: "Mission created",
      detail: "Execution plan created from the current recommended forecast.",
      entityId: nextPlan.id,
      metadata: {
        targetNet: nextPlan.targetNet,
        targetNetPerHour: nextPlan.targetNetPerHour,
        plannedDurationHours: nextPlan.plannedDurationHours,
      },
    });
    setPlan(nextPlan);
    setProgress(null);
    setRecommendation(null);
  }

  function clearPlan() {
    clearExecutionPlan();
    recordTimelineEvent({
      type: "MISSION_CLEARED",
      title: "Mission cleared",
      detail: "Saved execution plan was cleared.",
      entityId: plan?.id,
    });
    setPlan(null);
    setProgress(null);
    setRecommendation(null);
  }

  function updateProgress() {
    if (!plan) return;

    const nextProgress = calculateExecutionProgress({
      plan,
      grossEarned: Number(grossEarned),
      hoursElapsed: Number(hoursElapsed),
      milesDriven: Number(milesDriven),
    });

    const nextRecommendation = evaluateExecutionProgress({
      plan,
      progress: nextProgress,
    });

    recordTimelineEvent({
      type: "MISSION_PROGRESS_CHECKED",
      title: "Mission progress checked",
      detail: nextRecommendation.detail,
      entityId: plan.id,
      metadata: {
        grossEarned: nextProgress.grossEarned,
        hoursElapsed: nextProgress.hoursElapsed,
        milesDriven: nextProgress.milesDriven,
        estimatedNet: nextProgress.estimatedNet,
        estimatedNetPerHour: nextProgress.estimatedNetPerHour,
        recommendation: nextRecommendation.status,
      },
    });

    setProgress(nextProgress);
    setRecommendation(nextRecommendation);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold [overflow-wrap:anywhere]">Mission Mode</h1>
            <p className="mt-3 text-zinc-400">
              Plan, monitor, and adapt a shift using DriverOps execution logic.
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
            Execution Plan
          </div>

          {plan ? (
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <Metric label="Target Net" value={formatMoney(plan.targetNet)} />
              <Metric
                label="Target / Hour"
                value={formatMoney(plan.targetNetPerHour)}
              />
              <Metric
                label="Duration"
                value={`${plan.plannedDurationHours.toFixed(1)} hr`}
              />
              <Metric
                label="Stop Loss"
                value={formatMoney(plan.stopLossNetPerHour)}
              />
            </div>
          ) : (
            <p className="mt-4 text-zinc-400">
              No mission plan created yet.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={createPlan}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Create Execution Plan
            </button>

            {plan && (
              <button
                onClick={clearPlan}
                className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Clear Plan
              </button>
            )}
          </div>
        </section>

        {plan && (
          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="text-sm uppercase tracking-wide text-zinc-500">
              Live Progress Check
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <NumberField
                label="Gross Earned"
                value={grossEarned}
                onChange={setGrossEarned}
              />
              <NumberField
                label="Hours Elapsed"
                value={hoursElapsed}
                onChange={setHoursElapsed}
              />
              <NumberField
                label="Miles Driven"
                value={milesDriven}
                onChange={setMilesDriven}
              />
            </div>

            <button
              onClick={updateProgress}
              className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Evaluate Progress
            </button>

            {progress && recommendation && (
              <div className="mt-8 rounded-xl bg-zinc-950 p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Execution Recommendation
                    </div>
                    <div
                      className={
                        recommendation.status === "CONTINUE"
                          ? "mt-2 text-4xl font-bold text-emerald-400"
                          : recommendation.status === "CHECK"
                            ? "mt-2 text-4xl font-bold text-yellow-300"
                            : "mt-2 text-4xl font-bold text-red-400"
                      }
                    >
                      {recommendation.status}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <Metric
                      label="Estimated Net"
                      value={formatMoney(progress.estimatedNet)}
                    />
                    <Metric
                      label="Net / Hour"
                      value={formatMoney(progress.estimatedNetPerHour)}
                    />
                    <Metric
                      label="Variance"
                      value={formatMoney(recommendation.varianceFromTarget)}
                    />
                  </div>
                </div>

                <p className="mt-5 text-zinc-400">{recommendation.detail}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function NumberField({
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-950 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
