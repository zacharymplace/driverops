"use client";

import Link from "next/link";

import { getEvidenceSummary } from "@/lib/evidence/evidenceEngine";
import { getForecastSet } from "@/lib/recommendations/forecasts";
import { getKnowledgeSummary } from "@/lib/knowledge/knowledgeBase";
import { getPolicyResult } from "@/lib/policy/getPolicyResult";
import { getProductValidationReport } from "@/lib/validation-report/productValidation";

export default function BriefingPage() {
  const forecast = getForecastSet().recommended;
  const evidence = getEvidenceSummary();
  const policy = getPolicyResult();
  const knowledge = getKnowledgeSummary();
  const validation = getProductValidationReport();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold">Operator Briefing</h1>
            <p className="mt-3 text-zinc-400">
              A daily view of forecast, evidence, policy, knowledge, and validation readiness.
            </p>
          </div>

          <Link href="/" className="rounded-xl border border-zinc-800 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900">
            Dashboard
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Panel title="Recommended Forecast">
            <p className="text-3xl font-bold">{forecast.label}</p>
            <p className="mt-2 text-zinc-400">
              ${forecast.expectedNet.toFixed(0)} expected net · {forecast.confidence}% confidence
            </p>
          </Panel>

          <Panel title="Policy">
            <p className={policy.allowed ? "text-3xl font-bold text-emerald-400" : "text-3xl font-bold text-red-400"}>
              {policy.allowed ? "Allowed" : "Blocked"}
            </p>
            <p className="mt-2 text-zinc-400">{policy.violations.length} policy issue(s)</p>
          </Panel>

          <Panel title="Evidence">
            <p className="text-3xl font-bold">{evidence.netEvidenceScore.toFixed(2)}</p>
            <p className="mt-2 text-zinc-400">
              Support {evidence.supportScore.toFixed(2)} · Risk {evidence.riskScore.toFixed(2)}
            </p>
          </Panel>

          <Panel title="Knowledge">
            <p className="text-3xl font-bold">{knowledge.totalItems}</p>
            <p className="mt-2 text-zinc-400">
              {knowledge.highConfidenceItems} high-confidence item(s)
            </p>
          </Panel>

          <Panel title="Validation">
            <p className="text-2xl font-bold">{validation.status}</p>
            <p className="mt-2 text-zinc-400">{validation.nextAction}</p>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="text-sm uppercase tracking-wide text-zinc-500">{title}</div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
