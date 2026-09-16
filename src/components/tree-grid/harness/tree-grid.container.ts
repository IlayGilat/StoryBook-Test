import { Component, Input, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../../../benchmark/harness/benchmark-container';
import { DataGeneratorService } from '../../../benchmark/data-generator/data-generator.service';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { TreeGridComponent } from '../ui/tree-grid.component';
import {
  treeDatasetSchema,
  type TreeNode,
} from '../data/tree-grid.data';
import { createTreeRoot } from '../data/tree-grid.factory';

@Component({
  selector: 'storybook-tree-grid-container',
  standalone: true,
  imports: [TreeGridComponent],
  template: `
    <storybook-tree-grid
      [rootNodes]="rootNodes"
      [pageSize]="pageSize"
      [currentPage]="currentPage"
      (pageChange)="currentPage = $event">
    </storybook-tree-grid>
  `,
})
export class TreeGridContainerComponent extends BaseBenchmarkContainerComponent<TreeNode> {
  protected override readonly componentName = BenchmarkComponent.TreeGrid;
  private readonly dataGenerator = inject(DataGeneratorService);

  @Input() pageSize = 10;
  @Input() currentPage = 1;

  rootNodes: TreeNode[] = [];

  protected override async generateDataset(size: number): Promise<TreeNode[]> {
    return this.dataGenerator.generate(treeDatasetSchema, size, createTreeRoot);
  }

  protected override onDataGenerated(roots: TreeNode[]): void {
    this.rootNodes = roots;
  }
}
