import StatusBadge from "./StatusBadge";
import KpiCard from "./KpiCard";

export default function OperationsBrief() {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

      <div className="text-sm uppercase tracking-wider text-zinc-500">
        Operations Brief
      </div>

      <div className="mt-6">
        <StatusBadge status="WAIT" />
      </div>

      <p className="mt-5 max-w-2xl text-zinc-400">
        Airport arrivals are increasing.
        Current margin is below target.
        Wait approximately 38 minutes before starting.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <KpiCard label="Confidence" value="82%" />
        <KpiCard label="Expected Net" value="$165" />
        <KpiCard label="Start Time" value="4:45 PM" />
      </div>

    </section>
  );
}
