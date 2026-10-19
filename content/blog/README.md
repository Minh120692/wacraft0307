# Blog publish contract

This file is the contract external tooling (for example the `seo-cockpit` runner) writes against.
Anything that follows it is accepted by `npm run build` and emitted as a page. Anything that breaks
it fails the build with an error naming the file and the offending field — a bad post never becomes
a silent or half-rendered page.

## Directory layout

One directory per locale, nothing nested:

```
content/blog/default/   # Japanese — published at /blog/<slug>/
content/blog/en/        # English  — published at /en/blog/<slug>/
```

Only files ending in `.md` are read. Anything else in these directories is ignored. There are no
subdirectories; a Markdown file in a subdirectory is not picked up.

## Filename to slug

The slug is the filename with the `.md` extension removed, and nothing else transforms it.

| File | Locale | URL |
|------|--------|-----|
| `content/blog/default/ai-bpo-operations.md` | `default` | `https://wacraft-jp.com/blog/ai-bpo-operations/` |
| `content/blog/en/ai-bpo-operations.md` | `en` | `https://wacraft-jp.com/en/blog/ai-bpo-operations/` |

The slug must be lowercase ASCII letters, digits and hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`), because
it appears verbatim in the URL. Spaces, uppercase letters, underscores, non-ASCII characters and a
leading or trailing hyphen fail the build.

**Pairing across locales:** two files with the *same* filename in the two locale directories are
treated as translations of each other and get reciprocal `hreflang` links. A slug that exists in
only one locale is fine — its page simply lists that one locale. Nothing else links the two files;
the filename is the only pairing key.

## Front-matter

YAML front-matter delimited by `---`, at the very top of the file.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | **yes** | Used as `<h1>`, `<title>` (suffixed with ` \| WA+CRAFT`), Open Graph title and JSON-LD `headline`. Quote it if it contains `:` or `#`. |
| `date` | date (`YYYY-MM-DD`) | **yes** | Publication date. Drives ordering (newest first), `datePublished` and sitemap `lastmod`. Must parse as a date. `publishedDate` is accepted in its place. |
| `description` | string | **yes** | One or two sentences. Used as the meta description, the card summary and the Open Graph description. Keep it under ~160 characters. |
| `published` | boolean (`true` / `false`) | no | Defaults to `true` when the key is absent. When present it must be a real YAML boolean, not the string `"true"` and not empty. `false` keeps the file in the repo but excludes it from the index, the generated routes and the sitemap. |
| `image` | string | no | Site-relative path to a hero / social image, e.g. `/assets/img/japan1.png`. Turned into an absolute URL for Open Graph and JSON-LD. Omit it and the post renders without an image. |
| `author` | string | no | Defaults to `WA+CRAFT` in JSON-LD. |
| `updated` | date | no | Last-modified date. Defaults to `date`. Must parse as a date when present. `updatedDate` is accepted in its place. |
| `tags` | list of strings | no | Currently metadata only; not rendered. |

Unknown fields are ignored, so extra keys are safe to emit.

### Files written by seo-cockpit

The `seo-cockpit` publisher (`~/Projects/auto_workflow/seo-cockpit`, `cockpit/lib/frontmatter.ts`)
writes one front-matter format for every site it publishes to. That format is accepted as is:

- `publishedDate` / `updatedDate` stand in for `date` / `updated`. When a file has both spellings,
  `date` and `updated` win.
- It never writes `published`; the file exists only because it was published, so the default
  `true` applies.
- Its `excerpt`, `category`, `subcategory` and `imageAlt` are unknown fields here and are ignored.
- Images go to `public/img/blog/<slug>/` and `image` holds `/img/blog/<slug>/<file>`.

Renaming any of these keys on either side breaks publishing, so change both repos together.

## Template

Copy this, replace the values, save as `content/blog/<locale>/<slug>.md`:

```markdown
---
title: "Post title goes here"
date: 2026-09-24
description: "One or two sentences that work as the meta description and list summary."
published: true
image: "/assets/img/japan1.png"
author: "WA+CRAFT"
tags:
  - AI
  - BPO
---

Opening paragraph. Standard Markdown below the front-matter.

## A section heading

- bullet
- bullet

> A blockquote.
```

## Body

Everything after the closing `---` is CommonMark, rendered to HTML at build time by `marked`.
Headings, lists, links, blockquotes, tables, code blocks and inline HTML all work. Do **not** repeat
the `title` as a top-level `#` heading: the page already renders it as the `<h1>`, so start body
sections at `##`.

Images in the body use ordinary Markdown with site-relative paths, e.g.
`![alt text](/assets/img/japan1.png)`.

## Validation rules that fail the build

The build throws — it does not skip the post — when any of these hold:

1. `title`, `date` (or `publishedDate`) or `description` is missing, `null`, an empty string, or a
   string of only whitespace. (`title` and `description` are trimmed before use.)
2. `title` or `description` is not a string.
3. `published` is present but is not a boolean (an empty `published:` counts as not a boolean).
4. `date` / `publishedDate` (or `updated` / `updatedDate`, when present) does not parse as a date.
5. `image` is present but is not a string.
6. `tags` is present but is not a list.
7. Two files in the same locale directory resolve to the same slug.
8. The filename does not match the slug charset above.

Each error names the file and the offending field, for example:

```
Invalid blog post "ai-bpo-operations.md": missing required front-matter field "description"
```

## Checking a post before committing

```bash
npm test     # runs the front-matter and routing tests
npm run build
```

A successful build writes `out/blog/<slug>/index.html` and `out/en/blog/<slug>/index.html`, and adds
both URLs to `out/sitemap.xml`.
