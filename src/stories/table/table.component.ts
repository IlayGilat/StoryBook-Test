import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TableRow {
  id: number;
  name: string;
  category: string;
  value: number;
  status: 'Active' | 'Paused';
}

type SortKey = keyof TableRow;

@Component({
  selector: 'storybook-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="table-shell" aria-label="Performance table">
      <header class="table-header">
        <div>
          <p class="eyebrow">Component benchmark</p>
          <h1>Inventory table</h1>
          <p class="summary">{{ filteredRows.length | number }} of {{ rows.length | number }} records</p>
        </div>
        <label class="filter">
          <span>Filter records</span>
          <input [(ngModel)]="filterText" type="search" placeholder="Search name or category" />
        </label>
      </header>
      <div class="table-viewport" (scroll)="onScroll()">
        <table>
          <thead>
            <tr>
              <th *ngFor="let column of columns">
                <button type="button" (click)="sortBy(column.key)">
                  {{ column.label }}
                  <span aria-hidden="true">{{ sortKey === column.key ? (sortDirection === 1 ? '↑' : '↓') : '↕' }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of filteredRows; trackBy: trackRow">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.value | number }}</td>
              <td><span class="status" [class.paused]="row.status === 'Paused'">{{ row.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styleUrls: ['./table.less'],
})
export class TableComponent {
  @Input() set datasetSize(value: number) {
    const size = Math.max(0, Math.floor(Number(value) || 0));
    if (size !== this.size) {
      this.size = size;
      this.rows = this.createRows(size);
    }
  }

  filterText = '';
  rows: TableRow[] = [];
  size = 0;
  sortKey: SortKey = 'id';
  sortDirection = 1;
  scrollEvents = 0;

  readonly columns: { key: SortKey; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value' },
    { key: 'status', label: 'Status' },
  ];

  get filteredRows(): TableRow[] {
    const query = this.filterText.trim().toLowerCase();
    const filtered = query
      ? this.rows.filter((row) => `${row.name} ${row.category} ${row.status}`.toLowerCase().includes(query))
      : this.rows;
    return [...filtered].sort((left, right) => {
      const leftValue = left[this.sortKey];
      const rightValue = right[this.sortKey];
      return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true }) * this.sortDirection;
    });
  }

  sortBy(key: SortKey): void {
    this.sortDirection = this.sortKey === key ? this.sortDirection * -1 : 1;
    this.sortKey = key;
  }

  trackRow(_index: number, row: TableRow): number {
    return row.id;
  }

  @HostListener('window:storybook-table-size', ['$event'])
  onSizeEvent(event: Event): void {
    const size = (event as CustomEvent<{ size?: number }>).detail?.size;
    if (typeof size === 'number') {
      this.datasetSize = size;
    }
  }

  onScroll(): void {
    this.scrollEvents += 1;
  }

  private createRows(size: number): TableRow[] {
    return Array.from({ length: size }, (_, index) => ({
      id: index + 1,
      name: `Record ${index + 1}`,
      category: `Category ${(index % 12) + 1}`,
      value: ((index * 7919) % 100000) / 100,
      status: index % 5 === 0 ? 'Paused' : 'Active',
    }));
  }
}
