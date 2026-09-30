# PARIणाम 2026 — Amrita Amaravati Fest Platform
### The Techno-Cultural Fest | Amrita Vishwa Vidyapeetham, Amaravati Campus
**Dates:** 11 October 2026 — 12 October 2026  
**Audience:** ~3,500 Concurrent Students & External Visitors  
**Design Reference:** [Thomso (IIT Roorkee)](https://www.thomso.in/about) & [Saarang (IIT Madras)](https://saarang.org)

---

## 🌟 Executive Overview & Brand Identity

**PARIणाम 2026** is the flagship annual techno-cultural festival of Amrita Vishwa Vidyapeetham, Amaravati Campus. This repository contains the complete, production-oriented digital festival experience and management platform. 

The frontend abandons generic corporate SaaS cards and templates in favor of an **art-directed, editorial festival experience** featuring:
- Midnight stardust voids (`#05030F`) and celestial royal blues (`#1D4ED8`) & deep violets (`#7C3AED`)
- Imperial warm gold leaf typography and borders (`#DDBB63`, `#F6EFE0`)
- Display serif typography (`Cormorant Garamond`, `Cinzel`) paired with technical modern grotesque sans-serifs (`Plus Jakarta Sans`, `Inter`, `Outfit`)
- Official festival branding emblem integrated across the hero and navigation (`public/images/parinam-logo.jpg`)
- Thomso-inspired spatial radar campus map with 8 interactive landmark pins
- Editorial festival storytelling (*"THIS IS OUR FEST."*) with an interactive 6-part statistical matrix

---

## ⚖️ The 15 Non-Negotiable Business Rules

| # | Rule | Implementation Mechanism |
|---|------|--------------------------|
| **1** | **Students already paid ₹750** | Enforced at database level (`institutional_fee_paid = TRUE`). Students authenticate with university ID and are **never** charged the base fest fee again. |
| **2** | **Student QR is reusable across different events** | QR token remains valid throughout the 2-day festival across Garba, Auto Expo, DJ Night, and Club Competitions. |
| **3** | **Single redemption per event** | Once scanned at an event, that specific pass cannot be reused for entry to the same event. |
| **4** | **Atomic duplicate rejection** | Backed by PostgreSQL `UNIQUE (event_id, qr_token)` constraint and atomic PL/pgSQL stored procedure. Concurrent duplicate attempts fail with `ALREADY_REDEEMED`. |
| **5** | **Club Admin isolation** | Row-Level Security (RLS) ensures Club Admins can query and mutate only their assigned club's events and registrations. |
| **6** | **Stall Admin isolation** | Stall Admins can manage only their assigned market stall, menu, inventory, and order fulfillment. |
| **7** | **Super Admin full authorized access** | Authorized platform-wide telemetry, user registries, financial reconciliations, and audit log inspection. |
| **8** | **Server-side payment verification** | Frontend payment claims are never trusted; payments are verified cryptographically via HMAC SHA-256 signatures. |
| **9** | **Idempotent payment webhooks** | Webhook deduplication ledger ensures duplicate gateway webhooks are safely ignored (`Webhook 1 -> Process, Webhook 2/3 -> Ignore`). |
| **10** | **Opaque QR tokens (Zero PII)** | QR tokens contain exclusively cryptographic opaque hashes (no student email, phone, roll number, or plaintext data). |
| **11** | **Database is the single source of truth** | All state changes commit to PostgreSQL / Supabase with foreign keys, timestamps, and relational integrity. |
| **12** | **Critical actions are logged** | Every scan, payment confirmation, order fulfillment, and role mutation writes to `audit_logs`. |
| **13** | **Protected GitHub main branch** | Enforced PR reviews, branch protection, and automated CI pipelines. |
| **14** | **No fake production security** | Real RLS policies, crypto signatures, atomic transactions, and input validation. |
| **15** | **No invented campus coordinates** | Schematic spatial radar positions ready for real GPS coordinates via database settings. |

---

## 🏛️ Platform Architecture & Modules

### 1. Public Digital Festival Experience
- **Cinematic Hero:** Features official PARIणाम 2026 branding crest, live artistic countdown timer to 11 October 2026, and instant access modals.
- **Editorial Festival Storytelling:** Inspired by Thomso `/about`, celebrating music, technology, art, and campus heritage.
- **Mega Events Showcase:**
  - **Garba & Dandiya Night** (11 Oct, 7:00 PM, Main Ground)
  - **RAILU 24H National Hackathon** (11 Oct, Tech Arena — with configurable database URL handoff to `https://railuhackathon.am.amrita.edu`)
  - **Amrita Grand Auto Expo** (12 Oct, 10:00 AM, Central Boulevard — 60+ supercars and super-bikes)
  - **Star Pronite — DJ Night** (12 Oct, 7:30 PM, Open Air Amphitheatre — headline EDM & visual spectacle)
- **Interactive Campus Radar Map:** Inspired by Thomso `/map`, featuring 8 landmark pins, category filtering (Mega, Arenas, Food, Gate), and deep drawer inspections.
- **13 Student Clubs:** Editorial catalog with large numerals (`01`–`13`), coordinators, and dedicated modal registration.
- **Fest Market:** Food court and merchandise stalls with shopping cart, mock checkout, and express pickup QR token generation.

### 2. High-Assurance Portals
- **Student Fest Pass Portal:**
  - Displays authenticated student credentials, department, roll number, and pre-paid ₹750 status.
  - Generates high-resolution vector QR code containing opaque token.
  - Multi-event atomic redemption checklist showing real-time entry status for all festival stages.
- **Turnstile Optical QR Scanner:**
  - Gate operator portal supporting device camera and direct token lookup.
  - Real-time audit logs with instant color-coded visual and sound feedback (`APPROVED`, `ALREADY_REDEEMED`, `INVALID_TOKEN`).
  - Integrated 6-scenario automated test runner to demonstrate atomic duplicate prevention live.
- **Visitor Portal:**
  - External student registration with tier selection (Day 1, Day 2, Full Pass).
  - On-campus hostel accommodation booking with capacity counter.
- **Super Admin Operations Center:**
  - Platform KPIs (total registrations, check-in velocity, revenue breakdown).
  - Searchable student directory, visitor list, stall orders, and turnstile scan logs.
  - One-click CSV export for offline security and institutional reporting.
  - Burst stress test simulator (50/100 rapid concurrent scans).
- **Club Admin & Stall Admin Portals:**
  - Strict tenant isolation enforced by user role and resource ID.

---

## 🗄️ Database Architecture (PostgreSQL / Supabase)

The complete production schema is defined in `supabase/migrations/20261011_initial_schema.sql` covering 19 relational entities:

1. `roles` & `user_roles` — RBAC permission mapping
2. `users` — Base user identity linked to Supabase `auth.users`
3. `students` — Amrita students with `institutional_fee_paid` flag and opaque `qr_token`
4. `accommodations` — Campus guest rooms with capacity limits
5. `visitors` — External attendees with tier passes and payment references
6. `clubs` & `club_admins` — 13 student clubs and scoped admin access
7. `events` — Major attractions and club competitions
8. `qr_tokens` — Cryptographic opaque pass tokens with expiration
9. `registrations` — Event enrollments (individual and team)
10. `event_attendance` — Atomic redemption ledger with `UNIQUE (event_id, qr_token)`
11. `scan_logs` — Turnstile telemetry and gate security auditing
12. `stalls` & `stall_admins` — Fest market food vendors and merchandise
13. `products` — Stall inventory and prices
14. `orders` & `order_items` — Counter orders with pickup QR tokens
15. `order_redemptions` — Counter fulfillment logs
16. `payments` — Transaction ledger with HMAC signatures and idempotency keys
17. `audit_logs` — Platform-wide immutable audit trail
18. `system_settings` — Global configurable parameters (dates, RAILU URL, gateway settings)

### Atomic QR Redemption Procedure
```sql
CREATE OR REPLACE FUNCTION atomic_redeem_event_qr(
    p_qr_token TEXT,
    p_event_id VARCHAR(64),
    p_scanned_by VARCHAR(255),
    p_location VARCHAR(128) DEFAULT 'MAIN_GATE_ALPHA'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
...
BEGIN
    INSERT INTO event_attendance (event_id, qr_token, attendee_name, attendee_type, scanned_by, turnstile_location)
    VALUES (p_event_id, p_qr_token, v_attendee_name, v_attendee_type, p_scanned_by, p_location);
    RETURN jsonb_build_object('success', true, 'code', 'APPROVED');
EXCEPTION WHEN unique_violation THEN
    RETURN jsonb_build_object('success', false, 'code', 'ALREADY_REDEEMED');
END;
$$;
```

---

## 💳 Payment Gateway & Webhook Verification

Located at `supabase/functions/payment-webhook/index.ts`:
- **Cryptographic Signature Verification:** Verifies incoming `X-Razorpay-Signature` against raw body payload using HMAC SHA-256.
- **Idempotency Guarantee:** Stores idempotency key `WH_{payment_id}_{event}` in `payments` table. Repeated webhooks return `200 OK` with `status: ALREADY_PROCESSED` without double-crediting.
- **Entitlement Activation:** Automatically marks visitor pass `COMPLETED` or stall order `PREPARING` within an atomic transaction.

---

## 🛠️ GitHub Architecture & CI/CD Pipeline

### Organization Branching Model
- `main` — Production-ready code (Protected: direct pushes blocked, requires PR, review, and passing CI).
- `develop` — Staging integration branch.
- Feature branches:
  - `feature/frontend` — Visual, editorial, and animation system
  - `feature/student` — Digital pass and institutional verification
  - `feature/qr` — Turnstile scanner and atomic redemption engine
  - `feature/clubs` — 13 clubs and scoped club admin portals
  - `feature/stalls` — Food court marketplace and order fulfillment
  - `feature/payments` — Gateway integration and webhook verifier
  - `feature/admin` — Super admin operations and telemetry

### GitHub Actions CI (`.github/workflows/ci.yml`)
1. **Linting:** Runs `oxlint` across all files.
2. **Type Checking:** Runs `tsc -b` for strict TypeScript verification.
3. **Automated Testing:** Runs `node scripts/test_runner.cjs` (25 automated security, business rule, and concurrency tests).
4. **Production Build:** Compiles optimized release bundle via `vite build`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
# Server accessible at http://localhost:5174/ or http://localhost:5173/

# 3. Run platform security, concurrency & business rule test suite
node scripts/test_runner.cjs

# 4. Run fast linter
npm run lint

# 5. Build production bundle
npm run build
```

---

## 🏆 Demo Credentials (Built-in Testing Switcher)

Use the top-right **"SWITCH ROLE"** dropdown to test all perspectives:

- **Amrita Student:** Arjun S. Nair (`AM.EN.U4AIE23042`) — Digital Fest Pass with pre-paid ₹750 badge and reusable QR.
- **Gate Scanner:** Turnstile Operator at Main Gate Alpha — Live optical scanner and 6-scenario verification suite.
- **Club Admin (ACM):** Scoped access to ACM Student Chapter and competitive programming events.
- **Stall Admin (Dosa Hub):** Scoped access to South Indian Express live order queue and fulfillment scanner.
- **Super Admin:** Executive dashboard, real-time telemetry, burst load simulator, and CSV export.
- **External Visitor:** Visitor pass registration with hostel accommodation selection.

---
*PARIणाम 2026 — Amrita Vishwa Vidyapeetham, Amaravati Campus. Engineered for scale, security, and festival excellence.*
