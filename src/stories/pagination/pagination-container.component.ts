import { Component, Input, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../common/base-benchmark-container';
import { DataGeneratorService } from '../../services/data-generator.service';
import { PaginationComponent } from './pagination.component';
import {
  paginationItemSchema,
  paginationItemOverrides,
  type PaginationItem,
} from './pagination.schema';

@Component({
  selector: 'storybook-pagination-container',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <storybook-pagination
      [items]="items"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      (pageChange)="currentPage = $event">
    </storybook-pagination>
  `,
})
export class PaginationContainerComponent extends BaseBenchmarkContainerComponent<PaginationItem> {
  protected override readonly componentName = 'pagination';
  private readonly dataGenerator = inject(DataGeneratorService);

  @Input() set totalItems(value: number) {
    this.datasetSize = value;
  }
  get totalItems(): number {
    return this.size;
  }

  @Input() pageSize = 10;
  @Input() currentPage = 1;

  items: PaginationItem[] = [];

  protected override async generateDataset(size: number): Promise<PaginationItem[]> {
    return this.dataGenerator.generate(paginationItemSchema, size, {
      overrides: paginationItemOverrides,
    });
  }

  protected override onDataGenerated(items: PaginationItem[]): void {
    this.items = items;
  }
}
