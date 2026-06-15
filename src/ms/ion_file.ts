import { init, parseIon, type SampleFile } from 'msutils';

const cache_size = 64 * 1024 * 1024;

export async function open_ion_file(url: string): Promise<SampleFile> {
  await init();
  return parseIon(new URL(url), { maxCacheSize: cache_size });
}
