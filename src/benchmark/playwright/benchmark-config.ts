import {
  DEFAULT_DATASET_SIZES,
  DEFAULT_INTERACTION_WINDOW_MS,
} from './benchmark.constants';
import type {
  PerformanceScenario,
  ResolvedPerformanceConfiguration,
} from './benchmark.types';

/** Applies shared defaults and validates a scenario before browser work begins. */
export function resolvePerformanceConfiguration(
  scenario: PerformanceScenario,
): ResolvedPerformanceConfiguration {
  const datasetSizes = scenario.datasetSizes ?? DEFAULT_DATASET_SIZES;
  const interactionWindowMs = scenario.interactionWindowMs ?? DEFAULT_INTERACTION_WINDOW_MS;

  if (datasetSizes.length === 0 || datasetSizes.some((size) => !Number.isInteger(size) || size < 0)) {
    throw new Error('datasetSizes must contain at least one non-negative integer.');
  }
  if (!Number.isFinite(interactionWindowMs) || interactionWindowMs <= 0) {
    throw new Error('interactionWindowMs must be a positive number.');
  }
  return { datasetSizes, interactionWindowMs };
}
