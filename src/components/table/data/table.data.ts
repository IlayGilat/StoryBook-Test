import { z } from 'zod';

export const TABLE_STATUSES = ['Active', 'Paused'] as const;

export const tableRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  value: z.number(),
  status: z.enum(TABLE_STATUSES),
});

export type TableRow = z.infer<typeof tableRowSchema>;
export const tableDatasetSchema = z.array(tableRowSchema);
