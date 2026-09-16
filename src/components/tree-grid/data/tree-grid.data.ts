import { z } from 'zod';

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

export const DEPARTMENT_NAMES = [
  'Core Platform', 'Cloud Infrastructure', 'Product & Design', 'Data & Analytics',
  'Security Operations', 'Quality Assurance', 'Developer Experience', 'Mobile Solutions',
] as const;

export const NODE_NAME_PREFIXES = [
  'Architecture', 'Frontend', 'Backend', 'Services', 'Pipeline', 'Storage',
] as const;

export const NODE_CATEGORIES = [
  'Infrastructure', 'Performance', 'UI/UX', 'Database', 'Security', 'DevOps',
] as const;

export const NODE_STATUSES = [
  'Active', 'Paused', 'Completed', 'Blocked',
] as const satisfies readonly TreeNode['status'][];

export const MAX_TREE_DEPTH = 3;
export const CHILDREN_PER_NODE = 2;
export const ROOT_ID_INTERVAL = 1000;

type DataPath = Array<string | number>;

function addRelationshipIssue(
  context: z.RefinementCtx,
  path: DataPath,
  message: string,
): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path, message });
}

/** Validates parent links, depths, and ID uniqueness across a complete hierarchy. */
function validateTreeRelationships(roots: readonly TreeNode[], context: z.RefinementCtx): void {
  const ids = new Set<number>();

  const visit = (node: TreeNode, parent: TreeNode | null, path: DataPath): void => {
    const expectedParentId = parent?.id ?? null;
    const expectedDepth = parent ? parent.depth + 1 : 0;

    if (node.parentId !== expectedParentId) {
      addRelationshipIssue(
        context,
        [...path, 'parentId'],
        `Expected parentId ${String(expectedParentId)} for node ${node.id}.`,
      );
    }
    if (node.depth !== expectedDepth) {
      addRelationshipIssue(
        context,
        [...path, 'depth'],
        `Expected depth ${expectedDepth} for node ${node.id}.`,
      );
    }
    if (ids.has(node.id)) {
      addRelationshipIssue(context, [...path, 'id'], `Duplicate node id ${node.id}.`);
    }
    ids.add(node.id);
    node.children.forEach((child, index) => visit(child, node, [...path, 'children', index]));
  };

  roots.forEach((root, index) => visit(root, null, [index]));
}

/** Runtime contract for one node and its recursive descendants. */
export const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z.object({
    id: z.number().int().positive(),
    parentId: z.number().int().positive().nullable(),
    name: z.string().min(1),
    category: z.string().min(1),
    value: z.number(),
    status: z.enum(NODE_STATUSES),
    progress: z.number().min(0).max(100),
    depth: z.number().int().nonnegative(),
    children: z.array(treeNodeSchema),
  }),
);

/** Runtime contract for the complete hierarchy, including cross-node relationships. */
export const treeDatasetSchema = z.array(treeNodeSchema).superRefine(validateTreeRelationships);
