import { calculateEic, type SampleFile } from 'msutils';

export interface Point {
  x: number;
  y: number;
}

export async function get_eic(
  file: SampleFile,
  mz: number,
  time_range: { from: number; to: number },
): Promise<{ points: Point[] }> {
  const eic = await calculateEic(file, mz, time_range);
  return { points: to_points(eic.x, eic.y) };
}

function to_points(x: Float64Array, y: Float64Array): Point[] {
  const points: Point[] = new Array(x.length);
  for (let i = 0; i < x.length; i += 1) {
    points[i] = { x: x[i], y: y[i] };
  }
  return points;
}
