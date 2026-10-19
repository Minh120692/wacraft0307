import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Where site-relative image paths such as `/img/blog/<slug>/2.jpg` live on disk. */
export const PUBLIC_ROOT = path.join(HERE, "..", "public");

/** JPEG markers that carry no length field. */
function isStandaloneMarker(marker) {
  return marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9);
}

/** Start-of-frame markers (SOF0–SOF15), which hold the frame size. */
function isStartOfFrame(marker) {
  return marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
}

function jpegSize(buffer) {
  let offset = 2;
  while (offset + 9 <= buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    if (marker === 0xff) {
      offset += 1;
    } else if (isStandaloneMarker(marker)) {
      offset += 2;
    } else if (isStartOfFrame(marker)) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    } else {
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  return null;
}

function webpSize(buffer) {
  switch (buffer.toString("ascii", 12, 16)) {
    case "VP8X":
      return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    case "VP8 ":
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    case "VP8L": {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    default:
      return null;
  }
}

/**
 * Pixel size of a PNG, JPEG, GIF or WebP image from its header bytes, or `null`
 * for any other or truncated file. Enough to give `<img>` its width and height.
 */
export function imageDimensions(buffer) {
  if (buffer.length >= 24 && buffer.toString("latin1", 1, 4) === "PNG" && buffer.toString("ascii", 12, 16) === "IHDR") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 10 && buffer.toString("ascii", 0, 3) === "GIF") {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return webpSize(buffer);
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    return jpegSize(buffer);
  }
  return null;
}

const cache = new Map();

/**
 * Pixel size of a site-relative image under `public/`, or `null` when the path is
 * external, missing, outside `public/` or not a readable image. Cached per path.
 */
export function localImageSize(src, root = PUBLIC_ROOT) {
  if (typeof src !== "string" || !src.startsWith("/") || src.startsWith("//")) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(src.split(/[?#]/)[0]);
  } catch {
    return null;
  }
  const file = path.join(root, pathname);
  if (!file.startsWith(root + path.sep)) return null;

  if (!cache.has(file)) {
    let size = null;
    try {
      size = imageDimensions(fs.readFileSync(file));
    } catch {
      // A missing or unreadable file only costs the image its size attributes.
    }
    cache.set(file, size);
  }
  return cache.get(file);
}
