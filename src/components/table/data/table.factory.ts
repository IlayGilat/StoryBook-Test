import type { DataFactory } from '../../../benchmark/data-generator/data-generator.types';
import type { TableRow } from './table.data';

/** Creates one deterministic row for the table benchmark. */
export const createTableRow: DataFactory<TableRow> = (index) => ({
  id: index + 1,
  name: `Record ${index + 1}`,
  category: `Category ${(index % 12) + 1}`,
  value: ((index * 7919) % 100000) / 100,
  status: index % 5 === 0 ? 'Paused' : 'Active',
});
