/** Deterministic random-number source returning a value in the range [0, 1). */
export type RandomSource = () => number;

/** Creates one top-level benchmark record and any records nested beneath it. */
export type DataFactory<T> = (index: number, random: RandomSource) => T;

/** Optional controls for deterministic and cancellable dataset generation. */
export interface GenerateOptions {
  seed?: number;
  signal?: AbortSignal;
}
