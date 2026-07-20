# Next.js migration

This project has been scaffolded as a Next.js app while preserving the existing HTML layout and content.

## Run

```bash
npm install
npm run dev
```

For local contact-form testing, create `.env.local` from `.env.example` and fill in your SMTP values.

## Notes

- The homepage renders the existing `index.html` content through Next.js.
- The English page is available at `/en` and renders `index-en.html`.
- Legacy static assets are expected under `public/assets` and `public/img`.
- Contact form submissions post to `/api/contact` and send email via SMTP.
