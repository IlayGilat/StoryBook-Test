import { Component, Input, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../common/base-benchmark-container';
import { DataGeneratorService } from '../../services/data-generator.service';
import { TreeGridComponent } from './tree-grid.component';
import {
  treeNodeSchema,
  buildTreeHierarchy,
  type TreeNode,
} from './tree-grid.schema';

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
  protected override readonly componentName = 'tree-grid';
  private readonly dataGenerator = inject(DataGeneratorService);

  @Input() pageSize = 10;
  @Input() currentPage = 1;

  rootNodes: TreeNode[] = [];

  protected override async generateDataset(size: number): Promise<TreeNode[]> {
    return this.dataGenerator.generateTree(
      treeNodeSchema,
      size,
      buildTreeHierarchy,
    );
  }

  protected override onDataGenerated(roots: TreeNode[]): void {
    this.rootNodes = roots;
  }
}
