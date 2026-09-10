import { z } from 'zod';
import type { GenerateOptions } from '../../services/data-generator.service';

export const paginationItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
});

export type PaginationItem = z.infer<typeof paginationItemSchema>;

/** Default field overrides for realistic pagination data generation. */
export const paginationItemOverrides: GenerateOptions<PaginationItem>['overrides'] = {
  id: (index) => index + 1,
  name: (index) => `Record ${index + 1}`,
  category: (index) => `Category ${(index % 8) + 1}`,
};
