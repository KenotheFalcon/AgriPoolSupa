
# AgriPool — Product Requirements Document (PRD)

## Document control

- Version: 2.0
- Date: 2025-09-03
- Owners: Product + Engineering (AgriPool)
- Status: Draft for review

## 1) Product overview

- **Product**: AgriPool is a marketplace that connects buyers and farmers to purchase agricultural produce, with support for group buys, secure payments, and logistics coordination.
- **Vision**: Reduce food distribution friction in emerging markets by aggregating demand and enabling direct farmer-to-buyer transactions.
- **Target users**: Consumers/buyers, farmers, support/ops, admins.

## 2) Problem statement

- Fragmented supply chain leads to higher prices and waste.
- Buyers lack transparency on quality, price, and logistics.
- Farmers lack reliable channels, upfront demand, and streamlined payouts.

## 3) Objectives and measurable success criteria

- **Activation**: 60% of new accounts verify email within 24h.
- **Liquidity**: ≥30% of listings convert into a group buy within 7 days.
- **Payment success**: ≥95% payment verification success after redirect.
- **Fulfillment**: ≥85% of group buys complete with on-time delivery confirmation.
- **Trust**: Average review rating ≥4.2/5 with ≥20% of completed orders reviewed.
- **Ops efficiency**: <24h average admin verification for new farmers.
- **Performance**: P95 page load <2.5s on 3G; API P95 <400ms for core flows.

## 4) Personas and roles

- **Buyer**: Discovers produce, joins/creates group buys, pays, confirms receipt, reviews.
- **Farmer**: Posts listings, manages inventory, participates in group buys, receives payouts.
- **Support**: Manages checks/verification, handles disputes, can change roles, monitor alerts.
- **Admin**: Full system oversight, manages users/permissions, analytics, and config.

Role types referenced in codebase:

- `user`, `farmer`, `admin`, `support` (database docs)
- `buyer` (used in app logic for permissions). Note: a role naming inconsistency exists; see Risks.

## 5) Scope

- **In scope**
  - Authentication with Supabase Auth (email/password, Google OAuth) and email verification
  - Supabase Postgres for all app data with RLS policies
  - Supabase Storage for user, listing, and review images
  - Supabase Realtime for live group-buy progress and notifications
  - Paystack for checkout and verification
  - Admin dashboards (users, listings, verification), monitoring, analytics
  - Offline/PWA support
  - Rate limiting and CAPTCHA for auth flows
- **Out of scope (v1)**
  - Real-time courier/delivery tracking
  - Multi-currency settlements and split payouts to external bank accounts
  - Dispute resolution UI beyond basic support tools
  - In-app messaging escrow and KYC for payouts
  - Native mobile apps (web-first; mobile-friendly UI present)

## 6) Key features and functional requirements

### Authentication & Authorization

- Handled by **Supabase Auth** (email/password, Google OAuth).
- Email verification required for protected actions.
- Login/logout; password reset and forgot password flows.
- Role-based access (`buyer`/`user`, `farmer`, `support`, `admin`) with middleware checks.
- Rate limiting and CAPTCHA for registration/auth endpoints.
- Sessions managed via `@supabase/ssr`; server actions read user from Supabase auth.
- Enforce RLS on all tables; policies gate access by user role and ownership.

### User Profiles

- Store `email`, `displayName`/name, photo, bio, phone, preferences (theme/language/notifications).
- Role view in admin; support can change user role.
- Email verification status displayed and enforced where needed.

### Listings (Farmers)

- Post produce: name, description, category, price per unit, unit, quantity, images, location (lat/lng/address), harvest/expiry, organic flag.
- Status: `available`, `sold`, `expired`.
- Display on marketplace pages with search and category filters; map integration.
- Images stored in Supabase Storage buckets (`public` for listing media; restricted for PII if needed).

### Group Buys

- Create group buy for a listing: set target quantity, deadline, price per unit reflected from listing.
- Join group buy: specify quantity; initiate payment; on verification update funded quantity.
- Participant tracking with per-user contribution.
- Completion when funded quantity reaches target; then fulfillment and receipt confirmations.
- Finalization triggers commission and farmer payout records.
- Realtime updates (Supabase Realtime) push funded quantity and status to clients.

### Orders

- Created when payment initiated; states include `pending`, `paid` (after verification), `completed` (after receipt confirmation), `cancelled`.
- Tied to group buy, listing, buyer, units purchased, and `tx_ref`.

### Payments

- **Paystack** checkout integration; redirect-based flow.
- Verification on return updates order to `paid`, reduces available quantity, increments group funded quantity, and checks group completion threshold.
- After all participants confirm receipt, generate payout and commission transactions (10% platform commission in code).

### Reviews

- Post-purchase reviews with rating and comment; optional images.
- Validation to prevent spam and ensure only eligible buyers can review.
- Images stored in Supabase Storage buckets (`public` for review media; restricted for PII if needed).

### Notifications

- In-app notifications for key events: payment updates, group buy milestones, payouts, admin messages.

### Admin & Support

- Manage users and roles; suspend listings; view monitoring metrics and alerts.
- Farmer verification checklist and badge management.
- Logs/analytics: access to performance, monitoring, and audit trails.

### Monitoring & Analytics

- API endpoints for metrics, logs, alerts.
- Performance monitoring utilities in codebase.

### Offline/PWA

- Service worker registration, offline page, push messaging scaffolding.

## 7) User stories (selected)

- **Authentication**
  - As a user, I can register with email/password and receive a verification link so I can activate my account.
  - As a user, I can reset my password if I forget it.

- **Listings & Discovery**
  - As a buyer, I can browse and search produce with filters and see location information to choose nearby options.
  - As a farmer, I can post a listing with price, unit, quantity, images, and location.

- **Group Buys & Orders**
  - As a buyer, I can create a group buy for a listing and share it.
  - As a buyer, I can join a group buy, pay securely with Paystack, and see my contribution.
  - As a buyer, I can confirm receipt after delivery.
  - As a farmer, I get notified when a group buy is fully funded and when funds are released.

- **Payments**
  - As a buyer, I am redirected to a Paystack payment page and, upon success, my order becomes paid and my units are reserved.

- **Admin/Support**
  - As support, I can change a user’s role to `farmer` after verifying documents.
  - As admin, I can suspend a listing for policy violations.

- **Reviews**
  - As a buyer, I can rate and review produce after receipt.

## 8) Detailed flows

### Registration & Verification

- User submits registration with CAPTCHA → account created in Supabase Auth + user record in Supabase DB → verification email sent → user clicks verification link → emailVerified set true.

### Login

- User submits credentials → session is created with role claims → protected routes require verified email.

### Post produce (Farmer)

- Farmer fills form → validation of required fields and ranges → listing created with `available` status.

### Create group buy

- Buyer selects listing → sets quantity target and deadline → group buy document created in Supabase.

### Join group buy & pay

- Buyer inputs units → app creates order and initiates Paystack payment with redirect URL `/api/payments/verify` → on return, system verifies transaction id and `tx_ref` via Paystack API → updates order to `paid`, decrements listing availability, increments group funded quantity; if target reached, group status moves towards fulfillment.

### Receipt confirmation & payouts

- After delivery, each participant confirms receipt → when all participants confirmed, create transactions: 10% commission to AgriPool internal account, 90% payout to farmer; mark group as `completed` and notify farmer.

### Review

- After completion, buyer can submit rating/comment tied to order.

### Admin actions

- Support can set roles; admin can suspend a listing; verification checklists can be managed; monitoring endpoints observed via dashboards.

## 9) Data model (high-level entities)

- **Users**: `uid`, `email`, `displayName`, `role`, `emailVerified`, profile fields, preferences.
- **Produce (Listings)**: `farmerId`, `name`, `description`, `category`, `pricePerUnit`, `unit`, `quantity`, `images`, `location(lat,lng,address)`, `harvestDate`, `expiryDate`, `organic`, `status`.
- **GroupBuys**: `organizerId`, `listingId`, `targetQuantity`, `quantityFunded`, `deadline`, `participants{userId→units}`, `status`.
- **Orders**: `userId`, `groupId`, `listingId`, `quantity`, `amount`, `tx_ref`, `status`, timestamps.
- **Payments**: `orderId`, `amount`, `method`, `status`.
- **Transactions**: payout and commission records with `userId`, `amount`, `currency`, `description`, `groupId`.
- **Reviews**: `orderId`, `buyerId`, `farmerId`, `rating`, `comment`, optional images.
- **Notifications**: `userId`, `type`, `message`, `isRead`, link.
- Tables: `profiles`, `listings`, `group_buys`, `orders`, `payments`, `transactions`, `reviews`, `notifications`.
- RLS: enabled on all tables. Example policies:
  - `profiles`: users can `select/update` their own row; admins/support can manage all.
  - `listings`: owners can CRUD their listings; public can `select` published rows.
  - `group_buys`, `orders`: participants and owners can see related rows.
  - `reviews`: only buyers with a completed order can insert.

## 10) API summary (primary routes observed)

- `POST /api/auth/login` Login
- `POST /api/auth/register` Register (rate-limited, CAPTCHA)
- `POST /api/auth/verify-email` Verify email token
- `POST /api/auth/forgot-password` Request reset
- `POST /api/auth/password-reset` Reset password
- `GET /api/payments/verify` Payment verification (Paystack)
- `GET /api/dashboard` Buyer dashboard data
- `GET /api/profile`, `PUT /api/profile` User profile ops
- `GET /api/monitoring/alerts`, `GET /api/monitoring/metrics` Ops/monitoring
- `GET /api/logs`, `GET /api/metrics`, `GET /api/analytics/performance`
- `GET/PUT/DELETE /api/admin/users` and `GET/PUT /api/admin/users/[id]` Admin user ops

Server actions (Next.js server actions) for:

- `src/app/dashboard/actions.ts`: group buy create/join/pay
- `src/app/payments/actions.ts`: confirm receipt and finalize payouts
- `src/app/admin/actions.ts`: set user role, suspend listing, verification checklists, badge status

## 11) Non-functional requirements

- **Security**
  - Enforce email verification for protected actions.
  - Role-based access guards on server actions and API routes.
  - Rate limiting for auth endpoints; CAPTCHA on registration.
  - Protect secrets: Paystack keys, Supabase credentials, base URL.
  - Audit logging of critical auth events.
  - Supabase RLS enforced; policies reviewed per table and per role.
  - Service role key used only server-side (never shipped to client).

- **Performance**
  - P95 API <400ms, P95 page load <2.5s on mid-tier mobile; caching where safe.
  - Progressive image loading and lazy loading on landing pages.

- **Reliability**
  - Idempotent payment verification; transactionally update group/order states.
  - Health endpoints for DB and services.

- **Privacy & Compliance**
  - Store minimum PII; allow profile edits and deletion requests.
  - Follow payment provider compliance (Paystack) and data protection best practices.

- **Accessibility**
  - WCAG AA targeting; semantic components and focus management.

- **Localization**
  - Baseline English with types allowing locale expansion (`en`, `fr`, `es`, `ar`).

## 12) Dependencies and integrations

- **Paystack**: payments initiation and verification.
- **Supabase**: Auth, Postgres (RLS), Storage, Realtime; optional Edge Functions for webhooks.
- **Maps**: map display for listing locations.
- **PWA/Service Worker**: offline page and push-ready.

Key environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server-only)
- SUPABASE_JWT_SECRET (if custom JWT or edge functions)
- PAYSTACK_SECRET_KEY
- NEXT_PUBLIC_BASE_URL
- CAPTCHA keys (if enabled)

## 12.1) Supabase implementation notes
- Storage buckets:
  - `listing-images` (public, cached via Next Image or `src/components/optimized-image.tsx`)
  - `review-images` (public), `private-docs` (restricted, if needed)
- Realtime:
  - Channels on `group_buys` and `orders` broadcast funded quantity, status, and receipt confirmations.
- SSR/Server actions:
  - Use `src/lib/supabaseClient.ts` (client) and `src/lib/supabaseAdmin.ts` (service role) where appropriate.

## 13) Release plan (phased)

- **MVP**
  - Auth (email/password, verify), basic profiles
  - Listings and discovery
  - Group buy creation/join; Paystack payment and verification
  - Order management; receipt confirmation; payout/commission records
  - Admin: user role change, suspend listing
  - Notifications and offline page
- **V1**
  - Reviews, farmer verification checklists, monitoring dashboards
  - Performance metrics and analytics surfaces
- **V1.x enhancements**
  - Real payouts to bank accounts, dispute tooling, advanced search, mobile polish

## 14) Acceptance criteria (samples)

- **Join group buy + pay**
  - Given a buyer with a verified email and available listing, when they join for N units:
    - Then payment link is generated via Paystack; user is redirected.
    - On successful return, the system verifies `transaction_id` and `tx_ref`.
    - Order status becomes `paid`; listing quantity is decremented by N; group funded increases by N.
    - If funded ≥ target, group status advances to fulfillment and participants are notified.

- **Receipt confirmation**
  - Given group is delivered and buyer confirms:
    - Then their order becomes `completed`.
    - When all participants are `completed`, group status becomes `completed`.
    - Payout and commission transaction records are created.

- **Role change (support)**
  - Given support user, when they change a user’s role to `farmer`:
    - Then Supabase role claims updated and DB user role updated.
    - Changes are reflected in admin UI after revalidation.

## 15) Risks and mitigations

- **Role naming inconsistency (`user` vs `buyer`)**
  - Mitigation: Align on canonical role names across DB, auth claims, and UI; add migration and normalization.

- **Supabase free tier limits and realtime quotas**
  - Mitigation: index queries; throttle realtime subscriptions; upgrade plan as usage grows.

- **Payment reconciliation edge cases**
  - Mitigation: Idempotent verification and retry logic; periodic reconciliation job using Paystack APIs.

- **Payouts not actually disbursed**
  - Mitigation: Integrate real settlement provider or bank transfer in future milestone; clearly label as ledger records in v1.

- **Compliance and PII**
  - Mitigation: Audit data stored, limit sensitive fields, add privacy policy and data export/delete.

## 16) Open questions

- Should the canonical role taxonomy be `buyer/farmer/admin/support` everywhere?
- Should payouts integrate Paystack Transfers in v1.x or remain ledger-only?
- What delivery/logistics integrations are planned (if any) for v1?
- Should reviews include media and moderation workflows at launch?

## 17) Analytics & metrics instrumentation

- Funnel: signup → verification → first group buy join → payment success → receipt confirmation → review.
- Transaction metrics: initiation vs success rate, average order size, time to funding.
- Supply metrics: listing creation rate, active listings, expiry rate.
- Ops metrics: verification SLA, support actions volume.
- System metrics: API error rate, latency, service health endpoints.

## 18) Non-goals (explicit)

- Marketplace escrow and legal custody of funds (beyond provider’s flow).
- Full logistics orchestration or route optimization.
- Multi-tenant white-label support in v1.

## 19) Appendices (repo references)

- Database overview: `docs/database.md`
- Auth services and middleware: `src/lib/auth/*`, `src/lib/middleware/*`
- Payments: `src/lib/paystack-client.ts`, `src/app/api/payments/verify/route.ts`
- Group buy and order actions: `src/app/dashboard/actions.ts`, `src/app/payments/actions.ts`
- Admin actions: `src/app/admin/actions.ts`
- Offline/PWA: `src/lib/service-worker.js`, `public/sw.js`, `src/app/offline/page.tsx`
- Monitoring: `src/app/api/monitoring/*`, `src/app/api/metrics/route.ts`
