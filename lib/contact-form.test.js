import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  FIELD_NAMES,
  FROM_NAME,
  SUBMIT_TIMEOUT_MS,
  WEB3FORMS_ENDPOINT,
  buildPayload,
  isHoneypotFilled,
  preferredDatetime,
  sendContactForm,
  submitContact,
} from "./contact-form.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.join(HERE, "..", "components");
const CONTACT_FORM = path.join(COMPONENTS_DIR, "contact-form.js");

/* ------------------------------------------------------------------ fixtures */

const FIELDS = {
  name: "  Taro Yamada ",
  email: " taro@example.com ",
  subject: " Quote request ",
  message: "  Hello\nWorld  ",
  preferred_date: "2026-10-20",
  preferred_hour: "09",
  preferred_minute: "30",
  preferred_period: "PM",
  botcheck: "",
};

const PAYLOAD = buildPayload(FIELDS, { accessKey: "test-key", locale: "en" });

/** A stub `fetch` that records each call and answers with `respond(call)`. */
function stubFetch(respond) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const call = { url, init };
    calls.push(call);
    return respond(call);
  };
  return { calls, fetchImpl };
}

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

function htmlResponse(status) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      throw new SyntaxError("Unexpected token '<'");
    },
  };
}

/** Collects console.error calls instead of printing them. */
let logged;
let realConsoleError;
beforeEach(() => {
  logged = [];
  realConsoleError = console.error;
  console.error = (...args) => logged.push(args);
});
afterEach(() => {
  console.error = realConsoleError;
});

/* --------------------------------------------------------- preferredDatetime */

describe("preferredDatetime", () => {
  it("turns 09:30 PM into 21:30", () => {
    assert.equal(
      preferredDatetime({ date: "2026-10-20", hour: "09", minute: "30", period: "PM" }),
      "2026-10-20 21:30",
    );
  });

  it("maps 12 AM to 00 and 12 PM to 12", () => {
    assert.equal(preferredDatetime({ date: "2026-10-20", hour: "12", minute: "00", period: "AM" }), "2026-10-20 00:00");
    assert.equal(preferredDatetime({ date: "2026-10-20", hour: "12", minute: "15", period: "PM" }), "2026-10-20 12:15");
  });

  it("keeps morning hours as they are", () => {
    assert.equal(preferredDatetime({ date: "2026-10-20", hour: "07", minute: "45", period: "AM" }), "2026-10-20 07:45");
  });

  it("defaults a missing minute to 00", () => {
    assert.equal(preferredDatetime({ date: "2026-10-20", hour: "03", period: "PM" }), "2026-10-20 15:00");
  });

  it("is empty when the date or the hour is missing", () => {
    assert.equal(preferredDatetime({ date: "", hour: "09", minute: "30", period: "PM" }), "");
    assert.equal(preferredDatetime({ date: "2026-10-20", hour: "", minute: "30", period: "PM" }), "");
    assert.equal(preferredDatetime({}), "");
    assert.equal(preferredDatetime(), "");
  });
});

/* ---------------------------------------------------------- isHoneypotFilled */

describe("isHoneypotFilled", () => {
  it("is true when botcheck holds anything", () => {
    assert.equal(isHoneypotFilled({ botcheck: "http://spam.example" }), true);
    assert.equal(isHoneypotFilled({ botcheck: " " }), true);
  });

  it("is false when botcheck is empty or absent", () => {
    assert.equal(isHoneypotFilled({ botcheck: "" }), false);
    assert.equal(isHoneypotFilled({}), false);
  });
});

/* -------------------------------------------------------------- buildPayload */

describe("buildPayload", () => {
  it("builds the Web3Forms body with trimmed fields and the mail layout of the old route", () => {
    assert.deepEqual(PAYLOAD, {
      access_key: "test-key",
      subject: "[WA+CRAFT] Quote request",
      from_name: FROM_NAME,
      name: "Taro Yamada",
      email: "taro@example.com",
      message: "Hello\nWorld",
      language: "en",
      preferred_datetime: "2026-10-20 21:30",
    });
    assert.equal(FROM_NAME, "WA+CRAFT Contact");
  });

  it("sets language to ja for the Japanese locale", () => {
    assert.equal(buildPayload(FIELDS, { accessKey: "k", locale: "default" }).language, "ja");
    assert.equal(buildPayload(FIELDS, { accessKey: "k" }).language, "ja");
  });

  it("leaves preferred_datetime out when no date or hour was chosen", () => {
    const withoutHour = buildPayload({ ...FIELDS, preferred_hour: "" }, { accessKey: "k", locale: "en" });
    const withoutDate = buildPayload({ ...FIELDS, preferred_date: "" }, { accessKey: "k", locale: "en" });
    assert.equal("preferred_datetime" in withoutHour, false);
    assert.equal("preferred_datetime" in withoutDate, false);
  });

  it("never carries the honeypot field or the raw date controls", () => {
    const body = buildPayload({ ...FIELDS, botcheck: "spam" }, { accessKey: "k", locale: "en" });
    for (const key of ["botcheck", "preferred_date", "preferred_hour", "preferred_minute", "preferred_period"]) {
      assert.equal(key in body, false, key);
    }
  });
});

/* ------------------------------------------------------------- submitContact */

describe("submitContact", () => {
  it("Sent: POSTs JSON to the Web3Forms endpoint and resolves ok", async () => {
    const { calls, fetchImpl } = stubFetch(() => jsonResponse(200, { success: true, message: "Email sent" }));

    assert.deepEqual(await submitContact(PAYLOAD, { fetchImpl }), { ok: true });

    assert.equal(calls.length, 1);
    const [{ url, init }] = calls;
    assert.equal(url, WEB3FORMS_ENDPOINT);
    assert.equal(url, "https://api.web3forms.com/submit");
    assert.equal(init.method, "POST");
    assert.deepEqual(init.headers, { "Content-Type": "application/json", Accept: "application/json" });
    assert.deepEqual(JSON.parse(init.body), PAYLOAD);
    assert.ok(init.signal instanceof AbortSignal, "a timeout signal is attached");
  });

  it("times out after 20 s by default", async () => {
    const realTimeout = AbortSignal.timeout;
    const requested = [];
    AbortSignal.timeout = (ms) => {
      requested.push(ms);
      return realTimeout.call(AbortSignal, ms);
    };
    try {
      const { fetchImpl } = stubFetch(() => jsonResponse(200, { success: true }));
      await submitContact(PAYLOAD, { fetchImpl });
    } finally {
      AbortSignal.timeout = realTimeout;
    }
    assert.deepEqual(requested, [20000]);
    assert.equal(SUBMIT_TIMEOUT_MS, 20000);
  });

  it("Rejected: an ok response whose success is not true", async () => {
    const { fetchImpl } = stubFetch(() => jsonResponse(200, { success: false, message: "Invalid access key" }));
    const result = await submitContact(PAYLOAD, { fetchImpl });
    assert.equal(result.ok, false);
    assert.match(String(result.error), /Invalid access key/);
  });

  it("Rejected: a response that is not ok, even if it claims success", async () => {
    for (const status of [400, 429, 500]) {
      const { fetchImpl } = stubFetch(() => jsonResponse(status, { success: true }));
      const result = await submitContact(PAYLOAD, { fetchImpl });
      assert.equal(result.ok, false, `HTTP ${status}`);
      assert.ok(result.error);
    }
  });

  it("Rejected: a body that is not JSON", async () => {
    const { fetchImpl } = stubFetch(() => htmlResponse(200));
    const result = await submitContact(PAYLOAD, { fetchImpl });
    assert.equal(result.ok, false);
    assert.match(String(result.error), /JSON/);
  });

  it("Network failure: fetch throws, and submitContact still resolves", async () => {
    const failure = new TypeError("Failed to fetch");
    const result = await submitContact(PAYLOAD, {
      fetchImpl: async () => {
        throw failure;
      },
    });
    assert.deepEqual(result, { ok: false, error: failure });
  });

  it("Timeout: no answer before the deadline resolves as a failure", async () => {
    const fetchImpl = (url, init) =>
      new Promise((resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(init.signal.reason));
      });
    const result = await submitContact(PAYLOAD, { fetchImpl, timeoutMs: 10 });
    assert.equal(result.ok, false);
    assert.equal(result.error.name, "TimeoutError");
  });

  it("resolves a failure when there is no fetch at all", async () => {
    const result = await submitContact(PAYLOAD, { fetchImpl: null });
    assert.equal(result.ok, false);
  });
});

/* ----------------------------------------------------------- sendContactForm */

describe("sendContactForm", () => {
  it("Sent: reports sent once Web3Forms accepts the message", async () => {
    const { calls, fetchImpl } = stubFetch(() => jsonResponse(200, { success: true }));
    const status = await sendContactForm(FIELDS, { accessKey: "test-key", locale: "en", fetchImpl });
    assert.equal(status, "sent");
    assert.deepEqual(JSON.parse(calls[0].init.body), PAYLOAD);
    assert.equal(logged.length, 0);
  });

  it("Rejected: reports error and logs the cause to console.error", async () => {
    const { fetchImpl } = stubFetch(() => jsonResponse(403, { success: false, message: "Spam detected" }));
    const status = await sendContactForm(FIELDS, { accessKey: "test-key", locale: "en", fetchImpl });
    assert.equal(status, "error");
    assert.equal(logged.length, 1);
    assert.match(logged[0].map(String).join(" "), /Spam detected/);
  });

  it("Network failure: reports error and logs it", async () => {
    const status = await sendContactForm(FIELDS, {
      accessKey: "test-key",
      locale: "en",
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      },
    });
    assert.equal(status, "error");
    assert.equal(logged.length, 1);
  });

  it("Honeypot filled: reports sent and makes no request", async () => {
    const { calls, fetchImpl } = stubFetch(() => jsonResponse(200, { success: true }));
    const status = await sendContactForm({ ...FIELDS, botcheck: "bot" }, { accessKey: "test-key", locale: "en", fetchImpl });
    assert.equal(status, "sent");
    assert.equal(calls.length, 0);
  });
});

/* --------------------------------------------------------------- source code */

function readSources(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return readSources(full);
    return /\.(js|jsx|mjs|ts|tsx)$/.test(entry.name) ? [[full, fs.readFileSync(full, "utf8")]] : [];
  });
}

describe("contact form wiring", () => {
  it("components/ no longer posts to /api/contact or loads php-email-form/validate.js", () => {
    for (const [file, source] of readSources(COMPONENTS_DIR)) {
      assert.equal(source.includes("/api/contact"), false, `${file} references /api/contact`);
      assert.equal(source.includes("php-email-form/validate.js"), false, `${file} loads validate.js`);
    }
  });

  it("the contact page names its controls exactly as lib/contact-form.js reads them, inside the form", () => {
    const source = fs.readFileSync(CONTACT_FORM, "utf8");
    const start = source.indexOf("<form");
    const end = source.indexOf("</form>", start);
    assert.ok(start !== -1, "contact-form.js has no <form");
    assert.ok(end !== -1, "contact-form.js has no </form> after <form");
    const form = source.slice(start, end);
    for (const name of Object.values(FIELD_NAMES)) {
      assert.ok(form.includes(`name="${name}"`), `contact-form.js has no control named "${name}" inside <form>`);
    }
  });

  it("the contact page reads the access key as a literal process.env reference, so Next inlines it", () => {
    const source = fs.readFileSync(CONTACT_FORM, "utf8");
    assert.ok(source.includes("process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY"));
  });
});
