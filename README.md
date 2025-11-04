Plagiarism Checker (minimal)

This is a minimal Node.js + Express app that takes pasted text or a PDF and checks each text chunk against Google Programmable Search (Custom Search) to find possible matches.

Requirements
- Node.js (16+ recommended)
- A Google API key with Custom Search enabled
- A Custom Search Engine ID (CX) configured to search the web

Setup
1. Copy `.env.example` to `.env` and set `VITE_GOOGLE_AI_API_KEY` and `GOOGLE_CX`.
2. Install dependencies: npm install
3. Start server: npm start
4. Open http://localhost:3000

Notes and assumptions
- The app reads your Google API key from `VITE_GOOGLE_AI_API_KEY` in `.env` (you provided this key).
- The CSE ID must be set in `GOOGLE_CX`.
- This is a simple approach: it chunks text and performs one Custom Search per chunk. Google API quotas and billing apply.
- Accuracy is basic: a returned result doesn't guarantee plagiarism; it's only an indicator that similar text exists online.

Improvements you can make
- Use a dedicated plagiarism API or OpenAI embeddings + nearest-neighbor search for more robust matching.
- Add rate limiting, caching, retry/backoff and progress indicators.
- Add server-side authorization and HTTPS for production.
