import { Component, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../common/base-benchmark-container';
import { DataGeneratorService } from '../../services/data-generator.service';
import { TableComponent } from './table.component';
import {
  tableRowSchema,
  tableRowOverrides,
  type TableRow,
} from './table.schema';

@Component({
  selector: 'storybook-table-container',
  standalone: true,
  imports: [TableComponent],
  template: `
    <storybook-table [rows]="rows"></storybook-table>
  `,
})
export class TableContainerComponent extends BaseBenchmarkContainerComponent<TableRow> {
  protected override readonly componentName = 'table';
  private readonly dataGenerator = inject(DataGeneratorService);

  rows: TableRow[] = [];

  protected override async generateDataset(size: number): Promise<TableRow[]> {
    return this.dataGenerator.generate(tableRowSchema, size, {
      overrides: tableRowOverrides,
    });
  }

  protected override onDataGenerated(rows: TableRow[]): void {
    this.rows = rows;
  }
}
