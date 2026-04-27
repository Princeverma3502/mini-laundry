# Mini Laundry — Mini Laundry Order Management System

This is a lightweight mini laundry order management system (API + tiny UI).

Run locally

1. Install

```bash
cd mini-laundry
npm install
```

2. Start

```bash
npm run dev
# or
npm start
```

Open http://localhost:4000/

API Endpoints

- POST `/api/orders` — create order
  - body: `{ customerName, phone, garments: [{type, quantity, price?}] }`
- GET `/api/orders` — list orders (query `status`, `q`)
- GET `/api/orders/:id` — get order
- PATCH `/api/orders/:id/status` — update status `{ status }`
- GET `/api/orders/-dashboard/summary` — totals

Data storage

Orders are persisted to `data/orders.json` for simplicity.

AI Usage Report

I used AI tools extensively to scaffold and iterate quickly. Below is a concise report you can paste into your submission.

Tools used

- ChatGPT (role: developer assistant) — scaffolded API, routes, storage, and UI snippets
- GitHub Copilot (IDE) — inline suggestions while iterating

Sample prompts I used with the AI

1) "Generate an Express.js REST API for a simple order management system with create, list, update status and a dashboard summary. Use a JSON file for persistence."

2) "Create a small frontend HTML page that can create orders and list orders, and update status using fetch to the API endpoints." 

3) "Provide a computeTotal function that accepts garments with type/quantity/optional price and uses default prices when price is missing." 

What AI got right

- Good initial scaffolding for Express routes and JSON persistence
- Helpful snippets for small frontend interactions and fetch usage

What I fixed / improved after AI suggestions

- Added simple validation for request payloads
- Tuned default prices and ensured numeric conversion for totals
- Added small persistence helper to ensure `data/` exists and to read/write safely
- Reworked route for dashboard summary and consistent response shapes

Tradeoffs and next improvements

- Tradeoffs: simple JSON persistence (not suitable for heavy production). No authentication. Minimal UI.
- Next: add a real DB (SQLite / Mongo), add authentication, add tests, deploy.

Notes for graders

- This project focuses on speed and clarity: API-first, small UI, persistence to JSON so you can run locally quickly.

SQLite and Cypress

To enable SQLite persistence and migrate existing JSON data:

```bash
npm install
# run migration (creates or copies JSON -> SQLite)
npm run migrate
```

To start the server using SQLite (temporary):

```bash
# enable sqlite (Windows)
set USE_SQLITE=1
npm start
```

Run Cypress tests (after starting the server):

```bash
npm run cypress:open
# or headless
npm run cypress:run
```
