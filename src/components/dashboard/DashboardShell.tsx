"use client";

import dynamic from "next/dynamic";

const DashboardClient = dynamic(
  () =>
    import("@/components/dashboard/DashboardClient").then(
      (module) => module.DashboardClient
    ),
  {
    ssr: false,
    loading: () => <DashboardLoading />,
  }
);

export function DashboardShell() {
  return <DashboardClient />;
}

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="h-10 w-48 rounded-xl bg-zinc-900" />
        <div className="mt-4 h-5 w-64 rounded-xl bg-zinc-900" />

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-2xl border border-zinc-800 bg-zinc-900"
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="h-96 rounded-2xl border border-zinc-800 bg-zinc-900" />
          <div className="h-96 rounded-2xl border border-zinc-800 bg-zinc-900" />
        </div>
      </div>
    </main>
  );
}
