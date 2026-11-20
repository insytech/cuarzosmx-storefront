import assert from "node:assert/strict"
import {
  parseSeoContent,
  SEO_CONTENT_COLLAPSE_CHARS,
  shouldCollapseSeoContent,
} from "./seo-content"

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

t("returns no blocks for empty, whitespace, null or undefined", () => {
  assert.deepEqual(parseSeoContent(""), [])
  assert.deepEqual(parseSeoContent("   \n\n  \r\n "), [])
  assert.deepEqual(parseSeoContent(null), [])
  assert.deepEqual(parseSeoContent(undefined), [])
})

t("one or more blank lines (with spaces or CRLF) separate paragraphs", () => {
  assert.deepEqual(parseSeoContent("Uno\n\nDos"), [
    { type: "p", text: "Uno" },
    { type: "p", text: "Dos" },
  ])
  assert.deepEqual(parseSeoContent("Uno\r\n  \r\n\r\nDos\n \t\nTres"), [
    { type: "p", text: "Uno" },
    { type: "p", text: "Dos" },
    { type: "p", text: "Tres" },
  ])
})

t("single newlines inside a paragraph are joined with a space", () => {
  assert.deepEqual(parseSeoContent("Línea uno\nlínea dos\r\n  línea tres  "), [
    { type: "p", text: "Línea uno línea dos línea tres" },
  ])
})

t("a line starting with '## ' becomes an h2, even without a blank line after it", () => {
  assert.deepEqual(
    parseSeoContent("## Cuarzos por kilo\nTexto del párrafo\nsigue aquí\n\n##   Otro título  \n\nFinal"),
    [
      { type: "h2", text: "Cuarzos por kilo" },
      { type: "p", text: "Texto del párrafo sigue aquí" },
      { type: "h2", text: "Otro título" },
      { type: "p", text: "Final" },
    ]
  )
})

t("a heading in the middle of a paragraph splits it", () => {
  assert.deepEqual(parseSeoContent("Antes\n## Título\nDespués"), [
    { type: "p", text: "Antes" },
    { type: "h2", text: "Título" },
    { type: "p", text: "Después" },
  ])
})

t("'##' without text is ignored", () => {
  assert.deepEqual(parseSeoContent("##\n\n##   \n\nTexto"), [{ type: "p", text: "Texto" }])
})

t("'##' without a following space is plain text", () => {
  assert.deepEqual(parseSeoContent("##Hola"), [{ type: "p", text: "##Hola" }])
})

t("HTML-like text stays as literal text", () => {
  assert.deepEqual(parseSeoContent("<script>alert(1)</script>\n\n## <b>x</b>"), [
    { type: "p", text: "<script>alert(1)</script>" },
    { type: "h2", text: "<b>x</b>" },
  ])
})

t("collapses only text longer than the threshold (headings count)", () => {
  const p = (n: number) => ({ type: "p" as const, text: "a".repeat(n) })
  const h = (n: number) => ({ type: "h2" as const, text: "b".repeat(n) })
  assert.equal(shouldCollapseSeoContent([]), false)
  assert.equal(shouldCollapseSeoContent([p(SEO_CONTENT_COLLAPSE_CHARS)]), false)
  assert.equal(shouldCollapseSeoContent([p(SEO_CONTENT_COLLAPSE_CHARS + 1)]), true)
  assert.equal(
    shouldCollapseSeoContent([h(10), p(SEO_CONTENT_COLLAPSE_CHARS - 9)]),
    true
  )
})

console.log(`\n${passed}/${passed} assertions groups passed`)
