# TASKS: Testimonial Request Generator

Reference: PLAN_testimonial_request_generator.md

---

## Phase 1 — Project Setup

- [x] Create project folder: `mkdir testimonial-generator && cd testimonial-generator`
- [x] Create backend folder: `mkdir backend && cd backend`
- [x] Init Node project: `npm init -y`
- [x] Install dependencies: `npm install express cors dotenv`
- [x] Create `.env` with `ANTHROPIC_API_KEY=your_key` and `PORT=3000`
- [x] Create empty `server.js`
- [x] Go back to root: `cd ..`
- [x] Create SvelteKit frontend: `npx sv create frontend`
  - Choose: Skeleton/minimal project, No TypeScript, No additional plugins
- [x] `cd frontend && npm install`
- [x] Confirm `npm run dev` starts at `http://localhost:5173`
- [x] Open whole `testimonial-generator` folder in Cursor
- [x] Add PLAN.md and TASKS.md to project root

---

## Phase 2 — Backend (Node/Express)

- [x] Open `backend/server.js`
- [x] Require express, cors, dotenv
- [x] Call `dotenv.config()`
- [x] Create Express app with `cors()` and `express.json()` middleware
- [x] Listen on `process.env.PORT || 3000`
- [x] Create `POST /api/generate` endpoint
- [x] Read from request body: `productName`, `productDescription`, `customerName`, `customerContext`, `tone`
- [x] Return 400 if `productName` or `customerName` are missing
- [x] Build prompt string using all inputs (see PLAN.md for prompt template)
- [x] Call Anthropic API using native `fetch`:
  - URL: `https://api.anthropic.com/v1/messages`
  - Method: POST
  - Headers: `x-api-key`, `anthropic-version: 2023-06-01`, `content-type: application/json`
  - Body: model `claude-sonnet-4-20250514`, max_tokens 500, messages array
- [x] Extract text from `response.content[0].text`
- [x] Return `{ email: "..." }` as JSON
- [x] Wrap in try/catch, return 500 on failure
- [x] Test with curl:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"productName":"PodCheck","productDescription":"Podcast RSS health checker","customerName":"Justin","tone":"friendly"}'
```
- [x] Confirm real email text is returned

---

## Phase 3 — SvelteKit Frontend Form

- [x] Open `frontend/src/routes/+page.svelte`
- [x] Add page header: title "Testimonial Request Generator" + subtitle "For Senja users who want more social proof"
- [x] Add form with these fields:
  - Product name — required text input
  - Product description — required textarea, 2 rows
  - Customer name — required text input
  - Customer context — optional textarea, 3 rows, placeholder "e.g. they used us for X and achieved Y"
- [x] Add tone selector — 3 buttons: Friendly / Professional / Short & sweet
  - Active tone gets highlighted style
  - Default selected: Friendly
- [x] Add Generate button
- [x] Bind all inputs to Svelte reactive variables using `bind:value`
- [x] Disable Generate button when required fields are empty

---

## Phase 4 — API Call + Output

- [x] Add `generating` boolean — true while waiting for response
- [x] Add `result` string — holds the generated email
- [x] Add `error` string — holds error message if something fails
- [x] Add `copied` boolean — for copy button feedback
- [x] On Generate click:
  - Set `generating = true`, clear previous `result` and `error`
  - POST to `${import.meta.env.VITE_API_URL}/api/generate` with JSON body
  - On success: set `result = data.email`
  - On error: set `error = message`
  - Always: set `generating = false`
- [x] Show "Generating..." on button while loading
- [x] Show result card below form when `result` is set
- [x] Show error message in red when `error` is set
- [x] Add Copy to clipboard button:
  - On click: `navigator.clipboard.writeText(result)` then set `copied = true`
  - After 2 seconds: reset `copied = false`
  - Button text: "Copy" / "Copied!"
- [x] Add Regenerate button that re-triggers the same request
- [x] Add small "Powered by Claude" note below result

---

## Phase 5 — Styling

- [x] Clean minimal design — white/light grey background
- [x] Import Inter font from Google Fonts in `app.html`
- [x] Form inputs: clean borders, visible focus ring
- [x] Tone buttons: pill style, active state is dark background white text
- [x] Generate button: prominent, full width or large, dark background
- [x] Result card: slightly different background colour, padding, subtle shadow
- [x] Copy button: outline style, sits top-right of result card
- [x] Mobile responsive — single column on small screens
- [x] Add link to senja.com in subtitle

---

## Phase 6 — Environment Config

- [x] Create `frontend/.env`:
  ```
  VITE_API_URL=http://localhost:3000
  ```
- [x] Confirm fetch uses `import.meta.env.VITE_API_URL` not hardcoded localhost
- [x] Test full flow locally — form to result

---

## Phase 7 — Deploy Backend to Railway

- [x] Push `backend/` to GitHub
- [x] Go to railway.app — create new project from GitHub repo
- [x] Set environment variable: `ANTHROPIC_API_KEY`
- [x] Deploy and copy the public URL
- [x] Test live endpoint with curl

---

## Phase 8 — Deploy Frontend to Vercel

- [x] Push `frontend/` to GitHub
- [x] Go to vercel.com — import repo
- [x] Set environment variable: `VITE_API_URL=https://your-railway-url`
- [x] Deploy and get public URL
- [x] Test full flow on live site
- [ ] Check on mobile

---

## Phase 9 — README

- [x] Create `README.md` in project root
- [x] Include:
  - One-liner: "Testimonial request email generator for Senja users"
  - Screenshot of the tool with a generated email visible
  - Stack: SvelteKit · Node.js · Express · Anthropic Claude
  - Local setup instructions (backend + frontend)
  - Link to live demo
  - "Built for Senja users" context line

---

## Phase 10 — LinkedIn Post

- [ ] Screenshot the tool showing a filled form + generated email
- [ ] Post body (no links — links go in first comment):

```
I wanted to learn SvelteKit and Node. So I built something useful.

A testimonial request generator for Senja users.

Paste your product info and a customer's name. Get a personalised,
non-pushy email ready to send. Three tones: friendly, professional,
or short and sweet.

What surprised me coming from Laravel/PHP:
⚡ Svelte's reactivity is genuinely magical — no useState, no boilerplate
🔄 Node/Express feels lighter than I expected
🤖 Claude handles tone variation really well with a single prompt

Stack: SvelteKit · Node.js · Express · Anthropic/Claude

#SvelteKit #NodeJS #Laravel #BuildInPublic
```

- [ ] Attach screenshot
- [ ] Post — add first comment with live URL and GitHub repo

---

## Done When

- [ ] Tool live at public URL
- [ ] All 3 tones produce meaningfully different emails
- [ ] Copy to clipboard works
- [ ] Looks clean on desktop and mobile
- [ ] README complete
- [ ] LinkedIn post live with screenshot
