import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TreeNode {
  id: number;
  parentId: number | null;
  name: string;
  category: string;
  value: number;
  status: 'Active' | 'Paused' | 'Completed' | 'Blocked';
  progress: number;
  depth: number;
  children: TreeNode[];
}

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
  template: `
    <section class="tree-grid-shell" aria-label="Hierarchical Tree Grid">
      <header class="tree-grid-header">
        <div>
          <p class="eyebrow">Enterprise Hierarchy Benchmark</p>
          <h1>Project Hierarchy Tree</h1>
          <p class="summary">
            Showing {{ visibleFlatRows.length | number }} visible rows
            ({{ filteredRoots.length | number }} root departments, {{ totalNodesCount | number }} total items)
            &bull; <strong class="selected-count">{{ selectedNodeIds.size | number }} selected</strong>
          </p>
        </div>

        <div class="header-actions">
          <label class="filter">
            <span>Filter hierarchy</span>
            <input
              [(ngModel)]="filterText"
              (ngModelChange)="onFilterChange()"
              type="search"
              placeholder="Search department, team, project..."
              aria-label="Filter records"
            />
          </label>
          <div class="expand-buttons">
            <button type="button" class="action-btn" (click)="expandAll()" aria-label="Expand all nodes">Expand All</button>
            <button type="button" class="action-btn" (click)="collapseAll()" aria-label="Collapse all nodes">Collapse All</button>
          </div>
        </div>
      </header>

      <div class="table-viewport" (scroll)="onScroll()">
        <table>
          <thead>
            <tr>
              <th class="col-select">
                <input
                  type="checkbox"
                  aria-label="Select all visible nodes"
                  [checked]="isAllSelected"
                  [indeterminate]="isAllIndeterminate"
                  (change)="toggleSelectAll($event)"
                />
              </th>
              <th *ngFor="let col of columns" [class]="'col-' + col.key">
                <button type="button" (click)="sortBy(col.key)" [attr.aria-label]="'Sort by ' + col.label">
                  {{ col.label }}
                  <span aria-hidden="true">{{ sortKey === col.key ? (sortDirection === 1 ? '▲' : '▼') : '↕' }}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let row of visibleFlatRows; trackBy: trackRow"
              class="tree-row depth-{{ row.depth }}"
              [class.row-selected]="row.isSelected"
              [attr.data-node-id]="row.node.id"
              [attr.data-depth]="row.depth"
            >
              <td class="col-select">
                <input
                  type="checkbox"
                  [checked]="row.isSelected"
                  [indeterminate]="row.isIndeterminate"
                  (change)="toggleSelect(row.node)"
                  [attr.aria-label]="'Select ' + row.node.name"
                />
              </td>
              <td class="col-name">
                <div class="name-cell" [style.padding-left.px]="row.depth * 22">
                  <button
                    *ngIf="row.hasChildren"
                    type="button"
                    class="toggle-btn"
                    (click)="toggleExpand(row.node.id)"
                    [attr.aria-label]="row.isExpanded ? 'Collapse ' + row.node.name : 'Expand ' + row.node.name"
                    [attr.aria-expanded]="row.isExpanded"
                  >
                    <span class="chevron" [class.open]="row.isExpanded">▶</span>
                  </button>
                  <span *ngIf="!row.hasChildren" class="leaf-spacer" aria-hidden="true">&bull;</span>
                  <span class="node-depth-badge">{{ getDepthLabel(row.depth) }}</span>
                  <strong class="node-title">{{ row.node.name }}</strong>
                  <span *ngIf="row.hasChildren" class="children-badge">({{ row.node.children.length }})</span>
                </div>
              </td>
              <td class="col-category">{{ row.node.category }}</td>
              <td class="col-value">{{ row.node.value | number }}</td>
              <td class="col-status">
                <span class="status-badge" [ngClass]="row.node.status.toLowerCase()">
                  {{ row.node.status }}
                </span>
              </td>
              <td class="col-progress">
                <div class="progress-bar-wrap">
                  <div class="progress-bar" [style.width.%]="row.node.progress"></div>
                  <span class="progress-text">{{ row.node.progress }}%</span>
                </div>
              </td>
            </tr>
            <tr *ngIf="visibleFlatRows.length === 0">
              <td colspan="6" class="no-records">No matching records found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="tree-grid-footer">
        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }} ({{ filteredRoots.length }} root departments)
        </div>
        <div class="pagination-controls">
          <button
            class="pagination-button"
            type="button"
            aria-label="Previous page"
            [disabled]="currentPage === 1"
            (click)="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <div class="page-list">
            <button
              *ngFor="let page of visiblePages"
              class="pagination-button page-number"
              type="button"
              [attr.aria-label]="'Page ' + page"
              [attr.aria-current]="page === currentPage ? 'page' : null"
              [class.selected]="page === currentPage"
              (click)="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button
            class="pagination-button"
            type="button"
            aria-label="Next page"
            [disabled]="currentPage === totalPages"
            (click)="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </footer>
    </section>
  `,
  styleUrls: ['./tree-grid.less'],
})
export class TreeGridComponent {
  @Input() set datasetSize(value: number) {
    const size = Math.max(0, Math.floor(Number(value) || 0));
    if (size !== this.size) {
      this.size = size;
      this.rootNodes = this.generateHierarchy(size);
      this.nodeMap.clear();
      this.totalNodesCount = 0;
      this.indexNodes(this.rootNodes);
      // Default: expand root nodes
      this.expandedNodeIds.clear();
      for (const root of this.rootNodes) {
        this.expandedNodeIds.add(root.id);
      }
      this.selectedNodeIds.clear();
      this.indeterminateNodeIds.clear();
      this.clampCurrentPage();
      this.refreshVisibleRows();
    }
  }

  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Output() readonly pageChange = new EventEmitter<number>();

  size = 0;
  filterText = '';
  sortKey: SortKey = 'name';
  sortDirection: 1 | -1 = 1;
  scrollEvents = 0;

  rootNodes: TreeNode[] = [];
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

  @HostListener('window:storybook-tree-grid-size', ['$event'])
  onSizeEvent(event: CustomEvent<{ size: number }>): void {
    if (typeof event.detail?.size === 'number') {
      this.datasetSize = event.detail.size;
    }
  }

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
  }

  goToPage(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages);
    if (target !== this.currentPage) {
      this.currentPage = target;
      this.pageChange.emit(this.currentPage);
      this.refreshVisibleRows();
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
    this.sortTree(this.rootNodes);
    this.refreshVisibleRows();
  }

  toggleExpand(nodeId: number): void {
    if (this.expandedNodeIds.has(nodeId)) {
      this.expandedNodeIds.delete(nodeId);
    } else {
      this.expandedNodeIds.add(nodeId);
    }
    this.refreshVisibleRows();
  }

  expandAll(): void {
    for (const node of this.nodeMap.values()) {
      if (node.children.length > 0) {
        this.expandedNodeIds.add(node.id);
      }
    }
    this.refreshVisibleRows();
  }

  collapseAll(): void {
    this.expandedNodeIds.clear();
    this.refreshVisibleRows();
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
      // Auto-expand path so matches are visible
      this.expandedNodeIds.add(node.id);
    }

    return matchesSelf || hasMatchingChild;
  }

  refreshVisibleRows(): void {
    const query = this.filterText.trim().toLowerCase();

    if (query) {
      this.filteredRoots = this.rootNodes.filter((root) => this.filterNode(root, query));
    } else {
      this.filteredRoots = [...this.rootNodes];
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

  private generateHierarchy(totalNodes: number): TreeNode[] {
    if (totalNodes <= 0) return [];

    const departments = [
      'Core Platform', 'Cloud Infrastructure', 'Product & Design', 'Data & Analytics',
      'Security Operations', 'Quality Assurance', 'Developer Experience', 'Mobile Solutions',
      'AI & Automation', 'Customer Enablement', 'Enterprise Architecture', 'Network Reliability'
    ];

    const teamPrefixes = [
      'Architecture', 'Frontend', 'Backend', 'Services', 'Pipeline', 'Storage',
      'Observability', 'Protocols', 'Identity', 'Payments', 'Algorithms', 'Tooling'
    ];

    const projectPrefixes = [
      'Migration v2', 'Virtualization Engine', 'State Reconciler', 'Telemetry Collector',
      'Stream Buffer', 'Security Audit', 'Microservice Mesh', 'Query Optimizer',
      'Memory Sandbox', 'Reactive Store', 'Schema Validator', 'Load Balancer'
    ];

    const taskPrefixes = [
      'Unit test benchmark', 'CDP metrics harness', 'Tri-state binding', 'Heap profile check',
      'DOM node pruning', 'FPS limiter audit', 'Render loop verification', 'Cache invalidation',
      'Async batching logic', 'Virtual viewport scroll', 'Error boundary handler', 'Style recalc tuning'
    ];

    const statuses: ('Active' | 'Paused' | 'Completed' | 'Blocked')[] = ['Active', 'Paused', 'Completed', 'Blocked'];
    const categories = ['Infrastructure', 'Performance', 'UI/UX', 'Database', 'Security', 'DevOps'];

    let currentId = 1;
    const roots: TreeNode[] = [];

    // Determine balanced number of roots (approx 1 root per 40-50 nodes, min 1)
    const rootCount = Math.max(1, Math.min(departments.length, Math.ceil(totalNodes / 40)));
    let remaining = totalNodes;

    // Distribute remaining count across roots
    for (let r = 0; r < rootCount && remaining > 0; r++) {
      const rootId = currentId++;
      remaining--;
      const rootNode: TreeNode = {
        id: rootId,
        parentId: null,
        name: `${departments[r % departments.length]} Dept`,
        category: categories[r % categories.length],
        value: 10000 + (r * 1500),
        status: statuses[r % statuses.length],
        progress: Math.floor((r * 23) % 100),
        depth: 0,
        children: [],
      };
      roots.push(rootNode);
    }

    // Now populate levels: teams (depth 1), projects (depth 2), tasks (depth 3)
    let currentLevelNodes: TreeNode[] = [...roots];

    for (let depth = 1; depth <= 3 && remaining > 0; depth++) {
      const nextLevelNodes: TreeNode[] = [];
      const prefixes = depth === 1 ? teamPrefixes : depth === 2 ? projectPrefixes : taskPrefixes;
      const typeName = depth === 1 ? 'Team' : depth === 2 ? 'Project' : 'Task';

      // Attach 2 to 4 children per parent until remaining is exhausted
      for (const parent of currentLevelNodes) {
        if (remaining <= 0) break;
        const branchSize = Math.min(remaining, (parent.id % 3) + 2);

        for (let b = 0; b < branchSize && remaining > 0; b++) {
          const childId = currentId++;
          remaining--;
          const childNode: TreeNode = {
            id: childId,
            parentId: parent.id,
            name: `${prefixes[(parent.id + b) % prefixes.length]} ${typeName} #${childId}`,
            category: categories[(childId + depth) % categories.length],
            value: Math.floor(500 + ((childId * 137) % 5000)),
            status: statuses[(childId + b) % statuses.length],
            progress: Math.floor((childId * 17) % 101),
            depth,
            children: [],
          };
          parent.children.push(childNode);
          nextLevelNodes.push(childNode);
        }
      }

      currentLevelNodes = nextLevelNodes;
    }

    // If still remaining (for very large dataset sizes), append to tasks or projects
    while (remaining > 0 && currentLevelNodes.length > 0) {
      for (const parent of currentLevelNodes) {
        if (remaining <= 0) break;
        const childId = currentId++;
        remaining--;
        const childNode: TreeNode = {
          id: childId,
          parentId: parent.id,
          name: `Task #${childId}`,
          category: categories[childId % categories.length],
          value: Math.floor(100 + (childId % 1000)),
          status: statuses[childId % statuses.length],
          progress: Math.floor((childId * 31) % 101),
          depth: Math.min(3, parent.depth + 1),
          children: [],
        };
        parent.children.push(childNode);
      }
    }

    return roots;
  }
}

