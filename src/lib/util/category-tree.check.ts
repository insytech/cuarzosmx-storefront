import assert from "node:assert/strict"
import { expandCategoryIds, CategoryTreeNode } from "./category-tree"

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

// --- Fixture A: 3 levels, linkage via parent_category_id only -------------
const deep: CategoryTreeNode[] = [
  { id: "root" },
  { id: "a", parent_category_id: "root" },
  { id: "b", parent_category_id: "root" },
  { id: "a1", parent_category_id: "a" },
  { id: "a1x", parent_category_id: "a1" },
  { id: "orphan" },
]

t("multi-level nesting (3 levels deep)", () => {
  assert.deepEqual(expandCategoryIds(deep, ["root"]), ["root", "a", "b", "a1", "a1x"])
})
t("mid-tree selection only pulls its own subtree", () => {
  assert.deepEqual(expandCategoryIds(deep, ["a"]), ["a", "a1", "a1x"])
})
t("leaf selection returns just the leaf", () => {
  assert.deepEqual(expandCategoryIds(deep, ["a1x"]), ["a1x"])
})
t("multiple selections de-duplicate overlapping subtrees", () => {
  assert.deepEqual(expandCategoryIds(deep, ["root", "a"]), ["root", "a", "b", "a1", "a1x"])
})

// --- Fixture B: linkage via category_children only (Medusa *expansion) ----
const viaChildren: CategoryTreeNode[] = [
  { id: "p", category_children: [{ id: "c1" }, { id: "c2" }] },
  { id: "c1", category_children: [{ id: "g1" }] },
  { id: "c2", category_children: [] },
  { id: "g1", category_children: [] },
]
t("linkage read from category_children", () => {
  assert.deepEqual(expandCategoryIds(viaChildren, ["p"]), ["p", "c1", "c2", "g1"])
})

// --- Fixture C: linkage via nested parent_category object -----------------
const viaParentObj: CategoryTreeNode[] = [
  { id: "p", category_children: [] },
  { id: "c", parent_category: { id: "p" }, category_children: [] },
]
t("linkage read from parent_category.id", () => {
  assert.deepEqual(expandCategoryIds(viaParentObj, ["p"]), ["p", "c"])
})

// --- Cycle safety ---------------------------------------------------------
const cyclic: CategoryTreeNode[] = [
  { id: "x", parent_category_id: "z" },
  { id: "y", parent_category_id: "x" },
  { id: "z", parent_category_id: "y" },
]
t("cycle x->y->z->x terminates and yields each id once", () => {
  const out = expandCategoryIds(cyclic, ["x"])
  assert.deepEqual(out, ["x", "y", "z"])
  assert.equal(new Set(out).size, out.length)
})
t("self-parent does not loop", () => {
  assert.deepEqual(expandCategoryIds([{ id: "s", parent_category_id: "s" }], ["s"]), ["s"])
})
t("two-node cycle terminates", () => {
  const two: CategoryTreeNode[] = [
    { id: "m", parent_category_id: "n" },
    { id: "n", parent_category_id: "m" },
  ]
  assert.deepEqual(expandCategoryIds(two, ["m"]), ["m", "n"])
})

// --- Unknown ids ----------------------------------------------------------
t("unknown id is preserved, not dropped (never widens the filter)", () => {
  assert.deepEqual(expandCategoryIds(deep, ["nope"]), ["nope"])
})
t("unknown id mixed with a real one keeps both", () => {
  assert.deepEqual(expandCategoryIds(deep, ["nope", "a"]), ["nope", "a", "a1", "a1x"])
})

// --- Empty / degenerate ---------------------------------------------------
t("empty selection -> empty result", () => {
  assert.deepEqual(expandCategoryIds(deep, []), [])
})
t("null/undefined selection -> empty result", () => {
  assert.deepEqual(expandCategoryIds(deep, null), [])
  assert.deepEqual(expandCategoryIds(deep, undefined), [])
})
t("null/empty category list -> selection passed through unchanged", () => {
  assert.deepEqual(expandCategoryIds(null, ["a", "b"]), ["a", "b"])
  assert.deepEqual(expandCategoryIds([], ["a"]), ["a"])
})
t("duplicate selections collapse", () => {
  assert.deepEqual(expandCategoryIds(deep, ["a", "a"]), ["a", "a1", "a1x"])
})
t("input arrays are not mutated", () => {
  const sel = ["root"]
  const snapshot = JSON.parse(JSON.stringify(deep))
  expandCategoryIds(deep, sel)
  assert.deepEqual(sel, ["root"])
  assert.deepEqual(deep, snapshot)
})

console.log(`\n${passed}/${passed} assertions groups passed`)
