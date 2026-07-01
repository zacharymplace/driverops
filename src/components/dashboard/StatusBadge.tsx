type Props = {
  status: "GO" | "WAIT" | "PREPARE" | "STAND DOWN";
};

const colors = {
  GO: "text-emerald-400",
  WAIT: "text-yellow-400",
  PREPARE: "text-blue-400",
  "STAND DOWN": "text-red-400",
};

export default function StatusBadge({ status }: Props) {
  return (
    <div className={`text-7xl font-bold ${colors[status]}`}>
      {status}
    </div>
  );
}
