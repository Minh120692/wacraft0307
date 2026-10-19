---
title: 'Initials avatars instead of stock photos on the team section'
type: 'bugfix'
created: '2026-10-19'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: '49b2091cab676ff02750bd3e3a852e0c78b778a7'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The team section on `/about/#team` shows four named staff with BootstrapMade "Axis" stock photos (`person-*.webp`). The JA and EN versions are `content/default/team.js` and `content/en/team.js`. Strangers' faces sit under real names, Takahiko Nomoto's among them. Each card also carries three dead `href="#"` social icons, 12 per locale. The 2026-10-19 live audit flagged the photos, and the content-refresh review flagged the icons.

**Approach:** The user decided on 2026-10-19 that each member card shows an initials avatar instead of a photo until real photos arrive. No image of any person is used. Each member's name, title and bio stay as they are, and the social icons are removed. Both locales change the same way.

</frozen-after-approval>

## Implementation Notes

- 2026-10-19: both `team.js` files now hold the four members in a `MEMBERS` array, rendered with `map`. Names, titles and bios are word for word as before; the EN `team&apos;s` became a plain `team's` in a JS string, so the rendered text is unchanged. `initials()` takes the first letter of the first two words.
- The avatar is a `.member-initials` square inside the existing `.member-img` frame, so the card's padding and hover tint still apply. It is styled in `styles/legacy-inline.css` with the theme's `--accent-color`/`--contrast-color` and is `aria-hidden`, because the `<h4>` already names the member.
- Two members share the initials "TN" (Takahiko Nomoto, Thao Nippon). That is what initials give; telling them apart is left to the names beneath.
- Surprise, left alone: the EN bios use "he"/"she", which may have come from the stock photos rather than from the members. The bios are out of scope here.
- Verified: 121/121 tests, build passes; `out/about/` and `out/en/about/` show NM/TN/TN/HD, and no `assets/img/person/` image or `href="#"` social icon remains anywhere in `out/`.
- Correction after review: the earlier "no `assets/img/person/` image remains in `out/`" checked references only. The eight `person-*.webp` files (about 15 MB) were still copied from `public/assets/img/person/` and downloadable. Nothing served references them; only the root legacy `index.html`/`index-en.html` do, through their own copy under the root `assets/`, which is not exported. They were removed with `git rm`, along with a stray `.DS_Store`. After a rebuild `out/assets/img/person/` is gone, and 121/121 tests still pass.

## Review Triage Log

Layer: blind-hunter (oneshot).

- **Stock photo files still published in `out/assets/img/person/`:** medium. Verified: the files were copied by the build and reachable by URL, and no served page used them. Patched by deleting `public/assets/img/person/*`.
- **The EN bios gender each member ("he"/"she") with no source, and Nhat Minh's old photo was a woman's while the bio says "he":** medium. Real misgendering risk on a public page. The frozen intent keeps the bios word for word, so this is deferred for client confirmation.
- **On `/about/` the representative appears twice with different placeholders (logo in 代表挨拶, "TN" in Team), and the JA team card says "Takahiko Nomoto" while the rest of the page says 野本 享彦:** low. Pre-existing: the content refresh set the logo placeholder, and the romanized JA card name predates this change. Deferred.
- **Two adjacent "TN" avatars look identical:** low. The names under them tell them apart; a per-member colour or monogram field adds machinery for a cosmetic gain. Rejected.
- **`MEMBERS` has no `photo` field for later:** low. A speculative hook; adding photos later is a small edit. Rejected.
- **`initials()` and the names are duplicated in both locale files:** low. The repo deliberately duplicates per-locale content modules, and nothing diverges today. Rejected.
- **No test guards against `assets/img/person` or `href="#"` coming back:** low. A regression is unlikely, and a source-grep test adds little. Rejected.
- **`initials("")` renders an empty square:** false. Names are constants in the file, and none is blank.
- **`deferred-work.md` still lists the social icons and the stock photos as open:** low. The defer rules forbid editing old entries; the closure is reported to the human instead. Rejected.
