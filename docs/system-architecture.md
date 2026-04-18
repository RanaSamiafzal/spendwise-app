# SpendWise Full-Stack System Architecture (MERN + Redux)

## 1) Current-state analysis
The current repository is a strong **UI-first Next.js prototype** with mock transaction/budget data and client-only AI flows. It lacks production backend capabilities for persistent records, authentication, secure OpenAI access, and wallet/payment automation orchestration.

## 2) Target architecture

```text
[React/Next.js Client + Redux Toolkit]
   |  HTTPS + JWT
   v
[Node.js + Express API Layer]
   |- Auth Service (JWT, password hashing)
   |- Transaction Service
   |- Subscription Service
   |- AI Copilot Service (OpenAI)
   |- Wallet Automation Orchestrator (simulation-first)
   v
[MongoDB]
   |- users
   |- transactions
   |- subscriptions
   |- wallet_connections
```

## 3) Core modules

### Frontend (React/Next + Redux)
- **Auth slice**: signup/login, token + user hydration.
- **Transactions slice**: CRUD and monthly summary.
- **Subscriptions slice**: list/create and monthly burn insights.
- **AI slice**: advice + chat state for finance agent.
- **Responsive dashboard**: mobile-first cards, forms, and assistant panel.

### Backend (Express + MongoDB)
- `/api/auth`: signup/login/me with bcrypt + JWT.
- `/api/transactions`: protected list/create + monthly aggregation endpoint.
- `/api/subscriptions`: protected list/create + burn/renewal insights.
- `/api/ai/advice` + `/api/ai/chat`: OpenAI-backed assistant.
- `/api/ai/automations/simulate-wallet-action`: secure simulation endpoint for future bill/subscription execution.

## 4) Security logic
- Store OpenAI key only on backend env.
- Use JWT bearer auth on protected endpoints.
- Hash passwords with bcrypt.
- Add CORS allow-list (`CLIENT_URL`) and server-side input validation next iteration.

## 5) Data model logic
- **User**: identity + preferences.
- **Transaction**: normalized income/expense records tied to `userId`.
- **Subscription**: recurring payments with cycle and renewal metadata.
- **WalletConnection**: provider + capabilities + status for automation.

## 6) AI agent logic
- Advice endpoint consumes profile + recent transactions + subscriptions.
- Chat endpoint uses stateful context per request (last transactions/subscriptions).
- Automation actions are simulation-gated until real wallet provider integrations are verified and signed.

## 7) Real-world rollout phases
1. **Phase 1**: Authentication + records + subscriptions + AI read-only advice.
2. **Phase 2**: Plaid/Finicity ingestion, webhook sync, anomaly detection.
3. **Phase 3**: Wallet/bill providers, human-in-the-loop confirmations, policy engine.
4. **Phase 4**: Multi-tenant controls, audit logs, SOC2-ready hardening.
