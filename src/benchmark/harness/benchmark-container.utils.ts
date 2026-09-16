import type { DatasetSizeEventDetail } from './benchmark-container.types';

/** Converts story controls and custom-event values to valid dataset sizes. */
export function normalizeDatasetSize(value: number): number {
  return Math.max(0, Math.floor(Number(value) || 0));
}

/** Reads a valid numeric size from the harness custom event. */
export function readDatasetSizeEvent(event: Event): number | undefined {
  const size = (event as CustomEvent<DatasetSizeEventDetail>).detail?.size;
  return typeof size === 'number' ? normalizeDatasetSize(size) : undefined;
}

/** Converts unknown generation failures to a browser-visible message. */
export function getGenerationErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
