# Next.js migration

This project has been scaffolded as a Next.js app while preserving the existing HTML layout and content.

## Run

```bash
npm install
npm run dev
```

## Notes

- The homepage renders the existing `index.html` content through Next.js.
- The English page is available at `/en` and renders `index-en.html`.
- Legacy static assets are expected under `public/assets` and `public/img`.
- Contact form submissions now post to `/api/contact` and are appended to `tmp/contact-submissions.ndjson`.
