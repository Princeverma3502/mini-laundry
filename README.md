# Mini Laundry — Mini Laundry Order Management System

Mini Laundry is a small, practical order management system for a dry cleaning store. It includes a minimal Express API, a tiny frontend demo, and simple JSON persistence. Tests are included.

Quick Start

```bash
git clone https://github.com/Princeverma3502/mini-laundry.git
cd mini-laundry
npm install
npm run dev
# open http://localhost:4000
```

Run tests

```bash
npm test
```

What you get

- REST API: create orders, list/filter, update status, dashboard summary
- Demo UI: `public/index.html` for manual testing
- Storage: lightweight JSON persistence (`data/orders.json`) with an optional SQLite migration helper
- Tests: `test/api.test.js` (Mocha + Supertest + Chai)

API Endpoints

- POST `/api/orders` — create order
  - body: `{ customerName, phone, garments: [{type, quantity, price?}] }`
- GET `/api/orders` — list orders (query `status`, `q`)
- GET `/api/orders/:id` — get order
- PATCH `/api/orders/:id/status` — update status `{ status }`
- GET `/api/orders/-dashboard/summary` — totals

Why this approach

- Speed: JSON persistence and a tiny UI let you run the app locally immediately.
- Clear API surface: easy to extend, add DB, auth, or deploy.

AI Usage Report (brief)

- Tools used: ChatGPT for scaffolding and iteration; GitHub Copilot for in-editor suggestions.
- Example prompts:
  - "Create an Express REST API for orders with JSON persistence."
  - "Small frontend to create/list orders and update status using fetch."
- What I corrected after AI help:
  - Added input validation and numeric conversions
  - Ensured safe JSON file creation and read/write
  - Added tests and improved UX

Tradeoffs & Next Steps

- Tradeoffs: JSON file storage is fine for demo but not production-ready. I included a migration helper for SQLite (`src/migrate_sqlite.js`) but native SQLite bindings may require platform-specific build tools.
- Next improvements: Add a real DB (SQLite/Mongo), add authentication, add CI, and small E2E tests (Cypress).

Delivery notes

- Repo: https://github.com/Princeverma3502/mini-laundry
- To produce a ZIP for email: create one from the project root (Windows PowerShell example):
  `Compress-Archive -Path . -DestinationPath ..\mini-laundry.zip -Force`

Contact

If you want a short demo video or a zip file attached, I can produce that and add it to the repo.

