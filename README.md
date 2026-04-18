# SpendWise: Personal Finance Dashboard

SpendWise now includes a complete implementation path for a **MERN-style backend** plus a **Redux-managed frontend**.

## What is implemented

- Auth (signup/login) with JWT and hashed passwords.
- Persistent transactions in MongoDB.
- Persistent subscription tracking with monthly burn insights.
- Backend-protected OpenAI finance advisor and chat copilot.
- Wallet automation endpoint (simulation-safe baseline).
- Redux Toolkit state management across auth, transactions, subscriptions, and AI.
- Mobile-responsive dashboard layout.
- Architecture blueprint in `docs/system-architecture.md`.

## Stack

- **Frontend**: Next.js + React + Tailwind + Redux Toolkit
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **AI**: OpenAI API on backend only

## Project structure

- `src/` → frontend app and Redux store
- `server/` → Express API, models, and services

## Local setup

### 1) Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:9002`.

### 2) Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5000`.

Set frontend env:

```bash
# in root .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend env variables (in `server/.env`):

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CLIENT_URL`

## Notes

- Wallet automation is intentionally simulation-only in this version for safety.
- Add payment provider SDKs and signed user confirmation flow before any real-money execution.
