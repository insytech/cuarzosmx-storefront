import assert from "node:assert/strict"
import { sanitizeHtml } from "./blog-seo"

// Corre en Node, igual que el render del servidor del post: aqui no hay DOM.

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


// ---------------------------------------------------------------------------
// S5: rich editor styles and blocks. Allowed values mirror
// `editor-style-allowlist.ts`; anything else is dropped.
// ---------------------------------------------------------------------------

/** Inline style of the first `<tag ...>` in `html` (as serialized), or null. */
const styleOf = (html: string, tag: string): string | null => {
  const m = new RegExp(`<${tag}\\b[^>]*\\sstyle="([^"]*)"`).exec(html)
  return m ? m[1] : null
}

t("S5 inventory: every style, class and attribute of the 34 published posts is kept", () => {
  // Inventory of production on 2026-11-23: styles are only `text-align`
  // (left|center|justify) on p/h1/h2/h3/h4; classes on `a` and `img`.
  const html =
    '<h1 style="text-align: justify">A</h1><h2 style="text-align: center">B</h2>' +
    '<h3 style="text-align: left">C</h3><h4 style="text-align: justify">D</h4>' +
    '<p style="text-align: justify">E <strong>s</strong> <u>u</u> <em>e</em><br></p>' +
    '<p style="text-align: center"><a target="_blank" rel="noopener noreferrer nofollow" class="text-[#9C72AF] underline hover:text-[#5A2D6B]" href="https://www.cuarzos.mx/mx/store">x</a>' +
    ' <a target="_blank" rel="noopener noreferrer nofollow" class="text-blue-600 underline" href="/mx/blog">y</a></p>' +
    '<blockquote><p>q</p></blockquote><hr><ul><li><p>l</p></li></ul><ol><li><p>o</p></li></ol>' +
    '<img class="rounded-xl shadow-lg my-8 w-full max-h-[500px] object-cover" src="https://cdn.example.com/a.jpg" alt="a">' +
    '<img class="max-w-full rounded" src="https://cdn.example.com/b.jpg" alt="b">'
  const out = sanitizeHtml(html)
  for (const piece of [
    '<h1 style="text-align:justify">A</h1>',
    '<h2 style="text-align:center">B</h2>',
    '<h3 style="text-align:left">C</h3>',
    '<h4 style="text-align:justify">D</h4>',
    '<p style="text-align:justify">E <strong>s</strong> <u>u</u> <em>e</em><br /></p>',
    'class="text-[#9C72AF] underline hover:text-[#5A2D6B]"',
    'class="text-blue-600 underline"',
    '<blockquote><p>q</p></blockquote><hr /><ul><li><p>l</p></li></ul><ol><li><p>o</p></li></ol>',
    'class="rounded-xl shadow-lg my-8 w-full max-h-[500px] object-cover"',
    'class="max-w-full rounded"',
  ]) {
    assert.ok(out.includes(piece), `${piece}\n-> ${out}`)
  }
  assert.ok(sanitizeHtml('<p style="text-align: right">r</p>').includes('style="text-align:right"'))
})

t("S5a/b/d: text style span keeps allowlisted color, font family and size", () => {
  const out = sanitizeHtml(
    `<p><span style="color: #5A2D6B; font-family: 'Lora', serif; font-size: 1.25rem">x</span></p>`
  )
  assert.equal(
    out,
    `<p><span style="color:#5A2D6B;font-family:'Lora', serif;font-size:1.25rem">x</span></p>`
  )
  for (const size of ["0.875rem", "1.5rem"]) {
    assert.equal(styleOf(sanitizeHtml(`<span style="font-size: ${size}">x</span>`), "span"), `font-size:${size}`)
  }
  for (const c of ["#9C72AF", "#111827", "#6B7280", "#15803D", "#B45309", "#B91C1C", "#5a2d6b"]) {
    // Kept in canonical (uppercase) form.
    assert.equal(styleOf(sanitizeHtml(`<span style="color: ${c}">x</span>`), "span"), `color:${c.toUpperCase()}`)
  }
})

t("S5d: site fonts kept; Montserrat maps to the next/font variable", () => {
  assert.equal(
    styleOf(sanitizeHtml(`<span style="font-family: 'Montserrat', sans-serif">x</span>`), "span"),
    `font-family:var(--font-montserrat), 'Montserrat', sans-serif`
  )
  assert.equal(
    styleOf(sanitizeHtml(`<span style="font-family: 'Simple Serenity Serif', serif">x</span>`), "span"),
    `font-family:'Simple Serenity Serif', serif`
  )
  assert.equal(
    styleOf(sanitizeHtml(`<span style="font-family: 'Dancing Script', cursive">x</span>`), "span"),
    `font-family:'Dancing Script', cursive`
  )
})

t("S5: non-allowlisted text styles are dropped", () => {
  const cases: [string, string | null][] = [
    ["color: red; position: fixed", null],
    ["color: #123456", null],
    ["color: #5A2D6B; position: fixed; top: 0", "color:#5A2D6B"],
    ["font-family: 'Comic Sans MS', cursive", null],
    ["font-family: Arial", null],
    ["font-family: 'Lora', serif; font-size: 99px", "font-family:'Lora', serif"],
    ["font-size: 2rem", null],
    ["background-color: url(https://evil.example.com/x.png)", null],
    ["background-image: url(https://evil.example.com/x.png)", null],
    ["color: expression(alert(1))", null],
    ["display: none", null],
  ]
  for (const [style, expected] of cases) {
    const out = sanitizeHtml(`<p><span style="${style}">x</span></p>`)
    assert.equal(styleOf(out, "span"), expected, `${style} -> ${out}`)
    assert.ok(out.includes(">x</span>"), out)
  }
  // text-align only with its 4 values, and not on spans
  assert.equal(sanitizeHtml('<p style="text-align: start; color: red">x</p>'), "<p>x</p>")
  assert.equal(styleOf(sanitizeHtml('<p style="text-align: center; position: fixed">x</p>'), "p"), "text-align:center")
  // no style at all on tags outside the allowlist (div, li, img, blockquote)
  assert.equal(
    sanitizeHtml('<div style="color: #5A2D6B">a</div><ul><li style="color: #5A2D6B">b</li></ul>'),
    "<div>a</div><ul><li>b</li></ul>"
  )
})

t("S5c: highlight mark keeps palette background and data-color, drops others", () => {
  const html = '<p><mark data-color="#FEF3C7" style="background-color: #FEF3C7; color: inherit">h</mark></p>'
  assert.equal(
    sanitizeHtml(html),
    '<p><mark data-color="#FEF3C7" style="background-color:#FEF3C7;color:inherit">h</mark></p>'
  )
  assert.equal(
    sanitizeHtml('<mark data-color="red" style="background-color: red; color: #FF0000">h</mark>'),
    "<mark>h</mark>"
  )
  assert.equal(
    sanitizeHtml('<mark style="background-color: url(javascript:alert(1))">h</mark>'),
    "<mark>h</mark>"
  )
})

t("S5e: notices keep data-callout with the 4 types only, and their rich content", () => {
  for (const type of ["info", "success", "warning", "error"]) {
    const html = `<div data-callout="${type}"><h3>T</h3><p>a <a href="/mx/store">l</a></p><ul><li><p>i</p></li></ul></div>`
    assert.equal(sanitizeHtml(html), html)
  }
  assert.equal(sanitizeHtml('<div data-callout="x"><p>a</p></div>'), "<div><p>a</p></div>")
  assert.equal(sanitizeHtml('<p data-callout="info">a</p>'), "<p>a</p>")
})

const BUTTON_STYLE =
  "display: inline-block; background-color: #5A2D6B; color: #FFFFFF; border: 2px solid #111827; " +
  "border-radius: 12px; padding: 12px 24px; font-size: 1rem; font-family: 'Lora', serif; " +
  "font-weight: 600; text-transform: uppercase; text-align: center; text-decoration: none"

t("S5f: buttons keep every validated property, data-button, class and href", () => {
  const html =
    `<p style="text-align: center"><a target="_blank" rel="noopener noreferrer" class="cta" data-button="" style="${BUTTON_STYLE}" href="/mx/store">Comprar</a></p>`
  const out = sanitizeHtml(html)
  assert.equal(
    out,
    '<p style="text-align:center"><a target="_blank" rel="noopener noreferrer" class="cta" data-button="" ' +
      "style=\"display:inline-block;background-color:#5A2D6B;color:#FFFFFF;border:2px solid #111827;" +
      "border-radius:12px;padding:12px 24px;font-size:1rem;font-family:'Lora', serif;" +
      'font-weight:600;text-transform:uppercase;text-align:center;text-decoration:none" href="/mx/store">Comprar</a></p>'
  )
  const plain = sanitizeHtml(
    '<a data-button="" style="display: block; background-color: transparent; color: #5A2D6B; border: none; border-radius: 9999px; padding: 8px 16px; font-size: 0.875rem; font-weight: 400; text-transform: none; text-align: center; text-decoration: none" href="https://www.cuarzos.mx/mx/store">x</a>'
  )
  assert.ok(
    plain.includes(
      'style="display:block;background-color:transparent;color:#5A2D6B;border:none;border-radius:9999px;padding:8px 16px;font-size:0.875rem;font-weight:400;text-transform:none;text-align:center;text-decoration:none"'
    ),
    plain
  )
  assert.ok(plain.includes('href="https://www.cuarzos.mx/mx/store"'), plain)
})

t("S5f: button values outside the allowlist are dropped or normalized", () => {
  const out = sanitizeHtml(
    '<a data-button="" style="display: inline-block; background-color: url(https://e.x/a.png); color: red; ' +
      "border: 9px dashed #000; border-radius: 3px; padding: 0; font-size: 40px; font-family: 'Comic Sans MS'; " +
      'font-weight: 900; position: fixed; top: 0; z-index: 9999" href="/mx/store">x</a>'
  )
  const style = styleOf(out, "a") ?? ""
  assert.ok(!/url\(|red|dashed|Comic|position|z-index|9px|900|40px/.test(style), style)
  for (const p of style.split(";")) {
    const prop = p.split(":")[0]
    assert.ok(
      ["display", "background-color", "color", "border", "border-radius", "padding", "font-size", "font-family", "font-weight", "text-transform", "text-align", "text-decoration"].includes(prop),
      `${prop} in ${style}`
    )
  }
})

t("S5f: button-only properties are dropped on links without data-button", () => {
  assert.equal(
    sanitizeHtml(`<a style="${BUTTON_STYLE}" href="/mx/store">x</a>`),
    '<a href="/mx/store">x</a>'
  )
  assert.equal(
    sanitizeHtml('<p style="display: inline-block; padding: 12px 24px; border: none">x</p>'),
    "<p>x</p>"
  )
})

t("S5f: button hrefs are a relative path or https only", () => {
  for (const href of ["http://evil.example.com", "javascript:alert(1)", "//evil.example.com", "data:text/html,x", "mailto:a@b.c"]) {
    const out = sanitizeHtml(`<a data-button="" href="${href}">x</a>`)
    assert.ok(!/href=/.test(out), `${href} -> ${out}`)
    assert.ok(out.includes(">x</a>"), out)
  }
  // ordinary links keep today's rules (http allowed)
  assert.ok(sanitizeHtml('<a href="http://example.com">x</a>').includes('href="http://example.com"'))
})

t("S5g: FAQ details/summary with answer is kept", () => {
  const html = '<details data-faq=""><summary>Pregunta</summary><div data-faq-answer=""><p>Respuesta <strong>larga</strong></p></div></details>'
  assert.equal(sanitizeHtml(html), html)
  assert.equal(
    sanitizeHtml('<details open ontoggle="alert(1)"><summary onclick="x()">P</summary></details>'),
    "<details><summary>P</summary></details>"
  )
})

t("S5h: tables with colgroup, header cells, spans and min-width are kept", () => {
  const html =
    '<table style="min-width: 50px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"></colgroup>' +
    '<tbody><tr><th colspan="1" rowspan="1"><p>H</p></th><th colspan="2" rowspan="1"><p>H2</p></th></tr>' +
    '<tr><td colspan="1" rowspan="2"><p>c</p></td><td colspan="1" rowspan="1"><p>d</p></td></tr></tbody></table>'
  assert.equal(
    sanitizeHtml(html),
    '<table style="min-width:50px"><colgroup><col style="min-width:25px" /><col style="min-width:25px" /></colgroup>' +
      '<tbody><tr><th colspan="1" rowspan="1"><p>H</p></th><th colspan="2" rowspan="1"><p>H2</p></th></tr>' +
      '<tr><td colspan="1" rowspan="2"><p>c</p></td><td colspan="1" rowspan="1"><p>d</p></td></tr></tbody></table>'
  )
  assert.equal(
    sanitizeHtml('<table style="min-width: 50px; position: absolute; width: 9999px"><thead><tr><th style="min-width: 1px">a</th></tr></thead></table>'),
    '<table style="min-width:50px"><thead><tr><th>a</th></tr></thead></table>'
  )
  assert.equal(sanitizeHtml('<table style="min-width: calc(100vw)"><tbody><tr><td colspan="x">a</td></tr></tbody></table>'), "<table><tbody><tr><td>a</td></tr></tbody></table>")
})

t("S5i: figures keep data-align (3 values), image key and caption", () => {
  for (const align of ["left", "center", "right"]) {
    const html = `<figure data-align="${align}"><img src="https://cdn.example.com/a.jpg" alt="a" data-image-key="K1"><figcaption>Pie</figcaption></figure>`
    assert.equal(
      sanitizeHtml(html),
      `<figure data-align="${align}"><img src="https://cdn.example.com/a.jpg" alt="a" data-image-key="K1" /><figcaption>Pie</figcaption></figure>`
    )
  }
  assert.equal(
    sanitizeHtml('<figure data-align="top" style="float: left"><figcaption>x</figcaption></figure>'),
    "<figure><figcaption>x</figcaption></figure>"
  )
})

t("S5: unknown data-* attributes are dropped", () => {
  assert.equal(
    sanitizeHtml('<p data-x="1">a</p><span data-button="">b</span><div data-faq="">c</div>'),
    "<p>a</p><span>b</span><div>c</div>"
  )
})

// ---------------------------------------------------------------------------
// Browser-normalized styles: a real browser saves the editor HTML through the
// CSSOM (rgb(), border longhands, unquoted fonts, trailing `;`).
// ---------------------------------------------------------------------------

/** Exact button the admin saved in a real browser (local DB, cuarzos-por-kilo). */
const SAVED_BUTTON =
  '<p style="text-align: center;"><a class="text-[#9C72AF] underline hover:text-[#5A2D6B]" data-button="" href="/mx/store" ' +
  'style="display: inline-block; background-color: rgb(156, 114, 175); color: rgb(255, 255, 255); border-width: medium; ' +
  "border-style: none; border-color: currentcolor; border-image: none; border-radius: 12px; padding: 12px 24px; " +
  "font-size: 1rem; font-family: Montserrat, sans-serif; font-weight: 600; text-transform: none; text-align: center; " +
  'text-decoration: none;">Dinero</a></p>'

t("browser form: the saved button keeps its purple background, white text, no border and its font", () => {
  const out = sanitizeHtml(SAVED_BUTTON)
  assert.equal(
    out,
    '<p style="text-align:center"><a class="text-[#9C72AF] underline hover:text-[#5A2D6B]" data-button="" href="/mx/store" ' +
      'style="display:inline-block;background-color:#9C72AF;color:#FFFFFF;border:none;border-radius:12px;' +
      "padding:12px 24px;font-size:1rem;font-family:var(--font-montserrat), 'Montserrat', sans-serif;" +
      'font-weight:600;text-transform:none;text-align:center;text-decoration:none">Dinero</a></p>'
  )
})

t("browser form: bordered button with longhands keeps its border", () => {
  const out = sanitizeHtml(
    '<a data-button="" href="/mx/store" style="background-color: rgba(0, 0, 0, 0); color: rgb(90, 45, 107); ' +
      'border-width: 2px; border-style: solid; border-color: rgb(90, 45, 107); border-image: none;">x</a>'
  )
  assert.ok(out.includes("background-color:transparent;color:#5A2D6B;border:2px solid #5A2D6B;"), out)
})

t("browser form: span with rgb() color and unquoted font keeps both", () => {
  assert.equal(
    styleOf(sanitizeHtml('<p><span style="color: rgb(90, 45, 107); font-family: Lora, serif">x</span></p>'), "span"),
    "color:#5A2D6B;font-family:'Lora', serif"
  )
  assert.equal(
    styleOf(sanitizeHtml('<span style="font-family: &quot;Playfair Display&quot;, serif; font-size: 1.25rem;">x</span>'), "span"),
    "font-family:'Playfair Display', serif;font-size:1.25rem"
  )
  assert.equal(styleOf(sanitizeHtml('<span style="color: rgba(90, 45, 107, 1)">x</span>'), "span"), "color:#5A2D6B")
})

t("browser form: mark with rgb() background keeps it", () => {
  assert.equal(
    sanitizeHtml('<p><mark style="background-color: rgb(254, 243, 199); color: inherit">h</mark></p>'),
    '<p><mark style="background-color:#FEF3C7;color:inherit">h</mark></p>'
  )
  assert.equal(
    sanitizeHtml('<mark data-color="#FEF3C7" style="background-color: rgb(254, 243, 199); color: rgb(90, 45, 107);">h</mark>'),
    '<mark data-color="#FEF3C7" style="background-color:#FEF3C7;color:#5A2D6B">h</mark>'
  )
})

t("browser form: colors outside the palette or not opaque are still dropped", () => {
  assert.equal(styleOf(sanitizeHtml('<span style="color: rgb(1, 2, 3)">x</span>'), "span"), null)
  assert.equal(styleOf(sanitizeHtml('<span style="color: rgba(90, 45, 107, 0.5)">x</span>'), "span"), null)
  assert.equal(sanitizeHtml('<mark style="background-color: rgba(254, 243, 199, 0.5)">h</mark>'), "<mark>h</mark>")
  assert.equal(sanitizeHtml('<mark style="background-color: rgba(254, 243, 199, 0)">h</mark>'), "<mark>h</mark>")
  const button = sanitizeHtml('<a data-button="" href="/mx/store" style="background-color: rgba(156, 114, 175, 0.5); color: rgba(0, 0, 0, 0.5)">x</a>')
  assert.ok(button.includes("background-color:transparent;color:#FFFFFF;"), button)
})

console.log(`\n${passed}/${passed + failed} assertions groups passed`)
if (failed > 0) process.exit(1)
