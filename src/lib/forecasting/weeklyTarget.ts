export type WeeklyTarget = {
  current: number;
  target: number;
  percent: number;
};

export function getWeeklyTarget(): WeeklyTarget {
  const current = 842;
  const target = 1250;

  return {
    current,
    target,
    percent: Math.round((current / target) * 100),
  };
}
