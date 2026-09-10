import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import type { PaginationItem } from './pagination.schema';

export type { PaginationItem } from './pagination.schema';

@Component({
  selector: 'storybook-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.less',
})
export class PaginationComponent {
  @Input() set items(value: PaginationItem[]) {
    this._items = Array.isArray(value) ? value : [];
    this.clampCurrentPage();
    this.cdr.markForCheck();
  }
  get items(): PaginationItem[] {
    return this._items;
  }

  @Input() set pageSize(value: number) {
    this.itemsPerPage = Math.max(1, Math.floor(Number(value) || 10));
    this.clampCurrentPage();
    this.cdr.markForCheck();
  }

  @Input() currentPage = 1;
  @Output() readonly pageChange = new EventEmitter<number>();

  _items: PaginationItem[] = [];
  itemsPerPage = 10;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get totalPages(): number {
    return Math.max(1, Math.ceil(this._items.length / this.itemsPerPage));
  }

  get visiblePages(): number[] {
    const pageCount = Math.min(this.totalPages, 7);
    const firstPage = Math.min(
      Math.max(1, this.currentPage - 3),
      Math.max(1, this.totalPages - pageCount + 1),
    );
    return Array.from({ length: pageCount }, (_, index) => firstPage + index);
  }

  get visibleItems(): PaginationItem[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this._items.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get firstItemNumber(): number {
    return this._items.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItemNumber(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this._items.length);
  }

  goToPage(page: number): void {
    const nextPage = Math.min(this.totalPages, Math.max(1, Math.floor(page)));
    if (nextPage === this.currentPage) {
      return;
    }
    this.currentPage = nextPage;
    this.pageChange.emit(nextPage);
    this.cdr.markForCheck();
  }

  private clampCurrentPage(): void {
    this.currentPage = Math.min(this.totalPages, Math.max(1, Math.floor(Number(this.currentPage) || 1)));
  }
}