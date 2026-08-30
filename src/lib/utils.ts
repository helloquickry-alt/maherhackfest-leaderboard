export function cn(
  ...classes: (
    | string
    | false
    | null
    | undefined
  )[]
) {
  return classes
    .filter(Boolean)
    .join(" ");
}

export function formatScore(
  score: number,
): string {
  if (!Number.isFinite(score)) {
    return "0";
  }

  return Number.isInteger(score)
    ? String(score)
    : score.toFixed(2);
}

export function getRankLabel(
  rank: number,
): string {
  if (rank === 1) {
    return "1st";
  }

  if (rank === 2) {
    return "2nd";
  }

  if (rank === 3) {
    return "3rd";
  }

  return `${rank}th`;
}