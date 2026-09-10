import { z } from 'zod';
import type { GenerateOptions } from '../../services/data-generator.service';

/**
 * Base tree node schema (non-recursive fields).
 * The `children` field uses z.lazy for recursive self-reference.
 */
export const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z.object({
    id: z.number().int(),
    parentId: z.number().nullable(),
    name: z.string(),
    category: z.string(),
    value: z.number(),
    status: z.enum(['Active', 'Paused', 'Completed', 'Blocked']),
    progress: z.number(),
    depth: z.number(),
    children: z.array(treeNodeSchema),
  }),
);

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

const departments = [
  'Core Platform', 'Cloud Infrastructure', 'Product & Design', 'Data & Analytics',
  'Security Operations', 'Quality Assurance', 'Developer Experience', 'Mobile Solutions',
  'AI & Automation', 'Customer Enablement', 'Enterprise Architecture', 'Network Reliability',
];

const teamPrefixes = [
  'Architecture', 'Frontend', 'Backend', 'Services', 'Pipeline', 'Storage',
  'Observability', 'Protocols', 'Identity', 'Payments', 'Algorithms', 'Tooling',
];

const projectPrefixes = [
  'Migration v2', 'Virtualization Engine', 'State Reconciler', 'Telemetry Collector',
  'Stream Buffer', 'Security Audit', 'Microservice Mesh', 'Query Optimizer',
  'Memory Sandbox', 'Reactive Store', 'Schema Validator', 'Load Balancer',
];

const taskPrefixes = [
  'Unit test benchmark', 'CDP metrics harness', 'Tri-state binding', 'Heap profile check',
  'DOM node pruning', 'FPS limiter audit', 'Render loop verification', 'Cache invalidation',
  'Async batching logic', 'Virtual viewport scroll', 'Error boundary handler', 'Style recalc tuning',
];

const statuses: TreeNode['status'][] = ['Active', 'Paused', 'Completed', 'Blocked'];
const categories = ['Infrastructure', 'Performance', 'UI/UX', 'Database', 'Security', 'DevOps'];

/**
 * Builds a hierarchical tree from a total node count.
 * Distributes nodes across Dept (depth 0) -> Team (depth 1) -> Project (depth 2) -> Task (depth 3).
 */
export function buildTreeHierarchy(_items: TreeNode[], _random: () => number): TreeNode[] {
  // _items are ignored - we build the tree structurally based on item count
  const totalNodes = _items.length;
  if (totalNodes <= 0) return [];

  let currentId = 1;
  const roots: TreeNode[] = [];

  const rootCount = Math.max(1, Math.min(departments.length, Math.ceil(totalNodes / 40)));
  let remaining = totalNodes;

  for (let r = 0; r < rootCount && remaining > 0; r++) {
    const rootId = currentId++;
    remaining--;
    roots.push({
      id: rootId,
      parentId: null,
      name: `${departments[r % departments.length]} Dept`,
      category: categories[r % categories.length],
      value: 10000 + r * 1500,
      status: statuses[r % statuses.length],
      progress: Math.floor((r * 23) % 100),
      depth: 0,
      children: [],
    });
  }

  let currentLevelNodes: TreeNode[] = [...roots];

  for (let depth = 1; depth <= 3 && remaining > 0; depth++) {
    const nextLevelNodes: TreeNode[] = [];
    const prefixes = depth === 1 ? teamPrefixes : depth === 2 ? projectPrefixes : taskPrefixes;
    const typeName = depth === 1 ? 'Team' : depth === 2 ? 'Project' : 'Task';

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

  // Remaining nodes appended as tasks
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
