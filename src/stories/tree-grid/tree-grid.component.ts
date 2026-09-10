import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { TreeNode } from './tree-grid.schema';

export type { TreeNode } from './tree-grid.schema';

export interface FlatRow {
  node: TreeNode;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
}

export type SortKey = 'name' | 'category' | 'value' | 'status' | 'progress';

@Component({
  selector: 'storybook-tree-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree-grid.component.html',
  styleUrl: './tree-grid.component.less',
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
  sortKey: SortKey = 'name';
  sortDirection: 1 | -1 = 1;
  scrollEvents = 0;

  nodeMap = new Map<number, TreeNode>();
  totalNodesCount = 0;

  expandedNodeIds = new Set<number>();
  selectedNodeIds = new Set<number>();
  indeterminateNodeIds = new Set<number>();

  visibleFlatRows: FlatRow[] = [];
  filteredRoots: TreeNode[] = [];

  readonly columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Budget / Weight' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress' },
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRoots.length / this.pageSize));
  }

  get visiblePages(): number[] {
    const count = Math.min(this.totalPages, 7);
    const first = Math.min(
      Math.max(1, this.currentPage - 3),
      Math.max(1, this.totalPages - count + 1),
    );
    return Array.from({ length: count }, (_, idx) => first + idx);
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
    switch (depth) {
      case 0: return 'Dept';
      case 1: return 'Team';
      case 2: return 'Project';
      default: return 'Task';
    }
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

  sortBy(key: SortKey): void {
    this.sortDirection = this.sortKey === key ? (this.sortDirection === 1 ? -1 : 1) : 1;
    this.sortKey = key;
    this.sortTree(this._rootNodes);
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
    const applyDescendants = (n: TreeNode) => {
      if (setSelection) {
        this.selectedNodeIds.add(n.id);
      } else {
        this.selectedNodeIds.delete(n.id);
      }
      this.indeterminateNodeIds.delete(n.id);
      for (const child of n.children) {
        applyDescendants(child);
      }
    };
    applyDescendants(node);

    // Update ancestors recursively
    this.updateAncestorSelection(node.parentId);
    this.refreshVisibleRows();
    this.selectionChange.emit(Array.from(this.selectedNodeIds));
    this.cdr.markForCheck();
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const row of this.visibleFlatRows) {
      const node = row.node;
      const applyDescendants = (n: TreeNode) => {
        if (checked) {
          this.selectedNodeIds.add(n.id);
        } else {
          this.selectedNodeIds.delete(n.id);
        }
        this.indeterminateNodeIds.delete(n.id);
        for (const child of n.children) {
          applyDescendants(child);
        }
      };
      applyDescendants(node);
      this.updateAncestorSelection(node.parentId);
    }
    this.refreshVisibleRows();
    this.selectionChange.emit(Array.from(this.selectedNodeIds));
    this.cdr.markForCheck();
  }

  private updateAncestorSelection(parentId: number | null): void {
    if (parentId === null) return;
    const parent = this.nodeMap.get(parentId);
    if (!parent) return;

    let selectedCount = 0;
    let indeterminateCount = 0;

    for (const child of parent.children) {
      if (this.selectedNodeIds.has(child.id)) {
        selectedCount++;
      } else if (this.indeterminateNodeIds.has(child.id)) {
        indeterminateCount++;
      }
    }

    if (selectedCount === parent.children.length) {
      this.selectedNodeIds.add(parent.id);
      this.indeterminateNodeIds.delete(parent.id);
    } else if (selectedCount === 0 && indeterminateCount === 0) {
      this.selectedNodeIds.delete(parent.id);
      this.indeterminateNodeIds.delete(parent.id);
    } else {
      this.selectedNodeIds.delete(parent.id);
      this.indeterminateNodeIds.add(parent.id);
    }

    this.updateAncestorSelection(parent.parentId);
  }

  private sortTree(nodes: TreeNode[]): void {
    nodes.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];
      return String(valA).localeCompare(String(valB), undefined, { numeric: true }) * this.sortDirection;
    });
    for (const node of nodes) {
      if (node.children.length > 0) {
        this.sortTree(node.children);
      }
    }
  }

  private filterNode(node: TreeNode, query: string): boolean {
    const matchesSelf =
      node.name.toLowerCase().includes(query) ||
      node.category.toLowerCase().includes(query) ||
      node.status.toLowerCase().includes(query);

    let hasMatchingChild = false;
    for (const child of node.children) {
      if (this.filterNode(child, query)) {
        hasMatchingChild = true;
      }
    }

    if (hasMatchingChild) {
      this.expandedNodeIds.add(node.id);
    }

    return matchesSelf || hasMatchingChild;
  }

  refreshVisibleRows(): void {
    const query = this.filterText.trim().toLowerCase();

    if (query) {
      this.filteredRoots = this._rootNodes.filter((root) => this.filterNode(root, query));
    } else {
      this.filteredRoots = [...this._rootNodes];
    }

    this.clampCurrentPage();

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const pagedRoots = this.filteredRoots.slice(startIdx, startIdx + this.pageSize);

    const flatList: FlatRow[] = [];
    const flatten = (node: TreeNode) => {
      const isExpanded = this.expandedNodeIds.has(node.id);
      const isSelected = this.selectedNodeIds.has(node.id);
      const isIndeterminate = this.indeterminateNodeIds.has(node.id);

      flatList.push({
        node,
        depth: node.depth,
        hasChildren: node.children.length > 0,
        isExpanded,
        isSelected,
        isIndeterminate,
      });

      if (isExpanded && node.children.length > 0) {
        for (const child of node.children) {
          if (!query || this.filterNode(child, query)) {
            flatten(child);
          }
        }
      }
    };

    for (const root of pagedRoots) {
      flatten(root);
    }

    this.visibleFlatRows = flatList;
  }

  trackRow(_index: number, row: FlatRow): number {
    return row.node.id;
  }

  private indexNodes(nodes: TreeNode[]): void {
    for (const node of nodes) {
      this.nodeMap.set(node.id, node);
      this.totalNodesCount++;
      if (node.children.length > 0) {
        this.indexNodes(node.children);
      }
    }
  }
}
