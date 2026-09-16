import type { RandomSource } from './data-generator.types';

/** Creates a deterministic Mulberry32 pseudo-random number generator. */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** Stops generation at an explicit cancellation boundary. */
export function assertGenerationNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Generation aborted', 'AbortError');
  }
}

/** Normalizes an externally supplied record count to a non-negative integer. */
export function normalizeRecordCount(count: number): number {
  return Math.max(0, Math.floor(count));
}

/** Yields so large data creation does not monopolize the browser event loop. */
export function yieldToEventLoop(): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
