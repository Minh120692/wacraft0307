import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";
import { marked } from "marked";

import { blogPostHref } from "./site-content.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Root of the publish contract described in `content/blog/README.md`. */
export const BLOG_ROOT = path.join(HERE, "..", "content", "blog");

export const LOCALES = ["default", "en"];

/** BCP-47 tag emitted in hreflang / Open Graph for each locale key. */
export const LOCALE_LANG = {
  default: "ja",
  en: "en",
};

const REQUIRED_FIELDS = ["title", "date", "description", "published"];

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

function parsePost(dir, filename) {
  const raw = fs.readFileSync(path.join(dir, filename), "utf8");
  const { data, content } = matter(raw);

  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    const blank = typeof value === "string" && value.trim() === "";
    if (value === undefined || value === null || blank) {
      fail(filename, `missing required front-matter field "${field}"`);
    }
  }

  if (typeof data.title !== "string") fail(filename, 'field "title" must be a string');
  if (typeof data.description !== "string") fail(filename, 'field "description" must be a string');
  if (typeof data.published !== "boolean") fail(filename, 'field "published" must be true or false');
  if (data.image !== undefined && typeof data.image !== "string") {
    fail(filename, 'optional field "image" must be a string');
  }
  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    fail(filename, 'optional field "tags" must be a list');
  }

  const date = toIsoDate(data.date, filename, "date");
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
    published: data.published,
    image: data.image ?? null,
    tags: data.tags ?? [],
    author: typeof data.author === "string" ? data.author : null,
    updated: data.updated === undefined ? null : toIsoDate(data.updated, filename, "updated"),
    html: marked.parse(content),
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
