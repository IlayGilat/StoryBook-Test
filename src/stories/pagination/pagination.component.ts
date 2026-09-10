import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

interface PaginationItem {
  id: number;
  name: string;
  category: string;
}

@Component({
  selector: 'storybook-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination-shell" aria-label="Pagination">
      <div class="pagination-heading">
        <p class="eyebrow">Component benchmark</p>
        <h1>Pagination</h1>
        <p class="summary">Page {{ currentPage }} of {{ totalPages }}</p>
      </div>
      <div class="pagination-data" aria-live="polite">
        <div class="data-header">
          <span>Visible data</span>
          <span>{{ firstItemNumber }}-{{ lastItemNumber }} of {{ itemCount }} records</span>
        </div>
        <ul>
          <li *ngFor="let item of visibleItems" class="data-row" data-pagination-item>
            <strong>{{ item.name }}</strong>
            <span>{{ item.category }}</span>
          </li>
        </ul>
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-button"
          type="button"
          aria-label="Previous page"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)">
          Previous
        </button>
        <div class="page-list" aria-label="Pages">
          <button
            *ngFor="let page of visiblePages"
            class="pagination-button page-number"
            type="button"
            [attr.aria-label]="'Page ' + page"
            [attr.aria-current]="page === currentPage ? 'page' : null"
            [class.selected]="page === currentPage"
            (click)="goToPage(page)">
            {{ page }}
          </button>
        </div>
        <button
          class="pagination-button"
          type="button"
          aria-label="Next page"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)">
          Next
        </button>
      </div>
    </nav>
  `,
  styleUrls: ['./pagination.less'],
})
export class PaginationComponent {
  @Input() set totalItems(value: number) {
    this.itemCount = this.normalizeNumber(value);
    this.items = this.createItems(this.itemCount);
    this.clampCurrentPage();
  }

  @Input() set pageSize(value: number) {
    this.itemsPerPage = Math.max(1, this.normalizeNumber(value));
    this.clampCurrentPage();
  }

  @Input() currentPage = 1;
  @Output() readonly pageChange = new EventEmitter<number>();

  itemCount = 0;
  itemsPerPage = 10;
  items: PaginationItem[] = [];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.itemCount / this.itemsPerPage));
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
    return this.items.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get firstItemNumber(): number {
    return this.itemCount === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get lastItemNumber(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.itemCount);
  }

  goToPage(page: number): void {
    const nextPage = Math.min(this.totalPages, Math.max(1, Math.floor(page)));
    if (nextPage === this.currentPage) {
      return;
    }
    this.currentPage = nextPage;
    this.pageChange.emit(nextPage);
  }

  @HostListener('window:storybook-pagination-size', ['$event'])
  onSizeEvent(event: Event): void {
    const size = (event as CustomEvent<{ size?: number }>).detail?.size;
    if (typeof size === 'number') {
      this.totalItems = size;
    }
  }

  private clampCurrentPage(): void {
    this.currentPage = Math.min(this.totalPages, Math.max(1, Math.floor(Number(this.currentPage) || 1)));
  }

  private normalizeNumber(value: number): number {
    return Math.max(0, Math.floor(Number(value) || 0));
  }

  private createItems(size: number): PaginationItem[] {
    return Array.from({ length: size }, (_, index) => ({
      id: index + 1,
      name: `Record ${index + 1}`,
      category: `Category ${(index % 8) + 1}`,
    }));
  }
}