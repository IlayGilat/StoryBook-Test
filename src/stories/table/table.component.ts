import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TableRow } from './table.schema';

export type { TableRow } from './table.schema';

type SortKey = keyof TableRow;

@Component({
  selector: 'storybook-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table.component.html',
  styleUrl: './table.component.less',
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
  sortKey: SortKey = 'id';
  sortDirection: 1 | -1 = 1;
  scrollEvents = 0;

  readonly columns: { key: SortKey; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value' },
    { key: 'status', label: 'Status' },
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get filteredRows(): TableRow[] {
    const query = this.filterText.trim().toLowerCase();
    const filtered = query
      ? this._rows.filter((row) => `${row.name} ${row.category} ${row.status}`.toLowerCase().includes(query))
      : this._rows;
    return [...filtered].sort((left, right) => {
      const leftValue = left[this.sortKey];
      const rightValue = right[this.sortKey];
      return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true }) * this.sortDirection;
    });
  }

  sortBy(key: SortKey): void {
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
