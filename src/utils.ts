export function isNearlyEqual(a: number, b: number): bool {
  return Math.abs(a - b) * 1000 < 1;
}
