import { ReactNode } from "react";

export default function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm uppercase tracking-wide text-zinc-500">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}
