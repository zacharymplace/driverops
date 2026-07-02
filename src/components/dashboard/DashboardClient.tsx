"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  actions,
  alerts,
  checklist,
  dashboardKpis,
} from "@/data/mockDriverOps";
import { getBusinessHealth } from "@/lib/analytics/businessHealth";
import { getEventFeed } from "@/lib/analytics/eventFeed";
import { getLatestShiftSummary } from "@/lib/analytics/latestShiftSummary";
import { getShiftMetrics } from "@/lib/analytics/shiftMetrics";
import { formatMoney } from "@/lib/finance/formatMoney";
import { getWeeklyTarget } from "@/lib/forecasting/weeklyTarget";
import { getDecisionSnapshot } from "@/lib/recommendations/getDecisionSnapshot";
import {
  getShiftHistoryAverages,
  MINIMUM_HISTORY_SHIFTS,
} from "@/lib/recommendations/historyAverages";
import { getRecommendationSource } from "@/lib/recommendations/source";

export function DashboardClient() {
  const [, refresh] = useState(0);

  useEffect(() => {
    function handleStateChange() {
      refresh((value) => value + 1);
    }

    window.addEventListener("storage", handleStateChange);
    window.addEventListener("driverops:state-change", handleStateChange);

    return () => {
      window.removeEventListener("storage", handleStateChange);
      window.removeEventListener("driverops:state-change", handleStateChange);
    };
  }, []);

  const decision = getDecisionSnapshot();
  const recommendation = decision.recommendation;
  const recommendationSource = getRecommendationSource();
  const historyAverages = getShiftHistoryAverages();
  const historyReady =
    historyAverages.closedShiftCount >= MINIMUM_HISTORY_SHIFTS;
  const businessHealth = getBusinessHealth();
  const weeklyTarget = getWeeklyTarget();
  const shiftMetrics = getShiftMetrics();
  const weeklyProgress = Math.min(
    100,
    Math.max(0, Math.round((shiftMetrics.weeklyProfit / weeklyTarget.target) * 100))
  );
  const { activeShift, latestClosedShift } = getLatestShiftSummary();
  const events = getEventFeed();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">DriverOps</h1>
            <p className="mt-2 text-zinc-400">Drive by margin, not by hope.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-right">
            <div className="text-xs uppercase tracking-widest text-zinc-500">
              Business Health
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-400">
              {businessHealth.score}
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              {businessHealth.label}
            </div>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-7">
          {dashboardKpis.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-zinc-950 p-4 text-center">
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {label}
              </div>
              <div className="mt-2 text-xl font-bold">{value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            {activeShift ? (
              <>
                <div className="text-sm uppercase tracking-wider text-zinc-500">
                  Active Shift
                </div>
                <div className="mt-5 text-6xl font-bold text-emerald-400">
                  LIVE
                </div>
                <p className="mt-5 max-w-2xl text-zinc-400">
                  {activeShift.platform} shift started{" "}
                  {new Date(activeShift.startedAt).toLocaleString()}. Close the
                  shift when finished to update profit, reserves, and weekly
                  performance.
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <Metric label="Platform" value={activeShift.platform} />
                  <Metric label="Status" value="Active" />
                  <Metric label="Next Step" value="Closeout" />
                </div>
              </>
            ) : (
              <>
                <div className="text-sm uppercase tracking-wider text-zinc-500">
                  Recommendation
                </div>

                <div className="mt-5 text-7xl font-bold text-yellow-400">
                  {recommendation.status}
                </div>

                <p className="mt-5 max-w-2xl text-zinc-400">
                  {decision.headline} Estimated best departure time is{" "}
                  {recommendation.recommendedStart}.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  <Metric label="Confidence" value={`${recommendation.confidence}%`} />
                  <Metric label="Confidence Band" value={decision.confidenceLabel} />
                  <Metric label="Expected Net" value={formatMoney(recommendation.expectedNet)} />
                  <Metric label="Recommended Start" value={recommendation.recommendedStart} />
                </div>

                {latestClosedShift && (
                  <div className="mt-8 rounded-xl bg-zinc-950 p-5">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Latest Result
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                      <Metric
                        label="Net Profit"
                        value={formatMoney(latestClosedShift.netProfit ?? 0)}
                      />
                      <Metric
                        label="Net / Hour"
                        value={formatMoney(latestClosedShift.netPerHour ?? 0)}
                      />
                      <Metric
                        label="Net / Mile"
                        value={formatMoney(latestClosedShift.netPerMile ?? 0)}
                      />
                      <Metric
                        label="Tax Reserve"
                        value={formatMoney(latestClosedShift.taxReserve ?? 0)}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <div className="rounded-xl bg-zinc-950 p-5">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Top Drivers
                    </div>

                    <div className="mt-4 space-y-3">
                      {decision.drivers.length > 0 ? (
                        decision.drivers.map((driver) => (
                          <div key={driver.label} className="rounded-lg border border-zinc-800 p-4">
                            <div className="font-semibold text-emerald-400">
                              {driver.label}
                            </div>
                            <div className="mt-1 text-sm text-zinc-400">
                              {driver.detail}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">
                          No positive drivers detected.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-950 p-5">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      Risks
                    </div>

                    <div className="mt-4 space-y-3">
                      {decision.risks.length > 0 ? (
                        decision.risks.map((risk) => (
                          <div key={risk.label} className="rounded-lg border border-zinc-800 p-4">
                            <div className="font-semibold text-red-400">
                              {risk.label}
                            </div>
                            <div className="mt-1 text-sm text-zinc-400">
                              {risk.detail}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">
                          No major risks detected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-zinc-950 p-5">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Recommendation Source
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Metric label="Source" value={recommendationSource.source} />
                    <Metric
                      label="Closed Shifts"
                      value={String(recommendationSource.shiftHistoryCount)}
                    />
                    <Metric
                      label="Inputs"
                      value={recommendationSource.inputsConfigured ? "Custom" : "Default"}
                    />
                  </div>
                  <p className="mt-4 text-sm text-zinc-400">
                    {recommendationSource.description}
                  </p>
                </div>

                <div className="mt-8 rounded-xl bg-zinc-950 p-5">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    Rule Checks
                  </div>
                  <div className="mt-4 grid gap-3">
                    {recommendation.checks.map((check) => (
                      <div
                        key={check.label}
                        className="grid gap-3 rounded-lg border border-zinc-800 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                      >
                        <div>
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Rule
                          </div>
                          <div className="mt-1 font-semibold">{check.label}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Actual
                          </div>
                          <div className="mt-1">{check.actual}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-zinc-500">
                            Threshold
                          </div>
                          <div className="mt-1">{check.threshold}</div>
                        </div>
                        <div
                          className={
                            check.passed
                              ? "font-bold text-emerald-400"
                              : "font-bold text-red-400"
                          }
                        >
                          {check.passed ? "PASS" : "MISS"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <Panel title="Today&apos;s Checklist">
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item} className="flex items-center gap-3 text-zinc-300">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </Panel>

            <Panel title="Alerts">
              <div className="space-y-3 text-zinc-300">
                {alerts.map((alert) => (
                  <div key={alert} className="rounded-lg bg-zinc-950 p-3">
                    {alert}
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-4">
          <DashboardMetric
            title="Weekly Profit"
            value={formatMoney(shiftMetrics.weeklyProfit)}
            subtitle={`Target ${formatMoney(weeklyTarget.target)}`}
          />
          <DashboardMetric
            title="Net / Hour"
            value={formatMoney(shiftMetrics.averageNetPerHour)}
            subtitle="Weekly average"
          />
          <DashboardMetric title="Vehicle ROI" value="87%" subtitle="Healthy" />
          <DashboardMetric
            title="Tax Reserve"
            value={formatMoney(shiftMetrics.weeklyTaxReserve)}
            subtitle="Saved"
          />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-wide text-zinc-500">
                Weekly Target
              </div>
              <div className="mt-2 text-2xl font-bold">
                {formatMoney(shiftMetrics.weeklyProfit)} / {formatMoney(weeklyTarget.target)}
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {weeklyProgress}%
            </div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-950">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${weeklyProgress}%` }} />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm uppercase tracking-wide text-zinc-500">
                Shift History Signal
              </div>
              <p className="mt-2 text-zinc-400">
                DriverOps starts using real shift averages after{" "}
                {MINIMUM_HISTORY_SHIFTS} closed shifts.
              </p>
            </div>
            <div
              className={
                historyReady
                  ? "rounded-xl bg-emerald-950 px-4 py-3 text-sm font-bold text-emerald-300"
                  : "rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-yellow-300"
              }
            >
              {historyReady ? "History Active" : "Collecting"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Metric
              label="Closed Shifts"
              value={`${historyAverages.closedShiftCount}/${MINIMUM_HISTORY_SHIFTS}`}
            />
            <Metric
              label="Avg Net / Hour"
              value={formatMoney(historyAverages.averageNetPerHour)}
            />
            <Metric
              label="Avg Net / Mile"
              value={formatMoney(historyAverages.averageNetPerMile)}
            />
            <Metric
              label="Avg Daily Net"
              value={formatMoney(historyAverages.averageDailyNet)}
            />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm uppercase tracking-wide text-zinc-500">
            Business Event Feed
          </div>
          <div className="mt-5 space-y-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="rounded-xl bg-zinc-950 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {event.detail && (
                    <p className="mt-2 text-sm text-zinc-400">{event.detail}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-400">No business events recorded yet.</p>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">Operations</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-600 hover:bg-zinc-800"
              >
                <h3 className="text-xl font-semibold">{action.title}</h3>
                <p className="mt-2 text-zinc-400">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardMetric({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-zinc-400">{subtitle}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-950 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm uppercase tracking-wide text-zinc-500">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
