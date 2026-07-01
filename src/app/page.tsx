import Link from "next/link";

import {
  actions,
  alerts,
  checklist,
  dashboardKpis,
} from "@/data/mockDriverOps";
import { getBusinessHealth } from "@/lib/analytics/businessHealth";
import { formatMoney } from "@/lib/finance/formatMoney";
import { getWeeklyTarget } from "@/lib/forecasting/weeklyTarget";
import { getDriveRecommendation } from "@/lib/recommendations/getDriveRecommendation";

export default function Home() {
  const recommendation = getDriveRecommendation();
  const businessHealth = getBusinessHealth();
  const weeklyTarget = getWeeklyTarget();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">DriverOps</h1>
            <p className="mt-2 text-zinc-400">Drive by margin, not by hope.</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-4 text-right">
            <div className="text-xs uppercase tracking-widest text-zinc-500">Business Health</div>
            <div className="mt-2 text-3xl font-bold text-emerald-400">{businessHealth.score}</div>
            <div className="mt-1 text-sm text-zinc-400">{businessHealth.label}</div>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-7">
          {dashboardKpis.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-zinc-950 p-4 text-center">
              <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
              <div className="mt-2 text-xl font-bold">{value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="text-sm uppercase tracking-wider text-zinc-500">Decision</div>

            <div className="mt-5 text-7xl font-bold text-yellow-400">{recommendation.status}</div>

            <p className="mt-5 max-w-2xl text-zinc-400">
              Current demand is below your profitability threshold. Estimated best departure time is 4:45 PM.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Metric label="Confidence" value="82%" />
              <Metric label="Expected Net" value="$165" />
              <Metric label="Recommended Start" value="4:45 PM" />
            </div>

            <div className="mt-8 rounded-xl bg-zinc-950 p-5">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Reason</div>
              <ul className="mt-4 space-y-2 text-zinc-300">
                <li>Airport arrivals increase in 71 minutes.</li>
                <li>Current demand is below target margin.</li>
                <li>Fuel cost is above weekly average.</li>
                <li>Uber should lead, Lyft should stay as backup.</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <Panel title="Today's Checklist">
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
          <DashboardMetric title="Weekly Profit" value="$842" subtitle="Target $1,250" />
          <DashboardMetric title="Net / Hour" value="$28.40" subtitle="Above Goal" />
          <DashboardMetric title="Vehicle ROI" value="87%" subtitle="Healthy" />
          <DashboardMetric title="Tax Reserve" value="$214" subtitle="Saved" />
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-wide text-zinc-500">Weekly Target</div>
              <div className="mt-2 text-2xl font-bold">{`${formatMoney(weeklyTarget.current)} / ${formatMoney(weeklyTarget.target)}`}</div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{`${weeklyTarget.percent}%`}</div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-950">
            <div className="h-full w-[67%] rounded-full bg-emerald-500" />
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
