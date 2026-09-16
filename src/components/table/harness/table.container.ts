import { Component, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../../../benchmark/harness/benchmark-container';
import { DataGeneratorService } from '../../../benchmark/data-generator/data-generator.service';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { TableComponent } from '../ui/table.component';
import {
  tableDatasetSchema,
  type TableRow,
} from '../data/table.data';
import { createTableRow } from '../data/table.factory';

@Component({
  selector: 'storybook-table-container',
  standalone: true,
  imports: [TableComponent],
  template: `
    <storybook-table [rows]="rows"></storybook-table>
  `,
})
export class TableContainerComponent extends BaseBenchmarkContainerComponent<TableRow> {
  protected override readonly componentName = BenchmarkComponent.Table;
  private readonly dataGenerator = inject(DataGeneratorService);

  rows: TableRow[] = [];

  protected override async generateDataset(size: number): Promise<TableRow[]> {
    return this.dataGenerator.generate(tableDatasetSchema, size, createTableRow);
  }

  protected override onDataGenerated(rows: TableRow[]): void {
    this.rows = rows;
  }
}
