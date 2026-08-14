/**
 * Recursive category expansion.
 *
 * Medusa v2's `category_id[]` product filter is NOT recursive: filtering by a
 * parent category returns only the products assigned *directly* to it. Products
 * that live exclusively in a subcategory are invisible when the shopper filters
 * by the parent, which is not what "filter by Cuarzos Decorativos" means to a
 * human.
 *
 * This module turns a set of selected category ids into "those ids plus every
 * descendant, at any depth", so the caller can hand the full list to the
 * existing `category_id[]` query.
 *
 * It is a pure function over a plain category list — no fetching, no React, no
 * Medusa SDK — so it can be unit tested with fixture data.
 */

/**
 * The minimum shape this module needs. It is intentionally structural (not
 * `HttpTypes.StoreProductCategory`) so fixtures and partially-selected API
 * responses type-check too.
 *
 * Parent/child linkage is read from every source Medusa may populate,
 * because which one is present depends on the `fields` query used:
 *   - `parent_category_id` (plain column, present on full responses)
 *   - `parent_category.id` (populated when `*parent_category` is requested)
 *   - `category_children[].id` (populated when `*category_children` is requested)
 */
export type CategoryTreeNode = {
  id: string
  parent_category_id?: string | null
  parent_category?: { id?: string | null } | null
  category_children?: ({ id?: string | null } | null)[] | null
}

/**
 * Builds a parent id -> child ids adjacency map from a flat category list.
 *
 * Edges are collected from both directions (a child pointing at its parent and
 * a parent listing its children) and de-duplicated, so the map is correct
 * whichever relation the API happened to populate.
 */
const buildChildrenMap = (
  categories: readonly CategoryTreeNode[]
): Map<string, string[]> => {
  const childrenByParent = new Map<string, string[]>()

  const addEdge = (parentId: string, childId: string) => {
    // A category cannot be its own parent; a self-edge would otherwise be a
    // trivially infinite branch (the visited set below also guards this).
    if (!parentId || !childId || parentId === childId) return

    const existing = childrenByParent.get(parentId)
    if (!existing) {
      childrenByParent.set(parentId, [childId])
      return
    }
    if (!existing.includes(childId)) existing.push(childId)
  }

  for (const category of categories) {
    if (!category?.id) continue

    const parentId =
      category.parent_category_id ?? category.parent_category?.id ?? null

    if (parentId) addEdge(parentId, category.id)

    for (const child of category.category_children ?? []) {
      if (child?.id) addEdge(category.id, child.id)
    }
  }

  return childrenByParent
}

/**
 * Expands `selectedIds` to include every descendant category, at any depth.
 *
 * Guarantees:
 *  - **Arbitrary depth**: breadth-first walk, not a single level of children.
 *  - **Cycle safe**: a `visited` set means a malformed parent chain
 *    (A -> B -> A, or a self-parent) terminates instead of looping forever.
 *  - **Unknown ids are preserved, never expanded**: an id that is not in
 *    `categories` is passed through untouched. Dropping it would be unsafe —
 *    if it were the only selection, the caller would end up with an empty
 *    filter and show the *entire* catalog instead of zero results.
 *  - **Deterministic**: output is the selected ids in their original order,
 *    followed by descendants in breadth-first discovery order, de-duplicated.
 *  - **Pure**: inputs are not mutated.
 */
export const expandCategoryIds = (
  categories: readonly CategoryTreeNode[] | null | undefined,
  selectedIds: readonly string[] | null | undefined
): string[] => {
  const seeds = (selectedIds ?? []).filter(Boolean)
  if (seeds.length === 0) return []

  const childrenByParent = buildChildrenMap(categories ?? [])

  const visited = new Set<string>()
  const result: string[] = []
  const queue: string[] = []

  for (const id of seeds) {
    if (visited.has(id)) continue
    visited.add(id)
    result.push(id)
    queue.push(id)
  }

  // Breadth-first over the descendant frontier. `visited` is the cycle guard:
  // an id is enqueued at most once, so the walk is bounded by the number of
  // distinct categories no matter how malformed the parent chain is.
  for (let cursor = 0; cursor < queue.length; cursor++) {
    for (const childId of childrenByParent.get(queue[cursor]) ?? []) {
      if (visited.has(childId)) continue
      visited.add(childId)
      result.push(childId)
      queue.push(childId)
    }
  }

  return result
}
