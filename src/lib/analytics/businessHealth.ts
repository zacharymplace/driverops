export type BusinessHealth = {
  score: number;
  label: string;
};

export function getBusinessHealth(): BusinessHealth {
  return {
    score: 94,
    label: "Excellent",
  };
}
