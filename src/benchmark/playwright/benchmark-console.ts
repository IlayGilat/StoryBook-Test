import type { PerformanceRow } from './benchmark.types';

/** Formats the percentage change between current and previous values. */
export function formatPercentChange(current: number, previous?: number): string {
  if (previous === undefined) {
    return '-';
  }
  if (previous === 0) {
    return current === 0 ? '0.0%' : '+100.0%';
  }
  const delta = ((current - previous) / previous) * 100;
  if (Math.abs(delta) < 0.05) {
    return '0.0%';
  }
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

/** Selects the most useful interactive metrics for terminal output. */
export function formatConsoleRow(
  row: PerformanceRow,
  previousRow?: PerformanceRow,
): Record<string, unknown> {
  return {
    datasetSize: row.datasetSize,
    averageFps: row.averageFps,
    'averageFps change %': formatPercentChange(row.averageFps, previousRow?.averageFps),
    droppedFrames: row.droppedFrames,
    'droppedFrames change %': formatPercentChange(row.droppedFrames, previousRow?.droppedFrames),
    jsHeapUsedMb: row.jsHeapUsedMb,
    domNodes: row.domNodes,
    'domNodes change %': formatPercentChange(row.domNodes, previousRow?.domNodes),
  };
}

/** Formats a sequence of performance rows, calculating change percentages from the previous row. */
export function formatConsoleRows(rows: readonly PerformanceRow[]): Record<string, unknown>[] {
  return rows.map((row, index) => formatConsoleRow(row, index > 0 ? rows[index - 1] : undefined));
}

function getColumnWidths(rows: readonly Record<string, unknown>[], headers: readonly string[]): number[] {
  return headers.map((header) =>
    Math.max(header.length, ...rows.map((row) => String(row[header] ?? '').length)),
  );
}

function isNumericCell(value: unknown, text: string): boolean {
  return typeof value === 'number' || text.endsWith('%') || text === '-';
}

function formatCell(value: unknown, width: number): string {
  const text = String(value ?? '');
  return isNumericCell(value, text) ? text.padStart(width) : text.padEnd(width);
}

function createBorder(widths: readonly number[], joinCharacter: string): string {
  return widths.map((width) => '─'.repeat(width + 2)).join(joinCharacter);
}

/** Prints a compact fixed-width table for one or more benchmark rows. */
export function printPerformanceTable(rows: readonly Record<string, unknown>[]): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const widths = getColumnWidths(rows, headers);
  const header = headers.map((name, index) => name.padEnd(widths[index])).join(' │ ');
  const values = rows.map((row) =>
    headers.map((name, index) => formatCell(row[name], widths[index])).join(' │ '),
  );

  console.log([
    `┌${createBorder(widths, '┬')}┐`,
    `│ ${header} │`,
    `├${createBorder(widths, '┼')}┤`,
    ...values.map((value) => `│ ${value} │`),
    `└${createBorder(widths, '┴')}┘`,
  ].join('\n'));
}
