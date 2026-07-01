type Props = {
  label: string;
  value: string;
};

export default function KpiCard({ label, value }: Props) {
  return (
    <div className="rounded-xl bg-zinc-950 p-4 text-center">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>

      <div className="mt-2 text-xl font-bold">
        {value}
      </div>
    </div>
  );
}
