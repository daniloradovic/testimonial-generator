# PLAN: Testimonial Request Generator

## Elevator Pitch

Paste your product name, a short description, and your customer's name.
Get a personalised, non-pushy testimonial request email — ready to send.
Built for Senja users who struggle to ask for testimonials without sounding awkward.

---

## Stack

- SvelteKit (frontend)
- Node.js + Express (backend — one endpoint)
- Anthropic Claude API (via direct fetch, no SDK needed)
- Vercel (frontend deploy)
- Railway (backend deploy)

---

## How It Works

1. User fills in a simple form:
   - Product name
   - One-line product description
   - Customer name
   - Optional: what the customer achieved / their context
2. Hits "Generate"
3. Frontend sends POST to Node backend
4. Backend calls Claude API with a prompt
5. Returns a polished testimonial request email
6. User sees the result, can copy it with one click
7. Optional: regenerate for a different tone (friendly / formal / short)

---

## UI — Single Page, Clean

Three sections:

### Input form (left or top)
- Product name (text input)
- Product description (short textarea, 1-2 lines)
- Customer name (text input)
- Customer context (optional textarea — "they used us for X and achieved Y")
- Tone selector (3 buttons: Friendly / Professional / Short & sweet)
- Generate button

### Output (right or bottom)
- Generated email in a readable card
- Copy to clipboard button
- Regenerate button
- Small "Powered by Claude" note

### Header
- "Testimonial Request Generator"
- Subtitle: "For Senja users who want more social proof"
- Link to senja.com (shows you know the product)

---

## Backend — Node/Express

Single file: `server.js`

One endpoint: `POST /api/generate`

Request body:
```json
{
  "productName": "PodCheck",
  "productDescription": "A podcast RSS feed health checker",
  "customerName": "Justin",
  "customerContext": "Used PodCheck to fix their Apple Podcasts submission",
  "tone": "friendly"
}
```

Prompt to Claude:
```
You are helping a SaaS founder ask a happy customer for a testimonial.

Product: {productName}
Description: {productDescription}
Customer: {customerName}
Context: {customerContext}

Write a {tone} email asking {customerName} for a testimonial.
Requirements:
- personalised and specific, not generic
- non-pushy and respectful of their time
- mentions what they achieved if context is provided
- includes a clear but soft call to action
- under 150 words
- no subject line needed, just the email body

Return only the email body, nothing else.
```

Response:
```json
{
  "email": "Hey Justin, ..."
}
```

---

## File Structure

```
testimonial-generator/
├── frontend/                    # SvelteKit app
│   ├── src/
│   │   ├── routes/
│   │   │   └── +page.svelte    # Main page — form + output
│   │   └── app.css             # Global styles
│   ├── package.json
│   └── svelte.config.js
├── backend/                     # Node/Express
│   ├── server.js               # Single file — one endpoint
│   ├── .env                    # ANTHROPIC_API_KEY
│   └── package.json
└── README.md
```

---

## Prompt Engineering Notes

- Always include product name in the email — no generic "our product"
- If customerContext is empty, write a more general but still warm email
- Tone mapping:
  - Friendly: casual, first name, conversational
  - Professional: formal, respectful, concise
  - Short & sweet: 3-4 sentences max, direct ask

---

## Deployment

**Backend (Railway):**
- Push `backend/` to GitHub
- Connect to Railway
- Set `ANTHROPIC_API_KEY` env var
- Deploy

**Frontend (Vercel):**
- Push `frontend/` to GitHub
- Connect to Vercel
- Set `VITE_API_URL` to Railway backend URL
- Deploy

---

## LinkedIn Post Angle

*"I wanted to learn SvelteKit and Node. So I built something useful for Senja users.*

*A tool that generates personalised testimonial request emails — paste your product info and customer name, get a ready-to-send email.*

*What I learned coming from Laravel/PHP:*
*[3 honest observations about Svelte vs Laravel DX]*

*Built with SvelteKit + Node + Claude.*"

---

## Senja Outreach After Launch

Message to Olly:

"Hey Olly, I know I applied before and the stack was a concern.
I spent the last few days learning SvelteKit and Node — built a small tool
for Senja users: [link]. It generates personalised testimonial request emails.
Thought it was the most honest way to show I'm serious about ramping up.
Still very interested if there's an opening."

---

## Estimated Build Time

| Task | Time |
|---|---|
| SvelteKit setup + form UI | 1.5 hours |
| Node/Express backend | 45 min |
| Claude API integration | 30 min |
| Copy button + regenerate | 30 min |
| Styling and polish | 45 min |
| Deploy frontend + backend | 30 min |
| README + LinkedIn post | 30 min |
| **Total** | **~5 hours** |

---

## Done When

- [ ] Form accepts all inputs
- [ ] Generate button calls backend
- [ ] Claude returns a personalised email
- [ ] Copy to clipboard works
- [ ] Regenerate works
- [ ] All 3 tones produce different results
- [ ] Deployed and accessible via public URL
- [ ] README is clean
- [ ] LinkedIn post live
- [ ] Outreach message sent to Olly at Senja
