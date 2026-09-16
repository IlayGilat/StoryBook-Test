import { Injectable } from '@angular/core';
import { z } from 'zod';
import { DATA_GENERATION_CHUNK_SIZE, DEFAULT_DATA_SEED } from './data-generator.constants';
import type { DataFactory, GenerateOptions } from './data-generator.types';
import {
  assertGenerationNotAborted,
  createSeededRandom,
  normalizeRecordCount,
  yieldToEventLoop,
} from './data-generator.utils';

/** Generates deterministic data and validates the complete result before rendering. */
@Injectable({ providedIn: 'root' })
export class DataGeneratorService {
  async generate<T>(
    datasetSchema: z.ZodType<T[]>,
    count: number,
    factory: DataFactory<T>,
    options: GenerateOptions = {},
  ): Promise<T[]> {
    const normalizedCount = normalizeRecordCount(count);
    const random = createSeededRandom(options.seed ?? DEFAULT_DATA_SEED);
    const result = new Array<T>(normalizedCount);

    for (let start = 0; start < normalizedCount; start += DATA_GENERATION_CHUNK_SIZE) {
      assertGenerationNotAborted(options.signal);
      const end = Math.min(start + DATA_GENERATION_CHUNK_SIZE, normalizedCount);
      for (let index = start; index < end; index += 1) {
        result[index] = factory(index, random);
      }
      if (end < normalizedCount) {
        await yieldToEventLoop();
      }
    }

    assertGenerationNotAborted(options.signal);
    return datasetSchema.parse(result);
  }
}
