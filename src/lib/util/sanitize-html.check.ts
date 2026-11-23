import assert from "node:assert/strict"
import { sanitizeHtml } from "./blog-seo"

// Corre en Node, igual que el render del servidor del post: aqui no hay DOM.

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

t("drops <script> and <style> with their content", () => {
  const out = sanitizeHtml(
    "<p>Hola</p><script>alert(1)</script><style>p{color:red}</style>"
  )
  assert.equal(out, "<p>Hola</p>")
})

t("drops event-handler attributes", () => {
  const out = sanitizeHtml(
    '<img src="https://cdn.example.com/a.jpg" alt="a" onerror="alert(1)"><p onclick="x()">t</p>'
  )
  assert.ok(!/onerror|onclick|alert/.test(out), out)
  assert.ok(out.includes('src="https://cdn.example.com/a.jpg"'), out)
})

t("drops javascript: URLs on links and images", () => {
  const out = sanitizeHtml(
    '<a href="javascript:alert(1)">x</a><a href="JaVaScRiPt:alert(1)">y</a><img src="javascript:alert(1)">'
  )
  assert.ok(!/javascript/i.test(out), out)
})

t("keeps allowed links, images, headings and lists", () => {
  const html =
    '<h2>Titulo</h2><ul><li>uno</li></ul><ol><li>dos</li></ol>' +
    '<p><a href="https://www.cuarzos.mx/mx/store">tienda</a> <a href="/mx/blog">blog</a></p>' +
    '<img src="https://cdn.example.com/a.jpg" alt="Cuarzo" width="600" height="400" class="foto" />'
  assert.equal(sanitizeHtml(html), html)
})

t("forces rel=noopener noreferrer on target=_blank links", () => {
  const out = sanitizeHtml(
    '<a href="https://example.com" target="_blank" rel="opener">x</a>'
  )
  assert.equal(
    out,
    '<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a>'
  )
})

t("keeps https YouTube embeds the editor produces (today's config allows iframe)", () => {
  const html =
    '<div data-youtube-video=""><iframe src="https://www.youtube.com/embed/abc" width="640" height="360" allowfullscreen="true" frameborder="0"></iframe></div>'
  const out = sanitizeHtml(html)
  assert.ok(out.includes('<iframe src="https://www.youtube.com/embed/abc"'), out)
  assert.ok(out.includes("data-youtube-video"), out)
})

t("drops iframes that are not https", () => {
  const out = sanitizeHtml('<iframe src="javascript:alert(1)"></iframe><iframe src="http://x.com"></iframe>')
  assert.ok(!/src=/.test(out), out)
})

t("S3: keeps the nocookie YouTube embed Tiptap's paste rule produces", () => {
  const html =
    '<div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=10" class="rounded-xl"></iframe></div>'
  const out = sanitizeHtml(html)
  assert.ok(
    out.includes('src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?start=10"'),
    out
  )
  assert.ok(!/autoplay|disablekbcontrols/.test(out), out)
})

t("S3: drops iframes whose src is not an https YouTube embed", () => {
  const bad = [
    "http://www.youtube.com/embed/abc",
    "http://www.youtube-nocookie.com/embed/abc",
    "https://player.vimeo.com/video/123",
    "https://evil.example.com/embed/abc",
    "https://www.youtube.com.evil.example.com/embed/abc",
    "https://evil.example.com/?u=https://www.youtube.com/embed/abc",
    "https://www.youtube.com/watch?v=abc",
    "https://user@www.youtube.com/embed/abc",
    "https://www.youtube.com:8443/embed/abc",
    "//www.youtube.com/embed/abc",
    "/embed/abc",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
  ]
  for (const src of bad) {
    const out = sanitizeHtml(`<p>a</p><iframe src="${src}"></iframe><p>b</p>`)
    assert.ok(!/<iframe/i.test(out), `${src} -> ${out}`)
    assert.ok(out.includes("<p>a</p>") && out.includes("<p>b</p>"), out)
  }
  assert.ok(!/<iframe/i.test(sanitizeHtml("<p>a</p><iframe></iframe>")))
})

t("keeps Tiptap text-align styles on headings and paragraphs", () => {
  const html = '<h2 style="text-align: center">T</h2><p style="text-align: right">x</p>'
  assert.equal(
    sanitizeHtml(html),
    '<h2 style="text-align:center">T</h2><p style="text-align:right">x</p>'
  )
})

t("renders markdown bodies to sanitized HTML", () => {
  const out = sanitizeHtml(
    "## La conexión espiritual\n\n- uno\n- dos\n\n[tienda](https://www.cuarzos.mx)"
  )
  assert.ok(out.includes("<h2>La conexión espiritual</h2>"), out)
  assert.ok(out.includes("<li>uno</li>"), out)
  assert.ok(out.includes('<a href="https://www.cuarzos.mx">tienda</a>'), out)
})

console.log(`\n${passed}/${passed} assertions groups passed`)
