import type { TreeNode } from '../data/tree-grid.data';

export type TreeGridSortKey = 'name' | 'category' | 'value' | 'status' | 'progress';
export type SortDirection = 1 | -1;

export interface TreeGridColumn {
  key: TreeGridSortKey;
  label: string;
}

export interface FlatTreeRow {
  node: TreeNode;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
}

export interface FlattenTreeOptions {
  roots: readonly TreeNode[];
  query: string;
  expandedNodeIds: Set<number>;
  selectedNodeIds: ReadonlySet<number>;
  indeterminateNodeIds: ReadonlySet<number>;
}

export const TREE_GRID_COLUMNS: readonly TreeGridColumn[] = [
  { key: 'name', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'value', label: 'Budget / Weight' },
  { key: 'status', label: 'Status' },
  { key: 'progress', label: 'Progress' },
];

const TREE_DEPTH_LABELS = ['Dept', 'Team', 'Project'] as const;
const DEFAULT_TREE_DEPTH_LABEL = 'Task';
const MAX_VISIBLE_PAGE_BUTTONS = 7;

/** Returns the short display label for one hierarchy depth. */
export function getTreeDepthLabel(depth: number): string {
  return TREE_DEPTH_LABELS[depth] ?? DEFAULT_TREE_DEPTH_LABEL;
}

/** Creates the visible page-number window around the current page. */
export function createVisiblePageNumbers(currentPage: number, totalPages: number): number[] {
  const count = Math.min(totalPages, MAX_VISIBLE_PAGE_BUTTONS);
  const firstPage = Math.min(
    Math.max(1, currentPage - 3),
    Math.max(1, totalPages - count + 1),
  );
  return Array.from({ length: count }, (_, index) => firstPage + index);
}

/** Adds every node to an ID index and returns the total node count. */
export function indexTreeNodes(nodes: readonly TreeNode[], nodeMap: Map<number, TreeNode>): number {
  let count = 0;
  for (const node of nodes) {
    nodeMap.set(node.id, node);
    count += 1 + indexTreeNodes(node.children, nodeMap);
  }
  return count;
}

/** Sorts each level of the hierarchy using the component's active sort state. */
export function sortTreeNodes(
  nodes: TreeNode[],
  sortKey: TreeGridSortKey,
  sortDirection: SortDirection,
): void {
  nodes.sort((left, right) =>
    String(left[sortKey]).localeCompare(String(right[sortKey]), undefined, { numeric: true })
      * sortDirection,
  );
  nodes.forEach((node) => sortTreeNodes(node.children, sortKey, sortDirection));
}

/** Applies one selection value to a node and every descendant. */
export function setDescendantSelection(
  node: TreeNode,
  selected: boolean,
  selectedNodeIds: Set<number>,
  indeterminateNodeIds: Set<number>,
): void {
  if (selected) selectedNodeIds.add(node.id);
  else selectedNodeIds.delete(node.id);
  indeterminateNodeIds.delete(node.id);
  node.children.forEach((child) =>
    setDescendantSelection(child, selected, selectedNodeIds, indeterminateNodeIds),
  );
}

/** Recalculates selection state from one parent through the root. */
export function updateAncestorSelection(
  parentId: number | null,
  nodeMap: ReadonlyMap<number, TreeNode>,
  selectedNodeIds: Set<number>,
  indeterminateNodeIds: Set<number>,
): void {
  if (parentId === null) return;
  const parent = nodeMap.get(parentId);
  if (!parent) return;

  const selectedCount = parent.children.filter((child) => selectedNodeIds.has(child.id)).length;
  const indeterminateCount = parent.children.filter((child) =>
    indeterminateNodeIds.has(child.id),
  ).length;

  if (selectedCount === parent.children.length) {
    selectedNodeIds.add(parent.id);
    indeterminateNodeIds.delete(parent.id);
  } else if (selectedCount === 0 && indeterminateCount === 0) {
    selectedNodeIds.delete(parent.id);
    indeterminateNodeIds.delete(parent.id);
  } else {
    selectedNodeIds.delete(parent.id);
    indeterminateNodeIds.add(parent.id);
  }
  updateAncestorSelection(parent.parentId, nodeMap, selectedNodeIds, indeterminateNodeIds);
}

/** Tests a node and descendants against a query while expanding matching branches. */
export function treeNodeMatches(
  node: TreeNode,
  query: string,
  expandedNodeIds: Set<number>,
): boolean {
  const matchesNode = node.name.toLowerCase().includes(query)
    || node.category.toLowerCase().includes(query)
    || node.status.toLowerCase().includes(query);
  let matchesChild = false;
  for (const child of node.children) {
    if (treeNodeMatches(child, query, expandedNodeIds)) matchesChild = true;
  }
  if (matchesChild) expandedNodeIds.add(node.id);
  return matchesNode || matchesChild;
}

/** Flattens expanded hierarchy branches into rows consumed by the template. */
export function flattenVisibleTree(options: FlattenTreeOptions): FlatTreeRow[] {
  const rows: FlatTreeRow[] = [];

  const addNode = (node: TreeNode): void => {
    const isExpanded = options.expandedNodeIds.has(node.id);
    rows.push({
      node,
      depth: node.depth,
      hasChildren: node.children.length > 0,
      isExpanded,
      isSelected: options.selectedNodeIds.has(node.id),
      isIndeterminate: options.indeterminateNodeIds.has(node.id),
    });
    if (!isExpanded) return;
    node.children.forEach((child) => {
      if (!options.query || treeNodeMatches(child, options.query, options.expandedNodeIds)) {
        addNode(child);
      }
    });
  };

  options.roots.forEach(addNode);
  return rows;
}
