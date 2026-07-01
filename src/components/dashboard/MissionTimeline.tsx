const items = [
  ["✓", "Vehicle Ready"],
  ["✓", "Fuel Check"],
  ["○", "Position to Airport"],
  ["○", "Begin Shift"],
  ["○", "Reach Goal"],
  ["○", "Close Shift"],
];

export default function MissionTimeline() {
  return (
    <div className="space-y-3">
      {items.map(([icon, label]) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-lg bg-zinc-950 p-3"
        >
          <span className="font-bold">{icon}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
