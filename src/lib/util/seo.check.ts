import assert from "node:assert/strict"
import { pageTitle } from "./seo"

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

t("keeps a title without the site suffix as is", () => {
  assert.equal(pageTitle("Cuarzos decorativos"), "Cuarzos decorativos")
})

t("removes a trailing '| CuarzosMX' typed in the admin", () => {
  assert.equal(pageTitle("Cuarzos Decorativos | CuarzosMX"), "Cuarzos Decorativos")
})

t("removes repeated suffixes, any case, '-' or '–' separators and extra spaces", () => {
  assert.equal(pageTitle("Geodas | CuarzosMX | CuarzosMX"), "Geodas")
  assert.equal(pageTitle("Geodas - cuarzosmx"), "Geodas")
  assert.equal(pageTitle("Geodas  –  CUARZOSMX  "), "Geodas")
})

t("keeps the brand when it is part of the title, not a suffix", () => {
  assert.equal(pageTitle("CuarzosMX en Zacatecas"), "CuarzosMX en Zacatecas")
  assert.equal(pageTitle("Tienda | Todos los Productos"), "Tienda | Todos los Productos")
})

t("returns the fallback when the title is only the suffix or empty", () => {
  assert.equal(pageTitle("| CuarzosMX", "Geodas"), "Geodas")
  assert.equal(pageTitle("", "Geodas"), "Geodas")
  assert.equal(pageTitle(undefined, "Geodas"), "Geodas")
  assert.equal(pageTitle("   ", "Geodas"), "Geodas")
})

console.log(`\n${passed}/${passed} assertions groups passed`)
