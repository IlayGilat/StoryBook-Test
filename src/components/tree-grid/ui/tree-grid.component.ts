import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  createVisiblePageNumbers,
  type FlatTreeRow,
  flattenVisibleTree,
  getTreeDepthLabel,
  indexTreeNodes,
  setDescendantSelection,
  sortTreeNodes,
  TREE_GRID_COLUMNS,
  type TreeGridSortKey,
  treeNodeMatches,
  updateAncestorSelection,
} from './tree-grid.view';
import type { TreeNode } from '../data/tree-grid.data';

export type { TreeNode } from '../data/tree-grid.data';

@Component({
  selector: 'storybook-tree-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.less'],
})
export class TreeGridComponent {
  @Input() set rootNodes(value: TreeNode[]) {
    this._rootNodes = Array.isArray(value) ? value : [];
    this.nodeMap.clear();
    this.totalNodesCount = 0;
    this.indexNodes(this._rootNodes);
    // Default: expand root nodes
    this.expandedNodeIds.clear();
    for (const root of this._rootNodes) {
      this.expandedNodeIds.add(root.id);
    }
    this.selectedNodeIds.clear();
    this.indeterminateNodeIds.clear();
    this.clampCurrentPage();
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }
  get rootNodes(): TreeNode[] {
    return this._rootNodes;
  }

  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly selectionChange = new EventEmitter<number[]>();

  _rootNodes: TreeNode[] = [];
  filterText = '';
  sortKey: TreeGridSortKey = 'name';
  sortDirection: 1 | -1 = 1;
  scrollEvents = 0;

  nodeMap = new Map<number, TreeNode>();
  totalNodesCount = 0;

  expandedNodeIds = new Set<number>();
  selectedNodeIds = new Set<number>();
  indeterminateNodeIds = new Set<number>();

  visibleFlatRows: FlatTreeRow[] = [];
  filteredRoots: TreeNode[] = [];

  readonly columns = TREE_GRID_COLUMNS;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoots.length / this.pageSize));
  }

  get visiblePages(): number[] {
    return createVisiblePageNumbers(this.currentPage, this.totalPages);
  }

  get isAllSelected(): boolean {
    if (this.visibleFlatRows.length === 0) return false;
    return this.visibleFlatRows.every((r) => this.selectedNodeIds.has(r.node.id));
  }

  get isAllIndeterminate(): boolean {
    if (this.visibleFlatRows.length === 0) return false;
    const someSelected = this.visibleFlatRows.some(
      (r) => this.selectedNodeIds.has(r.node.id) || this.indeterminateNodeIds.has(r.node.id),
    );
    return someSelected && !this.isAllSelected;
  }

  getDepthLabel(depth: number): string {
    return getTreeDepthLabel(depth);
  }

  onScroll(): void {
    this.scrollEvents += 1;
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }

  goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages);
    if (target !== this.currentPage) {
      this.currentPage = target;
      this.pageChange.emit(this.currentPage);
      this.refreshVisibleRows();
      this.cdr.markForCheck();
    }
  }

  clampCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  sortBy(key: TreeGridSortKey): void {
    this.sortDirection = this.sortKey === key ? (this.sortDirection === 1 ? -1 : 1) : 1;
    this.sortKey = key;
    sortTreeNodes(this._rootNodes, this.sortKey, this.sortDirection);
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }

  toggleExpand(nodeId: number): void {
    if (this.expandedNodeIds.has(nodeId)) {
      this.expandedNodeIds.delete(nodeId);
    } else {
      this.expandedNodeIds.add(nodeId);
    }
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }

  expandAll(): void {
    for (const node of this.nodeMap.values()) {
      if (node.children.length > 0) {
        this.expandedNodeIds.add(node.id);
      }
    }
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }

  collapseAll(): void {
    this.expandedNodeIds.clear();
    this.refreshVisibleRows();
    this.cdr.markForCheck();
  }

  toggleSelect(node: TreeNode): void {
    const isCurrentlySelected = this.selectedNodeIds.has(node.id);
    const setSelection = !isCurrentlySelected;

    // Apply to node and all descendants
    setDescendantSelection(
      node,
      setSelection,
      this.selectedNodeIds,
      this.indeterminateNodeIds,
    );

    // Update ancestors recursively
    updateAncestorSelection(
      node.parentId,
      this.nodeMap,
      this.selectedNodeIds,
      this.indeterminateNodeIds,
    );
    this.refreshVisibleRows();
    this.selectionChange.emit(Array.from(this.selectedNodeIds));
    this.cdr.markForCheck();
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const row of this.visibleFlatRows) {
      const node = row.node;
      setDescendantSelection(
        node,
        checked,
        this.selectedNodeIds,
        this.indeterminateNodeIds,
      );
      updateAncestorSelection(
        node.parentId,
        this.nodeMap,
        this.selectedNodeIds,
        this.indeterminateNodeIds,
      );
    }
    this.refreshVisibleRows();
    this.selectionChange.emit(Array.from(this.selectedNodeIds));
    this.cdr.markForCheck();
  }

  refreshVisibleRows(): void {
    const query = this.filterText.trim().toLowerCase();

    if (query) {
      this.filteredRoots = this._rootNodes.filter((root) =>
        treeNodeMatches(root, query, this.expandedNodeIds),
      );
    } else {
      this.filteredRoots = [...this._rootNodes];
    }

    this.clampCurrentPage();

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pagedRoots = this.filteredRoots.slice(startIdx, startIdx + this.pageSize);

    this.visibleFlatRows = flattenVisibleTree({
      roots: pagedRoots,
      query,
      expandedNodeIds: this.expandedNodeIds,
      selectedNodeIds: this.selectedNodeIds,
      indeterminateNodeIds: this.indeterminateNodeIds,
    });
  }

  trackRow(_index: number, row: FlatTreeRow): number {
    return row.node.id;
  }

  private indexNodes(nodes: TreeNode[]): void {
    this.totalNodesCount += indexTreeNodes(nodes, this.nodeMap);
  }
}
