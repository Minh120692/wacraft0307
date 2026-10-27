import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { Marked, Renderer } from "marked";

import { localImageSize } from "./image-size.js";
import { blogPostHref, SERVICE_KEYS } from "./site-content.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Root of the publish contract described in `content/blog/README.md`. */
export const BLOG_ROOT = path.join(HERE, "..", "content", "blog");

export const LOCALES = ["default", "en"];

/** BCP-47 tag emitted in hreflang / Open Graph for each locale key. */
export const LOCALE_LANG = {
  default: "ja",
  en: "en",
};

const REQUIRED_FIELDS = ["title", "date", "description"];

/**
 * Keys the seo-cockpit publisher writes in place of ours. It emits one front-matter
 * format for every site it publishes to, so this build accepts its spelling too.
 * When a post carries both, ours wins.
 */
const FIELD_ALIASES = {
  date: "publishedDate",
  updated: "updatedDate",
};

/** The key that holds `field` in this post: ours, or its alias when only that is set. */
function keyFor(data, field) {
  const alias = FIELD_ALIASES[field];
  return data[field] === undefined && alias && data[alias] !== undefined ? alias : field;
}

function localeKey(locale = "default") {
  return locale === "en" ? "en" : "default";
}

export function localeDir(locale = "default", root = BLOG_ROOT) {
  return path.join(root, localeKey(locale));
}

function fail(file, message) {
  throw new Error(`Invalid blog post "${file}": ${message}`);
}

function toIsoDate(value, file, field) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      fail(file, `field "${field}" is not a parseable date`);
    }
    return value.toISOString();
  }
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      fail(file, `field "${field}" is not a parseable date (got ${JSON.stringify(value)})`);
    }
    return parsed.toISOString();
  }
  return fail(file, `field "${field}" is not a parseable date`);
}

/** Slugs appear verbatim in URLs, so they must survive the round-trip unchanged. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Ids the post page uses outside the body (header, menu, footer, the title), so a
 * heading id never collides with one of them. `contact` was the contact popup's;
 * it stays reserved so existing posts keep their heading ids.
 */
const RESERVED_IDS = [
  "header",
  "navmenu",
  "footer",
  "scroll-top",
  "contact",
  "article-title",
  "blog-post-about-title",
  "blog-related-title",
];

/**
 * The anchor id of a heading, the way GitHub and Astro (and so setsubi-pro.net)
 * build it: lowercased, punctuation and symbols dropped, whitespace turned into
 * hyphens. Japanese text stays as is, e.g. "特定電子メールの定義".
 */
export function headingSlug(text) {
  const slug = String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
  return slug === "" ? "section" : slug;
}

/** A per-post `headingSlug` that suffixes repeats with -1, -2, … as GitHub does. */
function createSlugger() {
  const seen = new Map(RESERVED_IDS.map((id) => [id, 0]));
  return (text) => {
    const base = headingSlug(text);
    let slug = base;
    while (seen.has(slug)) {
      seen.set(base, seen.get(base) + 1);
      slug = `${base}-${seen.get(base)}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

/** The visible text of inline tokens, without markup: what a TOC entry shows. */
function plainText(tokens = []) {
  return tokens
    .map((token) => {
      if (token.type === "html" || token.type === "image" || token.type === "br") return "";
      if (token.tokens) return plainText(token.tokens);
      return token.text ?? "";
    })
    .join("");
}

/**
 * A heading that already carries its own number ("1. …", "2.1 …", "STEP1：…").
 * Older posts number their headings by hand; numbering them again would print
 * "1. 1. …", so such a post keeps its own numbers and gets none added.
 */
const NUMBERED_HEADING = /^(\d+([.．-]\d+)*[.．、:：\s)）]|step\s*\d)/i;

const markdown = new Marked({
  renderer: {
    heading({ tokens, depth, id, number }) {
      const idAttr = id ? ` id="${id}"` : "";
      const label = number ? `<span class="heading-number">${number}</span>` : "";
      return `<h${depth}${idAttr}>${label}${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    // Body images get their real size (no layout shift while they load) and load
    // lazily; the size is read from the file under `public/`, so posts need no change.
    image(token) {
      const html = Renderer.prototype.image.call(this, token);
      if (!html.startsWith("<img")) return html;
      const size = localImageSize(token.href);
      const dimensions = size ? ` width="${size.width}" height="${size.height}"` : "";
      return `${html.slice(0, -1)}${dimensions} loading="lazy" decoding="async">`;
    },
  },
});

/**
 * Render a post body to HTML, with an id on every heading and a number on each
 * top-level H2 ("1.") and H3 ("1-1."), and return the table of contents built from
 * those same headings, so the TOC numbers always match the body's.
 */
export function renderBody(content) {
  const tokens = markdown.lexer(content);

  const slug = createSlugger();
  markdown.walkTokens(tokens, (token) => {
    if (token.type === "heading") token.id = slug(plainText(token.tokens));
  });

  const headings = tokens.filter(
    (token) => token.type === "heading" && (token.depth === 2 || token.depth === 3)
  );
  const selfNumbered = headings.some(
    (token) => token.depth === 2 && NUMBERED_HEADING.test(plainText(token.tokens).trim())
  );

  let h2 = 0;
  let h3 = 0;
  const toc = headings.map((token) => {
    if (token.depth === 2) {
      h2 += 1;
      h3 = 0;
    } else {
      h3 += 1;
    }
    if (!selfNumbered) {
      token.number = token.depth === 2 ? `${h2}.` : h2 > 0 ? `${h2}-${h3}.` : null;
    }
    return {
      depth: token.depth,
      id: token.id,
      text: plainText(token.tokens).trim(),
      number: token.number ?? null,
    };
  });

  return { html: markdown.parser(tokens), toc };
}

function optionalText(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function parsePost(dir, filename) {
  const raw = fs.readFileSync(path.join(dir, filename), "utf8");
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    const value = data[keyFor(data, field)];
    const blank = typeof value === "string" && value.trim() === "";
    if (value === undefined || value === null || blank) {
      const alias = FIELD_ALIASES[field];
      fail(filename, `missing required front-matter field "${field}"${alias ? ` (or "${alias}")` : ""}`);
    }
  }

  // An absent `published` means published: the publisher writes a file only to publish
  // it and never emits this key. A present one must still be a real boolean.
  const published = data.published === undefined ? true : data.published;

  if (typeof data.title !== "string") fail(filename, 'field "title" must be a string');
  if (typeof data.description !== "string") fail(filename, 'field "description" must be a string');
  if (typeof published !== "boolean") fail(filename, 'field "published" must be true or false');
  if (data.image !== undefined && typeof data.image !== "string") {
    fail(filename, 'optional field "image" must be a string');
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    fail(filename, 'optional field "tags" must be a list');
  }
  const { html, toc } = renderBody(content);

  const dateKey = keyFor(data, "date");
  const updatedKey = keyFor(data, "updated");
  const date = toIsoDate(data[dateKey], filename, dateKey);
  const slug = filename.replace(/\.md$/i, "");
  if (!SLUG_PATTERN.test(slug)) {
    fail(
      filename,
      `slug "${slug}" must be lowercase ASCII letters, digits and hyphens (filename becomes the URL)`
    );
  }

  return {
    slug,
    file: filename,
    title: data.title.trim(),
    date,
    description: data.description.trim(),
    published,
    image: data.image ?? null,
    imageSize: localImageSize(data.image),
    // seo-cockpit writes these two; anything but a non-empty string means none.
    imageAlt: optionalText(data.imageAlt),
    subcategory: optionalText(data.subcategory),
    tags: data.tags ?? [],
    author: typeof data.author === "string" ? data.author : null,
    updated:
      data[updatedKey] === undefined ? null : toIsoDate(data[updatedKey], filename, updatedKey),
    html,
    toc,
  };
}

/**
 * Read, validate and render every Markdown post in `dir`.
 * Returns published posts, newest first. Throws on any invalid post.
 */
export function readPostsFromDir(dir) {
  let filenames;
  try {
    filenames = fs.readdirSync(dir);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const markdown = filenames.filter((name) => /\.md$/i.test(name)).sort();
  const seen = new Map();
  const posts = [];

  for (const filename of markdown) {
    const post = parsePost(dir, filename);
    if (seen.has(post.slug)) {
      fail(filename, `duplicate slug "${post.slug}" (already used by "${seen.get(post.slug)}")`);
    }
    seen.set(post.slug, filename);
    posts.push(post);
  }

  return posts
    .filter((post) => post.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

/**
 * Published posts for a locale, newest first.
 * `root` exists so tests can point the same reader at fixture directories.
 */
export function getPosts(locale = "default", root = BLOG_ROOT) {
  return readPostsFromDir(localeDir(locale, root));
}

/**
 * Published posts whose `tags` include `tag`, compared case-insensitively, in the
 * same newest-first order as `getPosts`. Tag elements are not type-checked by the
 * contract, so each is stringified before comparing.
 */
export function getPostsByTag(locale = "default", tag = "", root = BLOG_ROOT) {
  const wanted = String(tag).trim().toLowerCase();
  if (wanted === "") return [];
  return getPosts(locale, root).filter((post) =>
    post.tags.some((t) => String(t).trim().toLowerCase() === wanted)
  );
}

/** How many posts the homepage teaser and each service's related list show. */
export const POST_LIST_LIMIT = 3;

/**
 * The newest posts for the homepage teaser. An empty list means the locale has no
 * published posts, and the teaser section is not rendered.
 */
export function featuredPosts(locale = "default", root = BLOG_ROOT) {
  return getPosts(locale, root).slice(0, POST_LIST_LIMIT);
}

/**
 * Each service key mapped to its newest tagged posts, capped at `POST_LIST_LIMIT`.
 * An empty list hides that service's related-posts block.
 */
export function relatedPostsByService(locale = "default", root = BLOG_ROOT) {
  return Object.fromEntries(
    SERVICE_KEYS.map((key) => [key, getPostsByTag(locale, key, root).slice(0, POST_LIST_LIMIT)])
  );
}

/** A post's topics, lowercased: its tags plus its seo-cockpit subcategory. */
function topicsOf(post) {
  const topics = post.tags.map((tag) => String(tag).trim().toLowerCase());
  if (post.subcategory) topics.push(post.subcategory.toLowerCase());
  return new Set(topics);
}

/**
 * The 関連記事 under a post: other posts of the same locale, those sharing the most
 * topics (tags or subcategory) first, then newest first, up to `limit`. Posts that
 * share nothing still fill the list, so a post never ends on an empty section
 * while the locale has others.
 */
export function relatedPosts(locale = "default", slug = "", root = BLOG_ROOT, limit = POST_LIST_LIMIT) {
  const posts = getPosts(locale, root);
  const current = posts.find((post) => post.slug === slug);
  if (!current) return [];

  const topics = topicsOf(current);
  const shared = (post) => [...topicsOf(post)].filter((topic) => topics.has(topic)).length;

  return posts
    .filter((post) => post.slug !== slug)
    .map((post, index) => ({ post, index, score: shared(post) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ post }) => post);
}

/** One published post, or `null` when the slug does not exist in that locale. */
export function getPost(locale = "default", slug = "", root = BLOG_ROOT) {
  return getPosts(locale, root).find((post) => post.slug === slug) ?? null;
}

/** True when the slug is published in the given locale. */
export function hasPost(locale, slug, root = BLOG_ROOT) {
  return getPost(locale, slug, root) !== null;
}

/**
 * Serialize structured data for embedding in an inline `<script>`.
 * Post fields come from external tooling, so escape the characters that could
 * close the block early or start an HTML entity.
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

/**
 * Site-relative paths of a post in every locale that publishes that slug.
 * Keyed by BCP-47 tag, ready to become `alternates.languages`.
 */
export function alternatePaths(slug, root = BLOG_ROOT) {
  const paths = {};
  for (const locale of LOCALES) {
    if (hasPost(locale, slug, root)) {
      paths[LOCALE_LANG[locale]] = blogPostHref(locale, slug);
    }
  }
  return paths;
}
