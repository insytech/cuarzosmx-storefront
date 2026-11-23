import assert from "node:assert/strict"
import {
  renderSeoContent,
  SEO_CONTENT_COLLAPSE_CHARS,
  seoContentTextLength,
  shouldCollapseSeoContent,
} from "./seo-content"

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

t("renders nothing for empty, whitespace, non-string, null or undefined", () => {
  assert.equal(renderSeoContent(""), "")
  assert.equal(renderSeoContent("   \n\n  \r\n "), "")
  assert.equal(renderSeoContent(null), "")
  assert.equal(renderSeoContent(undefined), "")
  assert.equal(renderSeoContent(42), "")
  assert.equal(renderSeoContent({ html: "<p>x</p>" }), "")
})

t("S1: legacy plain text keeps its '## ' headings and blank-line paragraphs", () => {
  const out = renderSeoContent(
    "## Cuarzos por kilo\nTexto del párrafo\nsigue aquí\n\nSegundo párrafo"
  )
  assert.ok(out.includes("<h2>Cuarzos por kilo</h2>"), out)
  assert.equal((out.match(/<p>/g) ?? []).length, 2, out)
  assert.ok(out.includes("Segundo párrafo"), out)
})

t("S1: editor HTML keeps headings, links, marks, lists, alignment and images", () => {
  const html =
    '<h2 style="text-align: center">Título</h2>' +
    '<p><strong>a</strong> <em>b</em> <u>c</u> <s>d</s> ' +
    '<a target="_blank" rel="noopener noreferrer nofollow" class="text-[#9C72AF] underline hover:text-[#5A2D6B]" href="https://www.cuarzos.mx/mx/store">tienda</a></p>' +
    "<ul><li><p>uno</p></li></ul><ol><li><p>dos</p></li></ol>" +
    '<img class="rounded-xl" src="https://cdn.example.com/a.jpg" alt="a.jpg" data-image-key="abc">'
  const out = renderSeoContent(html)
  assert.ok(out.includes('<h2 style="text-align:center">Título</h2>'), out)
  assert.ok(out.includes('<a target="_blank" rel="noopener noreferrer"'), out)
  assert.ok(out.includes('href="https://www.cuarzos.mx/mx/store"'), out)
  for (const tag of ["<strong>", "<em>", "<u>", "<s>", "<ul>", "<ol>"]) {
    assert.ok(out.includes(tag), `${tag} missing: ${out}`)
  }
  assert.ok(out.includes('src="https://cdn.example.com/a.jpg"'), out)
})

t("S1: scripts and handlers in the stored value are dropped", () => {
  const out = renderSeoContent('<p onclick="x()">Hola</p><script>alert(1)</script>')
  assert.equal(out, "<p>Hola</p>")
})

t("S1: text length ignores tags and attributes, decodes entities, collapses whitespace", () => {
  assert.equal(seoContentTextLength(""), 0)
  assert.equal(
    seoContentTextLength('<h2 style="text-align: center">ab</h2><p><a href="https://x.com/very/long">c</a></p>'),
    "ab c".length
  )
  assert.equal(seoContentTextLength("<p>a &amp; b</p>"), "a & b".length)
  assert.equal(seoContentTextLength("<p>a \n\n\t  b</p>\n\n<p>  c </p>"), "a b c".length)
  assert.equal(
    seoContentTextLength(
      '<div data-youtube-video=""><iframe src="https://www.youtube.com/embed/abc"></iframe></div><img src="https://cdn.example.com/a.jpg" alt="x">'
    ),
    0
  )
})

t("S1: fold decision on HTML counts text only (threshold unchanged)", () => {
  assert.equal(SEO_CONTENT_COLLAPSE_CHARS, 600)
  const a = (n: number) => "a".repeat(n)
  const longAttr = `<p style="text-align: left" class="${a(2000)}">`
  assert.equal(shouldCollapseSeoContent(""), false)
  assert.equal(shouldCollapseSeoContent(`<p>${a(600)}</p>`), false)
  assert.equal(shouldCollapseSeoContent(`<p>${a(601)}</p>`), true)
  // 2000 chars of markup, 600 chars of text: still not folded.
  assert.equal(shouldCollapseSeoContent(`${longAttr}${a(600)}</p>`), false)
  // headings count toward the length
  assert.equal(shouldCollapseSeoContent(`<h2>${a(10)}</h2><p>${a(590)}</p>`), true)
})

console.log(`\n${passed}/${passed} assertions groups passed`)
