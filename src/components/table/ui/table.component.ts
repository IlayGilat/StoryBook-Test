import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TableRow } from '../data/table.data';

export type { TableRow } from '../data/table.data';

type TableSortKey = keyof TableRow;
type TableSortDirection = 1 | -1;

interface TableColumn {
  key: TableSortKey;
  label: string;
}

const TABLE_COLUMNS: readonly TableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'value', label: 'Value' },
  { key: 'status', label: 'Status' },
];

function matchesTableQuery(row: TableRow, query: string): boolean {
  return `${row.name} ${row.category} ${row.status}`.toLowerCase().includes(query);
}

function compareTableRows(left: TableRow, right: TableRow, sortKey: TableSortKey): number {
  return String(left[sortKey]).localeCompare(String(right[sortKey]), undefined, { numeric: true });
}

/** Creates the filtered and sorted rows displayed by the table. */
function createVisibleTableRows(
  rows: readonly TableRow[],
  filterText: string,
  sortKey: TableSortKey,
  sortDirection: TableSortDirection,
): TableRow[] {
  const query = filterText.trim().toLowerCase();
  const filteredRows = query ? rows.filter((row) => matchesTableQuery(row, query)) : rows;
  return [...filteredRows].sort(
    (left, right) => compareTableRows(left, right, sortKey) * sortDirection,
  );
}

@Component({
  selector: 'storybook-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
})
export class TableComponent {
  @Input() set rows(value: TableRow[]) {
    this._rows = Array.isArray(value) ? value : [];
    this.cdr.markForCheck();
  }
  get rows(): TableRow[] {
    return this._rows;
  }

  _rows: TableRow[] = [];
  filterText = '';
  sortKey: TableSortKey = 'id';
  sortDirection: TableSortDirection = 1;
  scrollEvents = 0;

  readonly columns = TABLE_COLUMNS;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get filteredRows(): TableRow[] {
    return createVisibleTableRows(this._rows, this.filterText, this.sortKey, this.sortDirection);
  }

  sortBy(key: TableSortKey): void {
    this.sortDirection = this.sortKey === key ? (this.sortDirection === 1 ? -1 : 1) : 1;
    this.sortKey = key;
    this.cdr.markForCheck();
  }

  onFilterChange(): void {
    this.cdr.markForCheck();
  }

  trackRow(_index: number, row: TableRow): number {
    return row.id;
  }

  onScroll(): void {
    this.scrollEvents += 1;
  }
}
