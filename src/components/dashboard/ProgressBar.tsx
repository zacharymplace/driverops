type Props = {
  percent: number;
};

export default function ProgressBar({ percent }: Props) {
  return (
    <div className="h-4 overflow-hidden rounded-full bg-zinc-950">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
