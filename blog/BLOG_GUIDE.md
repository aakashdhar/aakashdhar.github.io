# Blog Authoring & Validation Guide

The single source of truth for how a post on aakashdhar.me is written, structured, and shipped. Follow this and a new post should be right on the first attempt. The validator agent checks every post against the rules below.

Author: Aakash Dhar, Technical Project Manager (ex-backend developer, 8.5 years). Audience: hiring managers and peers in project management, engineering delivery, and AI. Positioning goal: a **delivery-first PM who also builds AI**, not an AI tinkerer.

---

## 1. Voice and tone

The voice is the whole product. Get this right before anything else. This is the approved voice; every post is written against it.

**Who is speaking.** One person, thinking out loud, honestly. Not a brand, not a thought-leader performing expertise. A working PM who used to write code, telling you something he actually noticed. The register is plain, warm, and a little unguarded. He is willing to be wrong out loud, and when he does not have an answer he says so ("I do not have a tidy fix, and I distrust anyone who claims one"). That admission of uncertainty is what makes the voice trustworthy, not a weakness in it.

**Open on a real moment or a recognisable feeling, never a definition.** The first two lines earn the click with a specific scene, not a thesis. Published openers to match:
- "A developer told me a piece of work was 'basically done.'"
- "I watched a tool write, in about four seconds, the weekly status update I used to spend the better part of an hour on. It was good. That was the unsettling part."
- "The first time something broke in production and someone said 'well, the agent wrote that part,' I felt the ground shift a little."

No "In today's fast-moving AI landscape." A person, a moment, a small tension.

**The signature move: one concrete scene in specific, observed detail.** Anchor every post in a real situation described with the small tells a person actually remembers. Not "communication issues arose" but "'basically done' had been said half a beat too quickly, and I had learned to hear that half-beat." Not "a team member seemed disengaged" but "a developer who had gone quiet in a way that usually means stuck." Those precise observations separate lived experience from a carousel.

**End on a genuine question to the reader.** A real one that invites their experience ("which half of your week did AI take?"), never engagement bait.

**Relatable beats clever.** When in doubt, choose the line that makes someone feel seen.

### Anonymous, but more vivid, not less

When a post draws on real work, keep every bit of the human, observed detail and strip only the identifying label. A reader should feel like they were in the room while having no idea which room it was.

- **Keep** the sensory and emotional specifics: the pause on the call, the thing that looked finished, the half-day a one-hour change took, the exact phrase someone used.
- **Replace** identifying nouns with equally concrete generic ones. Not "the [product] age-check flow" but "a sign-up flow that had to confirm how old someone was." Not "[client]'s Q3 launch" but "a launch with a date that could not move."
- **Never** name a client, product, person, or city unless the city genuinely matters and identifies no one.

Worked transformation:
> Identifying: "On the call, [name] and I approved the onboarding flow I'd generated the night before."
> Anonymous but vivid: "On a client call, I walked them through something I'd generated the evening before. It looked clean, so we both nodded it through. Neither of us had actually read it line by line, and I was the one who should have."

Same moment, same sting, nobody named. That is the target for every post that draws on real work.

### No exaggeration, ever

The power is in the ordinary being true, not the stakes being high. Keep numbers small and real ("a payments flow, two days before a demo," not "a catastrophic outage that nearly sank the company"). Describe modest, recognisable situations. If a real detail is unremarkable, that is fine. When in doubt, undersell. The voice never reaches for "revolutionary," "game-changing," or a body count.

### Sentence craft

Rhythm swings on purpose: a long winding sentence that carries a full thought, then a short one that lands it ("The admin was never the job. It was the packaging around it."). If the pauses fall at even intervals, break it up: merge two, split one, cut one to a stub. Sentences may start with "And" or "But." Fragments are allowed. Repeat a word rather than reaching for a fancy synonym.

### Hard "do nots" (these get flagged)
- **No em dashes, ever.** Commas, colons, full stops; en dashes only in number ranges. Search the draft for the — character and remove every one before shipping.
- **No pretentious or slogan-y one-liners.** Manufactured aphorisms that sound like guru bait ("the sequence is the safety"). A resonant line is fine only if the argument earned it.
- **No overselling or humble-brag.** Credentials and numbers get one quiet, factual mention at most. Repetition reads as boasting.
- **No buzzwords or corporate hype:** "seamless," "robust," "leverage," "landscape," "unlock," "showcase," "underscore," "delve."
- **No "-ing" analysis tails** ("...highlighting the shift," "...reflecting its importance"). If the sentence works without the tail, cut it.
- **No negative parallelism as a tic** ("it is not X, it is Y") and no rule-of-three padding ("faster, cleaner, and more efficient").
- **No phantom authorities** ("experts argue," "studies show") unless a real, named source.
- **No engagement bait**, no "In conclusion" wrap-up, no mechanically bolded phrases down a list.
- **No self-echo across posts.** Do not reuse a sentence or signature phrase in two posts. Vary it.

The test for any sentence: would a specific person, remembering a specific week, actually write this? If it could sit unchanged in anyone's post about anything, cut it.

---

## 2. Content & structure

- **Length: ~850–1000 words.** Below ~700 reads thin; do not pad past ~1100. Aim for depth via a real example and developed reasoning, not filler.
- **3 to 4 sections**, each introduced by a short section heading (`<h2>` in the template's `.sec` block). The heading must match what the section actually says.
- **The last section is the conclusion.** It lands the point and poses the closing question as the final line.
- **One pull quote per post**, placed after roughly the second section. It should be the post's key reframe, stated plainly.
  - **The `<blockquote>` contains only the quote.** No label line of any kind: no "Pull Quote · 01", no "Takeaway", no "THE RULE I LANDED ON". Those all get removed.
- **First paragraph gets `class="lead"`** (amber serif drop cap). It must start with a plain letter, not a quote mark or `<strong>`.
- Use `<em>` for quoted phrases/concepts (renders in Instrument Serif), `<strong>` for key terms, `<code>` for identifiers.

---

## 3. Hard style rules

- **No em dashes ( — , U+2014). Ever.** Use commas, colons, or full stops. En dashes in numeric ranges (`25–30%`, `4–6`) are allowed.
- **British/neutral spelling**, consistent with the existing posts: *organised, prioritise, behaviour, learnt.*
- **Straight quotes** in prose are fine; do not mix in curly and straight randomly.
- No placeholder/template leftovers (`ARTICLE TITLE`, `FILL`, `Lorem`, `KEYWORD 1`).

---

## 4. SEO rules (every post)

**`<title>`** — front-load the primary keyword; aim for **≤60 characters** for the title portion (excluding the `| Aakash Dhar` suffix). Question-form titles are encouraged; they match search intent and AI queries.

**Meta description** — **150–160 characters**, and where the title is a question, the description should read as a concise answer to it.

**Head tags required:**
- `<link rel="canonical">` = the post URL.
- OpenGraph: `og:type=article`, `og:url`, `og:title` (title only, no site suffix), `og:description` (a 1-line hook), `og:image`.
- Twitter: `summary_large_image`, url, title, description, image.
- **Article OG tags:** `article:published_time`, `article:modified_time`, `article:author` (LinkedIn URL), `article:section` (category), 2–3 `article:tag`.
- `meta name="keywords"` — 5 to 8 comma-separated.
- Favicon links: `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`.

**JSON-LD `BlogPosting`** must include all of:
```
headline, image, description, datePublished, dateModified, inLanguage ("en"),
articleSection (= category), keywords (array), wordCount,
mainEntityOfPage,
author  = Person { name, url(LinkedIn), jobTitle: "Technical Project Manager",
                   sameAs: [LinkedIn, GitHub] },
publisher = Person { name, logo: ImageObject(url: /favicon-512.png, 512x512) }
```
Do **not** point the publisher logo at `logo.png` (it does not exist). Use `favicon-512.png`.

**OG image** — a 1200×630 branded card at `/assets/images/blog/<slug>-og.png`. Generate with the OG script (reads each post's `og:title`). Never leave the template's placeholder `agentic-ai-cover.jpg`.

**Internal linking** — every post ends (before `</article>`) with a **"Related reading"** block linking 3 posts, same category first. This builds topical authority and keeps readers on-site.

**Wire the new post into all four indexes:**
1. `sitemap.xml` (add `<url>` with `<lastmod>` = publish date).
2. `index.html` insights list: add a `.post` entry at the top (category, title, one-line summary; no date) and move the `<span class="new">Latest</span>` badge onto it. The entry with that badge is shown as the full-width featured post, and the topic filters build themselves from each entry's category.
3. `llms.txt` (add under Writing).
4. The related-reading blocks of 1–2 sibling posts, if relevant.

---

## 5. AI / answer-engine SEO (GEO/AEO)

AI answer engines (ChatGPT, Perplexity, Google AI Overviews) cite content that is authoritative, fresh, and cleanly structured.

- **Question-style titles and headings** — already the house style; keep it.
- **E-E-A-T author signals** — the `jobTitle` + `sameAs` (LinkedIn, GitHub) in JSON-LD are mandatory; they tell engines who is answering.
- **Freshness** — keep `dateModified` current when a post is edited.
- **The description should answer the question**, so an engine can lift it as a citation.
- **`llms.txt`** at site root stays updated (site map for AI crawlers). `robots.txt` must keep allowing AI bots (currently `Allow: /`).
- Do **not** add FAQ/HowTo schema unless there is matching visible Q&A on the page (fake structured data gets penalised).

---

## 6. Accessibility & design (learned the hard way)

- **`--amber-text` contrast token (the "amber-text-contrast" rule).** Amber `#C97F06` on the cream background is only **2.9:1** and fails WCAG AA for text. Every post must:
  - Define `--amber-text` in `:root` (light `#9A5B02`, 4.9:1) and in `[data-theme="dark"]` (`#FFB224`).
  - Use `color:var(--amber-text)` for **all amber text** (eyebrows, links, `.sec .n`, `.prose h3`, in-prose links, the "Related reading" label). Keep bright `--amber` only for decorative fills/borders/icons.
  - Posts built fresh from `template.html` do **not** have this by default, add it. (This was missed on the first four PM posts and had to be back-fixed.)
- **Other AA-safe tokens:** `--muted-2: #726A57` (not `#A39C8A`), `--ink-faint: #6E6A5E` (not `#9A9A9A`).
- **Heading order:** never skip a level (h1 → h2 → h3; never h2 → h4).
- **Touch targets ≥ 44px** for interactive controls (theme toggle etc.).
- Do not edit the `<style>`, `<script>`, topbar, readbar, or outro of `template.html`; fill only the marked content.

---

## 7. Validator checklist

The validator agent should read each post's prose (inside `<article class="prose">`), the `<h1>`, the `.cover-sub` dek, and the head metadata, and check:

**Voice**
- [ ] Human/relatable opening; first person; a concrete example; a genuine closing question.
- [ ] No slogan-y one-liners; no overselling/repeat-the-number flexing; no buzzwords; no engagement bait.
- [ ] No sentence reused verbatim from another post.

**Style (hard)**
- [ ] Zero em dashes in visible content.
- [ ] `<blockquote>` holds only the quote (no label line).
- [ ] No placeholder leftovers.
- [ ] British spelling consistent.

**Content**
- [ ] ~850–1000 words; 3–4 sections; headings match content; last section concludes + asks the question.

**SEO / structured data**
- [ ] `<title>` front-loaded, title portion ≤60 chars; meta description 150–160 and answer-shaped.
- [ ] canonical, full OG set, Twitter card, article OG tags, keywords present.
- [ ] JSON-LD valid and complete (all fields in §4), author E-E-A-T present, publisher logo = favicon-512.png (not logo.png).
- [ ] OG image exists at `/assets/images/blog/<slug>-og.png` (not the placeholder).
- [ ] "Related reading" block present (3 links, all resolve).
- [ ] Post is in sitemap.xml, index.html list, and llms.txt.

**Accessibility**
- [ ] `--amber-text` defined and used for all amber *text*; muted tokens are the AA-safe values.
- [ ] No skipped heading levels.

---

## 8. New-post workflow (quick)

1. Copy `template.html`, save as `blog/<slug>.html`. Fill every `<!-- FILL -->` marker; do not touch CSS/scripts/outro.
2. Add `--amber-text` and repoint `color:var(--amber)` → `color:var(--amber-text)` (contrast rule).
3. Write to the voice and length rules above. One pull quote, no label. No em dashes.
4. Generate the OG card (`/assets/images/blog/<slug>-og.png`).
5. Enrich JSON-LD + article OG tags per §4; keep meta description 150–160.
6. Add the "Related reading" block (3 same-category posts).
7. Wire into sitemap.xml, index.html insights list, and llms.txt.
8. Run the validator against §7. Fix anything flagged before publishing.
9. Push. In Search Console, resubmit the sitemap and Request Indexing on the new URL. Run the URL through the LinkedIn Post Inspector so the card is primed.
