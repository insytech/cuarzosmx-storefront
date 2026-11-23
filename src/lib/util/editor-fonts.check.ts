import assert from "node:assert/strict"
import { editorFontsHref, editorFontsUsed } from "./editor-fonts"
import { sanitizeHtml } from "./blog-seo"

// S5d: only the allowlisted Google fonts a text actually uses are loaded.

let passed = 0
let failed = 0
const t = (name: string, fn: () => void) => {
  try {
    fn()
    passed++
    console.log("  ok -", name)
  } catch (error) {
    failed++
    console.log("  not ok -", name)
    console.log("    " + String((error as Error).message).split("\n").slice(0, 6).join("\n    "))
  }
}

t("no font-family: no stylesheet", () => {
  assert.equal(editorFontsHref(""), null)
  assert.equal(editorFontsHref("<p>Hola</p>"), null)
  assert.equal(editorFontsHref('<p style="text-align:center">Lora y Poppins en el texto</p>'), null)
})

t("site fonts never need a Google stylesheet", () => {
  const html =
    `<span style="font-family:var(--font-montserrat), 'Montserrat', sans-serif">a</span>` +
    `<span style="font-family:'Simple Serenity Serif', serif">b</span>` +
    `<span style="font-family:'Aqua Grotesque', sans-serif">c</span>`
  assert.equal(editorFontsHref(html), null)
  assert.deepEqual(editorFontsUsed(html), [])
})

t("one URL with each used Google font once, in first-seen order, display=swap", () => {
  const html =
    `<p><span style="color:#5A2D6B;font-family:'Playfair Display', serif">a</span>` +
    `<span style="font-family:'Lora', serif;font-size:1.25rem">b</span>` +
    `<span style="font-family:'Playfair Display', serif">c</span></p>` +
    `<a data-button="" style="display:block;font-family:'Dancing Script', cursive" href="/mx/store">d</a>`
  assert.deepEqual(editorFontsUsed(html), ["Playfair Display", "Lora", "Dancing Script"])
  assert.equal(
    editorFontsHref(html),
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;700&family=Dancing+Script:wght@400;700&display=swap"
  )
})

t("entity-encoded and double-quoted names are read", () => {
  assert.equal(
    editorFontsHref('<span style="font-family:&#39;Cinzel&#39;, serif">a</span><span style=\'font-family: "Lato", sans-serif\'>b</span>'),
    "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@400;700&display=swap"
  )
})

t("never builds a URL from a non-allowlisted name", () => {
  const evil = [
    `<span style="font-family:'Comic Sans MS', cursive">a</span>`,
    `<span style="font-family:'Roboto', sans-serif">a</span>`,
    `<span style="font-family:'Lora&amp;family=Evil', serif">a</span>`,
    `<span style="font-family:'Lora:wght@900', serif">a</span>`,
    `<span style="font-family:x, 'Lora', serif">a</span>`,
  ]
  for (const html of evil) {
    assert.equal(editorFontsHref(html), null, html)
  }
  // font names in the text (not in a style) are ignored
  assert.equal(editorFontsHref("<p>font-family: 'Lora', serif</p>"), null)
})

t("works on sanitizer output (what the pages render)", () => {
  const html = sanitizeHtml(
    `<p><span style="font-family: 'Merriweather', serif">a</span><span style="font-family: 'Comic Sans MS', cursive">b</span></p>`
  )
  assert.equal(
    editorFontsHref(html),
    "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap"
  )
})

console.log(`\n${passed}/${passed + failed} assertions groups passed`)
if (failed > 0) process.exit(1)
