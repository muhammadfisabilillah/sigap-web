import { randomInt } from 'node:crypto';

export function generateNomorTiket(): string {
  const now = new Date();
  const tanggal = [
    now.getFullYear().toString(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const acak = randomInt(0, 1_000_000).toString().padStart(6, '0');
  return `SGP-${tanggal}-${acak}`;
}
