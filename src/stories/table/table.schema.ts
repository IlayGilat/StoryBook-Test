import { z } from 'zod';
import type { GenerateOptions } from '../../services/data-generator.service';

export const tableRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  value: z.number(),
  status: z.enum(['Active', 'Paused']),
});

export type TableRow = z.infer<typeof tableRowSchema>;

/** Default field overrides for realistic table data generation. */
export const tableRowOverrides: GenerateOptions<TableRow>['overrides'] = {
  id: (index) => index + 1,
  name: (index) => `Record ${index + 1}`,
  category: (index) => `Category ${(index % 12) + 1}`,
  value: (index) => ((index * 7919) % 100000) / 100,
  status: (index) => (index % 5 === 0 ? 'Paused' : 'Active'),
};
