import type { DataFactory, RandomSource } from '../../../benchmark/data-generator/data-generator.types';
import {
  CHILDREN_PER_NODE,
  DEPARTMENT_NAMES,
  MAX_TREE_DEPTH,
  NODE_CATEGORIES,
  NODE_NAME_PREFIXES,
  NODE_STATUSES,
  ROOT_ID_INTERVAL,
} from './tree-grid.data';
import type { TreeNode } from './tree-grid.data';

function createChildNode(
  id: number,
  parent: TreeNode,
  siblingIndex: number,
  random: RandomSource,
): TreeNode {
  const depth = parent.depth + 1;
  const node: TreeNode = {
    id,
    parentId: parent.id,
    name: `${NODE_NAME_PREFIXES[(id + siblingIndex) % NODE_NAME_PREFIXES.length]} level ${depth}`,
    category: NODE_CATEGORIES[(id + depth) % NODE_CATEGORIES.length],
    value: Math.floor(500 + random() * 5000),
    status: NODE_STATUSES[(id + siblingIndex) % NODE_STATUSES.length],
    progress: Math.floor(random() * 101),
    depth,
    children: [],
  };

  if (depth < MAX_TREE_DEPTH) addChildNodes(node, random);
  return node;
}

function addChildNodes(parent: TreeNode, random: RandomSource): void {
  for (let index = 0; index < CHILDREN_PER_NODE; index += 1) {
    parent.children.push(createChildNode(parent.id * 10 + index + 1, parent, index, random));
  }
}

/** Creates one top-level hierarchy record and its deterministic descendants. */
export const createTreeRoot: DataFactory<TreeNode> = (index, random) => {
  const rootId = (index + 1) * ROOT_ID_INTERVAL;
  const root: TreeNode = {
    id: rootId,
    parentId: null,
    name: `${DEPARTMENT_NAMES[index % DEPARTMENT_NAMES.length]} Dept ${index + 1}`,
    category: NODE_CATEGORIES[index % NODE_CATEGORIES.length],
    value: 10_000 + index * 1500,
    status: NODE_STATUSES[index % NODE_STATUSES.length],
    progress: Math.floor(random() * 101),
    depth: 0,
    children: [],
  };
  addChildNodes(root, random);
  return root;
};
