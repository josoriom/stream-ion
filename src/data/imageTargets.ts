export interface ImageTarget {
  id: string;
  mz: number;
}

export const tolerancePercent = 0.125;

export const imageLevel = 0;

export const lowQuantile = 0.05;

export const highQuantile = 0.99;

export const defaultImageTargets: ImageTarget[] = [
  { id: "mz_2302", mz: 2302 },
  { id: "mz_4808", mz: 4808 },
  { id: "mz_7901", mz: 7901 },
  { id: "mz_4328", mz: 4328 },
];

export function targetId(mz: number): string {
  return `mz_${mz}`;
}

export function targetTolerance(mz: number): number {
  return (mz * tolerancePercent) / 100;
}

export function imageKey(url: string, mz: number): string {
  return `${url}|${mz}`;
}
