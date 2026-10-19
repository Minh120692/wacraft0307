/**
 * Contact form delivery through Web3Forms, shared by components/contact-overlay.js
 * and lib/contact-form.test.js. Plain JS without JSX, so `node --test` can import it.
 *
 * The site is a static export, so the browser posts straight to Web3Forms. The
 * access key is public by design: it only lets a sender mail the one address it
 * was registered to.
 */

export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** The published address, also in content/{default,en}/footer.js. */
export const CONTACT_EMAIL = "nomoto-t@wacraft-jp.com";

/** Same mail layout as the old nodemailer route in server/contact-route.js. */
export const SUBJECT_PREFIX = "[WA+CRAFT] ";
export const FROM_NAME = "WA+CRAFT Contact";

export const SUBMIT_TIMEOUT_MS = 20000;

/**
 * The `name` of every form control this module reads. The component must use
 * exactly these names; lib/contact-form.test.js checks that it does.
 */
export const FIELD_NAMES = Object.freeze({
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  preferredDate: "preferred_date",
  preferredHour: "preferred_hour",
  preferredMinute: "preferred_minute",
  preferredPeriod: "preferred_period",
  honeypot: "botcheck",
});

function text(value) {
  return value == null ? "" : String(value).trim();
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

/**
 * Builds `"YYYY-MM-DD HH:MM"` (24-hour) from the date, 12-hour clock and AM/PM
 * controls. Returns "" when the date or hour is missing, so the field is left out.
 */
export function preferredDatetime({ date, hour, minute, period } = {}) {
  const day = text(date);
  let hours = Number.parseInt(text(hour), 10);
  if (!day || !Number.isInteger(hours)) return "";

  const meridiem = text(period).toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const minutes = Number.parseInt(text(minute), 10);
  return `${day} ${pad2(hours)}:${pad2(Number.isInteger(minutes) ? minutes : 0)}`;
}

/** True when the hidden `botcheck` field holds anything: only a bot fills it in. */
export function isHoneypotFilled(fields = {}) {
  const value = fields[FIELD_NAMES.honeypot];
  return value != null && String(value) !== "";
}

/**
 * The JSON body for Web3Forms. The honeypot field is never part of it, and
 * `preferred_datetime` appears only when a date and hour were chosen.
 */
export function buildPayload(fields = {}, { accessKey, locale } = {}) {
  const payload = {
    access_key: accessKey,
    subject: SUBJECT_PREFIX + text(fields[FIELD_NAMES.subject]),
    from_name: FROM_NAME,
    name: text(fields[FIELD_NAMES.name]),
    email: text(fields[FIELD_NAMES.email]),
    message: text(fields[FIELD_NAMES.message]),
    language: locale === "en" ? "en" : "ja",
  };

  const when = preferredDatetime({
    date: fields[FIELD_NAMES.preferredDate],
    hour: fields[FIELD_NAMES.preferredHour],
    minute: fields[FIELD_NAMES.preferredMinute],
    period: fields[FIELD_NAMES.preferredPeriod],
  });
  if (when) payload.preferred_datetime = when;

  return payload;
}

/**
 * POSTs the payload to Web3Forms. Resolves to `{ ok: true }` only when the
 * response is ok and its JSON body says `success: true`; otherwise to
 * `{ ok: false, error }`, where `error` is for logs, never for the visitor.
 * Never throws.
 */
export async function submitContact(
  payload,
  { fetchImpl = globalThis.fetch, timeoutMs = SUBMIT_TIMEOUT_MS } = {},
) {
  try {
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    };
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
      init.signal = AbortSignal.timeout(timeoutMs);
    }

    const response = await fetchImpl(WEB3FORMS_ENDPOINT, init);

    let body;
    try {
      body = await response.json();
    } catch {
      return { ok: false, error: `Web3Forms answered HTTP ${response.status} without a JSON body` };
    }

    if (!response.ok || body?.success !== true) {
      return {
        ok: false,
        error: `Web3Forms rejected the message (HTTP ${response.status}): ${body?.message ?? "no message"}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

/**
 * The whole submit flow behind the form: a filled honeypot is reported as sent
 * without any request; anything else is posted, and a failure is logged.
 * Resolves to the status the form shows next, `"sent"` or `"error"`.
 */
export async function sendContactForm(fields, { accessKey, locale, fetchImpl, timeoutMs } = {}) {
  if (isHoneypotFilled(fields)) return "sent";

  const result = await submitContact(buildPayload(fields, { accessKey, locale }), {
    fetchImpl,
    timeoutMs,
  });
  if (result.ok) return "sent";

  console.error("Contact form could not be sent:", result.error);
  return "error";
}
