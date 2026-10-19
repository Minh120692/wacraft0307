---
title: 'Contact form delivers through Web3Forms'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'c9f23cd30a3995a8ac2fa5fbefb19d93e1b6de93'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The contact popup on every page, in both JA and EN, is `components/contact-overlay.js`. It posts to `/api/contact`, which has not existed since the site became a static export (`output: "export"`). Every visitor who fills it in gets a raw `404 Not Found …` error, and no message arrives.

**Approach:** The user decided on 2026-10-19 that the form submits from the browser to Web3Forms (`https://api.web3forms.com/submit`) using `fetch`. The access key is read at build time from `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`. The user has not yet supplied the key or the receiving address. The visitor sees sending, sent and error states in their own locale. When no key was built in, the popup says plainly that the form is unavailable and offers the site's published email address instead.

## Boundaries & Constraints

**Always:**
- Keep the existing fields and their labels: name, email, subject, message and the optional preferred date and time.
- Both locales behave the same way.
- Include a honeypot field.
- Put the testable logic in a plain-JS `lib/` module, because `node --test` cannot import JSX.
- Error text shown to the visitor is fixed localized copy rendered as React text, never a server message or `innerHTML`.

**Never:**
- Add dependencies.
- Hardcode an access key.
- Show a "sent" state when nothing was sent, except to a filled honeypot.
- Touch `server/contact-route.js`, `nodemailer`, the root legacy `*.html`, `company-profile.html`, `_bmad/` or `.agents/`.
- Deploy or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sent | Key built in, required fields valid, Web3Forms answers 200 with `success: true` | Sending state shown, submit button disabled. Then the sent message appears and the form resets. | N/A |
| Rejected | Response not ok, `success` is not `true`, or the body is not JSON | Error message with the mailto fallback. Field values are kept for a retry. | Logged to `console.error`; the visitor never sees the raw message |
| Network failure or timeout | `fetch` throws, or there is no answer within 20 s | Same as Rejected | Same as Rejected |
| No key | `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` empty or unset at build | The form's place holds the unavailable notice with the mailto link. No fields, nothing to submit, no request. | N/A |
| Honeypot filled | Hidden `botcheck` field is non-empty | The sent message appears. No request is made. | N/A |
| Preferred time | Date `2026-10-20`, hour `09`, minute `30`, `PM` | `preferred_datetime: "2026-10-20 21:30"`. 12 AM gives `00`, 12 PM gives `12`. A missing date or hour leaves the field out. | N/A |

</frozen-after-approval>

## Code Map

- `components/contact-overlay.js`: the client component, its `copy` object and the `<form action="/api/contact" className="php-email-form">` at L135. Its `.loading`, `.error-message` and `.sent-message` divs are hidden by `public/assets/css/main.css` L111–155 and shown with Bootstrap's `d-block`. Keep the class names, so the existing styles apply. The popup only opens through React state, so the form cannot be submitted before hydration.
- `components/legacy-scripts.js`: L7 loads `/assets/vendor/php-email-form/validate.js`, which hooks the submit event of every `.php-email-form` and fetches the form's `action`. L59–88 hold the inline `preferred-datetime` script, which writes the hidden `#preferredDatetime` value as `"YYYY-MM-DD HH:MM"`. Both must go, or they race the React handler. Keep the vendor file itself: root legacy HTML has its own copy.
- `server/contact-route.js`: the old nodemailer route. It is a reference for the mail layout (subject prefix `[WA+CRAFT] `, sender name `WA+CRAFT Contact`) and stays untouched.
- `content/{default,en}/footer.js` L54: the published address `nomoto-t@wacraft-jp.com` is the fallback.
- `.env.example`: currently SMTP-only, for `server/contact-route.js`.
- `public/assets/js/main.js`: also touches `#preferredDatetime`, but the Next app does not load it. Ignore it.
- `lib/seo.test.js`: shows the test style, `node:test` with `assert/strict` in ESM.

## Tasks & Acceptance

**Execution:**
- [x] `lib/contact-form.js` -- New module with:
  - `WEB3FORMS_ENDPOINT`;
  - `preferredDatetime({ date, hour, minute, period })`;
  - `isHoneypotFilled(fields)`;
  - `buildPayload(fields, { accessKey, locale })`, which returns the JSON body: `access_key`, `subject` set to `[WA+CRAFT] ` plus the trimmed subject, `from_name: "WA+CRAFT Contact"`, the trimmed `name`, `email` and `message`, `language` set to `ja` or `en`, and `preferred_datetime` only when set. The honeypot field is never part of the body.
  - `async submitContact(payload, { fetchImpl = fetch, timeoutMs = 20000 })`: a POST with JSON `Content-Type` and `Accept` and an `AbortSignal.timeout` when available. It resolves to `{ ok: true }` or `{ ok: false, error }` and never throws.
  -- Pure logic that tests can reach.
- [x] `lib/contact-form.test.js` -- Cover every I/O matrix row reachable without React, using a stub `fetchImpl`. Assert the endpoint, method, headers and body. Add one source-level assertion that `components/` no longer references `/api/contact` or `php-email-form/validate.js`. -- Locks in the matrix and the removed race.
- [x] `components/contact-overlay.js` -- Read the key once as `process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, written literally so Next inlines it. Remove the `action` and `method` attributes. In `onSubmit`, call `preventDefault`, read `FormData` and call the lib functions. Track a `status` of `idle`, `sending`, `sent` or `error`. Give the date, hour, minute and period controls `name`s and drop the hidden `#preferredDatetime` input. Add a visually hidden `botcheck` input with `tabIndex={-1}`, `autoComplete="off"` and `aria-hidden`. The message area gets `aria-live="polite"`. Add the new copy for both locales from the Design Notes. -- The fix itself.
- [x] `components/legacy-scripts.js` -- Remove the `validate.js` `<Script>` and the `preferred-datetime` inline script. -- They would intercept or duplicate the submit.
- [x] `.env.example` -- Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=`, with a comment that it is public by design, must be set at build time, and that the SMTP lines serve only `server/contact-route.js`. -- Documents the deploy prerequisite.

**Acceptance Criteria:**
- Given a build with no key, when `out/index.html` and `out/en/index.html` are inspected, then each shows the unavailable notice with `mailto:nomoto-t@wacraft-jp.com` and has no `<form>` in the popup.
- Given `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=test-key npm run build`, when `out/` is inspected, then both homepages render the form and a JS chunk under `out/_next/` contains `test-key`.
- Given either build, when `out/` is searched, then no HTML or JS references `/api/contact`, and the pages no longer load `php-email-form/validate.js`.

## Design Notes

Copy, rendered as text with the address as a `mailto:` link:

| Key | JA | EN |
|-----|----|----|
| sending | 送信中… | Sending… |
| sent | 送信が完了しました。48時間以内にご連絡いたします。 | Your message has been sent. We will respond within 48 hours. |
| error | 送信できませんでした。時間をおいて再度お試しいただくか、nomoto-t@wacraft-jp.com までメールでご連絡ください。 | Your message could not be sent. Please try again later or email us at nomoto-t@wacraft-jp.com. |
| unavailable | 現在フォームからの送信を受け付けておりません。お手数ですが nomoto-t@wacraft-jp.com までメールでご連絡ください。 | The contact form is not available right now. Please email us at nomoto-t@wacraft-jp.com. |

A Web3Forms access key only lets a sender mail the one address it was registered to, and Web3Forms documents it as safe in client code. It ships in the JS bundle either way. Where to store it for the VPS build (an ignored `.env.local`, or a committed `.env.production`) is settled when the user hands over the key.

## Verification

**Commands:**
- `npm test` -- expected: all tests pass, including the new `lib/contact-form.test.js`.
- `npm run build`, then `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=test-key npm run build` -- expected: both succeed, and `out/` meets the acceptance criteria after each.

**Manual checks (if no CLI):**
- A real delivery cannot be checked until the user supplies the key. Once it is set, send one test message from the built site.

## Implementation Notes

- `lib/contact-form.js` also exports `CONTACT_EMAIL`, `SUBJECT_PREFIX`, `FROM_NAME`, `SUBMIT_TIMEOUT_MS`, `FIELD_NAMES` and `sendContactForm(fields, { accessKey, locale, fetchImpl, timeoutMs })`. `sendContactForm` is the whole submit flow (honeypot check, payload, POST, `console.error` on failure) and resolves to `"sent"` or `"error"`; it exists so the Honeypot row ("no request is made") is testable without React. The component's `onSubmit` only calls it, resets the form on `"sent"` and sets `status`.
- The date, hour, minute and period controls are named `preferred_date`, `preferred_hour`, `preferred_minute`, `preferred_period`. Two extra source-level tests check that the overlay uses every name in `FIELD_NAMES` and reads `process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` literally.
- Status messages render conditionally inside an always-present `aria-live="polite"` container, with the original class names plus `d-block`. The mailto link inside the red error box uses `text-white text-decoration-underline`; the unavailable notice is a plain `<p>`.
- With no key, the client chunk keeps `process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, which resolves through Next's `process` polyfill to `undefined`, so the server render and hydration agree.
- Verified: `npm test` 147/147. Both builds meet the acceptance criteria. A headless Chrome run against the served `out/`, with Web3Forms routed to a stub and nothing leaving the machine, confirmed every matrix row in JA and EN with no page errors. `out/` was rebuilt without a key afterwards.
- Open point: with no key, the form header lead ("Fill in the form below…" / 「お気軽に下記フォームにて送信ください…」) still shows above the unavailable notice.

## Spec Change Log

## Review Triage Log

Pass 1. Layers: blind-hunter (BH), edge-case-hunter (ECH), verification-gap (VG).

- **BH: with no key, `formLead` ("下記フォームにて送信ください" / "Fill in the form below…") still renders above the unavailable notice:** low. Confirmed at `contact-overlay.js`: the lead `<p>` sits outside the `!ACCESS_KEY` ternary, so a keyless deploy shows every visitor two contradictory lines. The fix is a direct correction (render the lead only with a key). Patch.
- **VG: the wiring test `source.includes('name="…"')` passes even when a control sits outside `<form>`:** medium (pre-verified; mutation moving `botcheck` after `</form>` stayed green, and `FormData` would then never carry it). Slicing the source to the `<form…</form>` span before the check is a direct correction to a test this change added. Patch.
- **VG: the overlay's submit flow (reset only on sent, button disabled while sending, `locale` passed through) is not exercised by any test:** medium (pre-verified by mutation). It needs a DOM or render harness, which the frozen intent rules out ("`node --test` cannot import JSX", no dependencies). The Sent/Rejected rows were checked in headless Chrome. Defer, with the render-harness gap already deferred from the content refresh and the page SEO work.
- **VG: the no-key branch is checked only by inspecting `out/` by hand; inverting `!ACCESS_KEY` keeps tests green:** medium (pre-verified). Same root cause and route as the row above. The proposed fix compiles JSX through Next's private `next/dist/build/swc` API, so it is not a trivial patch. Defer.
- **BH: the component behaviour has no automated tests, and the source checks are weak:** medium. This duplicates the two VG rows above (harness) and the VG wiring row (patched). Covered there.
- **BH, ECH: a text-type honeypot may be autofilled for a real visitor, which drops the inquiry while showing "sent" and logs nothing:** maybe-false. Chrome autofill does not classify an unlabeled `name="botcheck"` field with `autocomplete="off"`, but third-party password and identity managers were not tested. If true, the severity is medium. To settle it, test the major password managers on the built form, or switch to Web3Forms' recommended hidden checkbox. Defer, unverified.
- **BH: no privacy notice before name, email and message go to Web3Forms, an overseas processor (APPI):** maybe-false. Whether APPI requires notice or consent for this entrustment is a legal question the code cannot answer. The old SMTP route also passed data through Google with no notice. If true, the severity is medium. To settle it, the client should review the privacy policy (only the legacy `privacy.html` exists). Defer, unverified.
- **BH: the preferred date and time carry no time zone, and EN visitors abroad will enter local time:** low. Pre-existing: the old hidden field and the nodemailer route had the same format. Which zone the team works in (JST or ICT) is the client's call. Defer.
- **BH: the form controls lack linked labels, the four date and time controls share one label, the JA locale shows an English "Hour" placeholder, and `placeholder` on `type="date"` does nothing:** low. Pre-existing markup the diff only re-indented. Defer.
- **BH, ECH: a missing `AbortSignal.timeout` (Safari < 16) means no 20 s limit, so a hung request leaves the form on "sending":** low. Browsers released after 2022 have the API, and a request that hangs without erroring is rare on top of that. A fallback adds timer management. The spec said "when available". Rejected.
- **BH, ECH: whitespace-only name, subject or message passes HTML `required` and is sent trimmed to empty:** low. Real (`required` checks only for an empty value), but a visitor who types only spaces into a required field is unusual. The `type="email"` address still arrives, so the team can reply. A guard adds a branch. Rejected.
- **BH, ECH: a date without an hour is dropped silently; AM and minute 00 are defaults:** low. This is the frozen matrix ("a missing date or hour leaves the field out") and matches the removed inline script. Changing it means editing the spec. Rejected.
- **BH, ECH: the status banner stays after the popup is closed and reopened:** low. The stale banner is still true, since that message was sent, and a reset needs an extra effect. Rejected.
- **BH: `.env.example` does not say which inbox the key must be registered to, or warn about quota abuse of a public key:** low. The receiving inbox is the user's pending decision and is reported to them directly. Abuse of the public key comes with the client-side Web3Forms approach the user chose. Rejected.
- **BH: `CONTACT_EMAIL` duplicates the footer address with no drift test:** low. The address rarely changes, and a cross-file test adds machinery. Rejected.
- **ECH: out-of-range date, hour or minute values (text-fallback date input, tampered select) reach the mail:** low. Every evergreen browser has `type="date"`, and anyone tampering can post to Web3Forms directly anyway. Only the email text is affected. Rejected.
- **ECH: a 200 response whose body fails to read or parse is shown as failed, inviting a duplicate retry:** low. The frozen matrix makes a non-JSON body a Rejected row; changing that means editing the spec. Rejected.
- **ECH: edits made while sending are wiped by `form.reset()` or differ from the sent payload:** low. Sending takes about a second, and a `<fieldset disabled>` wrapper adds structure and default fieldset styling. Rejected.
- **ECH: `submitContact(payload, null)` rejects despite "never throws":** false. The overlay calls `sendContactForm` with an object, and `sendContactForm` passes an object. No caller can pass `null`.
