import assert from "node:assert/strict"
import { blogPostSeo, plainTextExcerpt } from "./blog-seo"
import { SITE_URL } from "./seo"
import type { BlogPost } from "../../types/global"

let passed = 0
const t = (name: string, fn: () => void) => {
  fn()
  passed++
  console.log("  ok -", name)
}

const post = (over: Partial<BlogPost> = {}): BlogPost => ({
  id: "post_1",
  title: "¿Por qué te atrae un cuarzo en particular?",
  url_slug: "por-qu-te-atrae-un-cuarzo-en-particular",
  body_markdown:
    "## La conexión espiritual\n\nCada **cuarzo** tiene una vibración & energía propia.",
  status: "published",
  created_at: "2026-11-01T00:00:00.000Z",
  updated_at: "2026-11-01T00:00:00.000Z",
  ...over,
})

t("S1: title comes from seo_title, without a typed '| CuarzosMX'", () => {
  const seo = blogPostSeo(post({ seo_title: "Cuarzos y tú | CuarzosMX" }), "mx")
  assert.equal(seo.title, "Cuarzos y tú")
  assert.equal(seo.socialTitle, "Cuarzos y tú | CuarzosMX")
})

t("S1: title falls back to the post title when seo_title is empty", () => {
  for (const seo_title of [undefined, "", "   ", "| CuarzosMX"]) {
    const seo = blogPostSeo(post({ seo_title }), "mx")
    assert.equal(seo.title, "¿Por qué te atrae un cuarzo en particular?")
    assert.equal(
      seo.socialTitle,
      "¿Por qué te atrae un cuarzo en particular? | CuarzosMX"
    )
  }
})

t("S1: description comes from seo_description, trimmed", () => {
  const seo = blogPostSeo(
    post({ seo_description: "  Descubre por qué un cuarzo te llama.  " }),
    "mx"
  )
  assert.equal(seo.description, "Descubre por qué un cuarzo te llama.")
})

t("S1: description falls back to the plain-text excerpt of the body", () => {
  for (const seo_description of [undefined, "", "  "]) {
    const seo = blogPostSeo(post({ seo_description }), "mx")
    assert.equal(
      seo.description,
      "La conexión espiritual Cada cuarzo tiene una vibración & energía propia."
    )
  }
})

t("excerpt: strips HTML bodies, script/style content and decodes entities", () => {
  assert.equal(
    plainTextExcerpt(
      '<h2>Hola&nbsp;mundo</h2><script>alert(1)</script><p>Piedras &quot;bonitas&quot; &amp; <a href="/x">más</a></p>'
    ),
    'Hola mundo Piedras "bonitas" & más'
  )
})

t("excerpt: cuts at 160 chars max on a word boundary with an ellipsis", () => {
  const words = Array.from({ length: 60 }, (_, i) => `palabra${i}`).join(" ")
  const excerpt = plainTextExcerpt(words)
  assert.ok(excerpt.length <= 160, `length ${excerpt.length}`)
  assert.ok(excerpt.endsWith("…"))
  const kept = excerpt.slice(0, -1)
  assert.ok(words.startsWith(kept + " "), "cut falls on a word boundary")
})

t("excerpt: short text is kept whole, without an ellipsis", () => {
  assert.equal(plainTextExcerpt("Texto corto."), "Texto corto.")
})

t("S2: canonical is the post's own absolute URL with the route region", () => {
  assert.equal(
    blogPostSeo(post(), "mx").canonical,
    `${SITE_URL}/mx/blog/por-qu-te-atrae-un-cuarzo-en-particular`
  )
  assert.equal(
    blogPostSeo(post({ url_slug: "otro" }), "us").canonical,
    `${SITE_URL}/us/blog/otro`
  )
})

t("S3: image is the post thumbnail as an absolute URL, or null", () => {
  assert.equal(
    blogPostSeo(post({ thumbnail_url: "https://cdn.example.com/a.jpg" }), "mx")
      .image,
    "https://cdn.example.com/a.jpg"
  )
  assert.equal(blogPostSeo(post(), "mx").image, null)
})

console.log(`\n${passed}/${passed} assertions groups passed`)
