-- ==============================================================================
-- AMRITA VISHWA VIDYAPEETHAM — AMARAVATI CAMPUS
-- PARIणाम 2026: THE TECHNO-CULTURAL FESTIVAL MANAGEMENT PLATFORM
-- Production PostgreSQL Database Schema & Supabase Row Level Security (RLS)
-- Migration: 20261011_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension & Crypto extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ROLES & PERMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
    ('super_admin', 'Super Administrator', 'Unrestricted administrative access to entire festival platform'),
    ('club_admin', 'Club Administrator', 'Scoped access to assigned club, its events, and attendee verification'),
    ('stall_admin', 'Stall Administrator', 'Scoped access to assigned market stall, menu, inventory, and order fulfillment'),
    ('scanner_operator', 'Gate / Turnstile Operator', 'Turnstile operator authorized to verify credentials and redeem entry QR tokens'),
    ('student', 'Amrita Student', 'Verified Amrita Amaravati student with pre-paid institutional festival access'),
    ('visitor', 'External Visitor', 'External college attendee with paid entry pass and optional accommodation')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- References auth.users(id) in Supabase
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(32) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- ------------------------------------------------------------------------------
-- 3. STUDENTS (Institutional Rule 1: Already paid ₹750, never charge again)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(64) UNIQUE NOT NULL, -- e.g., AM.EN.U4AIE23042
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(128) NOT NULL,
    year_of_study INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    campus VARCHAR(128) NOT NULL DEFAULT 'Amrita Amaravati',
    institutional_fee_paid BOOLEAN NOT NULL DEFAULT TRUE,
    institutional_fee_amount NUMERIC(10,2) NOT NULL DEFAULT 750.00,
    payment_reference VARCHAR(128) DEFAULT 'INSTITUTIONAL_ENROLLMENT_2026',
    qr_token TEXT UNIQUE NOT NULL, -- Cryptographic opaque token (no PII inside)
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_qr_token ON students(qr_token);

-- ------------------------------------------------------------------------------
-- 4. ACCOMMODATIONS (For external visitors)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodations (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    room_type VARCHAR(64) NOT NULL, -- 'dormitory', 'deluxe_twin', 'executive'
    total_capacity INTEGER NOT NULL CHECK (total_capacity >= 0),
    allocated_count INTEGER NOT NULL DEFAULT 0 CHECK (allocated_count <= total_capacity),
    price_per_night NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    amenities TEXT[],
    rules TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. VISITORS (External attendees)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    college VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    pass_tier VARCHAR(64) NOT NULL DEFAULT 'standard_fest_pass',
    accommodation_id VARCHAR(64) REFERENCES accommodations(id),
    accommodation_nights INTEGER DEFAULT 0,
    total_amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    payment_reference VARCHAR(128),
    qr_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_qr_token ON visitors(qr_token);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON visitors(email);

-- ------------------------------------------------------------------------------
-- 6. CLUBS & CLUB ADMINS (Rule 5: Scoped to assigned club only)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'club-acm', 'club-raaga'
    code VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Technical', 'Cultural', 'Media', etc.
    lead_coordinator VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    venue_hub VARCHAR(255),
    logo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id VARCHAR(64) NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_club_admins_user ON club_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_club_admins_club ON club_admins(club_id);

-- ------------------------------------------------------------------------------
-- 7. EVENTS & CLUB EVENTS (Mega Events & Club Competitions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'fest-garba', 'fest-railu', 'fest-auto', 'fest-dj'
    club_id VARCHAR(64) REFERENCES clubs(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,
    date_str VARCHAR(64) NOT NULL, -- '11 OCTOBER 2026' or '12 OCTOBER 2026'
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rules TEXT,
    eligibility TEXT,
    capacity INTEGER NOT NULL DEFAULT 3500,
    registered_count INTEGER NOT NULL DEFAULT 0,
    entry_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_mega_event BOOLEAN DEFAULT FALSE,
    external_url TEXT, -- Configurable handoff (e.g. for RAILU Hackathon)
    banner_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_str);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON events(club_id);

-- ------------------------------------------------------------------------------
-- 8. QR TOKENS & CRYPTOGRAPHIC VERIFICATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL, -- Opaque SHA-256 / HMAC derived random token
    holder_type VARCHAR(32) NOT NULL CHECK (holder_type IN ('STUDENT', 'VISITOR', 'VIP', 'CREW')),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 days')
);

CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON qr_tokens(token);

-- ------------------------------------------------------------------------------
-- 9. REGISTRATIONS & EVENT REGISTRATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_type VARCHAR(32) NOT NULL DEFAULT 'INDIVIDUAL', -- 'INDIVIDUAL' or 'TEAM'
    team_name VARCHAR(255),
    team_members JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- 'PENDING', 'CONFIRMED', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);

-- ------------------------------------------------------------------------------
-- 10. EVENT ATTENDANCE & ATOMIC REDEMPTION (Rules 2, 3, 4)
-- Enforces: QR is reusable across DIFFERENT events, but can only be redeemed ONCE per event.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(64) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    qr_token TEXT NOT NULL,
    attendee_name VARCHAR(255) NOT NULL,
    attendee_type VARCHAR(32) NOT NULL, -- 'STUDENT' or 'VISITOR'
    scanned_by VARCHAR(255) NOT NULL,
    turnstile_location VARCHAR(128) NOT NULL DEFAULT 'MAIN_GATE_ALPHA',
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- CRITICAL DATABASE-LEVEL ATOMIC CONSTRAINT
    CONSTRAINT uq_event_token UNIQUE (event_id, qr_token)
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_token ON event_attendance(qr_token);

CREATE TABLE IF NOT EXISTS scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_token TEXT NOT NULL,
    event_id VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL, -- 'APPROVED', 'ALREADY_REDEEMED', 'INVALID_TOKEN', 'UNAUTHORIZED'
    message TEXT NOT NULL,
    scanner_operator VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_logs_timestamp ON scan_logs(timestamp DESC);

-- ------------------------------------------------------------------------------
-- 11. FEST MARKET: STALLS, PRODUCTS, ORDERS & REDEMPTIONS (Rules 6, 36)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stalls (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Food & Beverages', 'Official Merchandise', 'Gaming & Tech'
    location VARCHAR(128) NOT NULL,
    lead_vendor VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stall_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stall_id VARCHAR(64) NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, stall_id)
);

CREATE INDEX IF NOT EXISTS idx_stall_admins_user ON stall_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_stall_admins_stall ON stall_admins(stall_id);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    stall_id VARCHAR(64) NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_stall ON products(stall_id);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY, -- e.g., 'ORD-2026-9042'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    stall_id VARCHAR(64) NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    order_status VARCHAR(32) NOT NULL DEFAULT 'PREPARING', -- 'PREPARING', 'READY_FOR_PICKUP', 'REDEEMED', 'CANCELLED'
    pickup_qr_token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_stall ON orders(stall_id);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_qr ON orders(pickup_qr_token);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(64) UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    redeemed_by VARCHAR(255) NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. PAYMENTS & IDEMPOTENCY LEDGER (Rules 8, 9, 38, 39)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference VARCHAR(128) NOT NULL,
    gateway VARCHAR(32) NOT NULL, -- 'RAZORPAY', 'CASHFREE', 'PHONEPE'
    gateway_order_id VARCHAR(128) UNIQUE NOT NULL,
    gateway_payment_id VARCHAR(128) UNIQUE,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'
    webhook_payload JSONB,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payments(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON payments(gateway_payment_id);

-- ------------------------------------------------------------------------------
-- 13. AUDIT LOGGING & SYSTEM SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(128) NOT NULL,
    ip_address INET,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO system_settings (key, value, description) VALUES
    ('festival_meta', '{
        "name": "PARIणाम 2026",
        "tagline": "The Techno-Cultural Fest",
        "campus": "Amrita Vishwa Vidyapeetham, Amaravati",
        "dates": "11 — 12 October 2026",
        "expected_attendees": 3500,
        "student_fee_prepaid": 750
    }'::jsonb, 'Global festival metadata and dates'),
    ('railu_hackathon', '{
        "title": "RAILU 24H National Hackathon",
        "external_portal_url": "https://railuhackathon.am.amrita.edu",
        "mode": "HYBRID",
        "cash_prize_pool": "₹1,50,000"
    }'::jsonb, 'External portal configuration for RAILU Hackathon'),
    ('payment_gateways', '{
        "primary": "RAZORPAY",
        "sandbox_mode": false,
        "currency": "INR"
    }'::jsonb, 'Payment gateway configuration and keys')
ON CONFLICT (key) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 14. ATOMIC QR REDEMPTION STORED PROCEDURE (Rules 3, 4, 43)
-- Guarantees atomic verification, zero race conditions, and single redemption per event.
-- ------------------------------------------------------------------------------
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
DECLARE
    v_student RECORD;
    v_visitor RECORD;
    v_event RECORD;
    v_attendee_name VARCHAR(255);
    v_attendee_type VARCHAR(32);
    v_existing_attendance RECORD;
BEGIN
    -- 1. Check if event exists and is active
    SELECT * INTO v_event FROM events WHERE id = p_event_id AND is_active = TRUE;
    IF NOT FOUND THEN
        INSERT INTO scan_logs (qr_token, event_id, status, message, scanner_operator)
        VALUES (p_qr_token, p_event_id, 'INVALID_EVENT', 'Specified event not found or inactive', p_scanned_by);

        RETURN jsonb_build_object(
            'success', false,
            'code', 'INVALID_EVENT',
            'message', 'Event does not exist or has concluded'
        );
    END IF;

    -- 2. Check if already redeemed for THIS specific event (Single redemption per event rule)
    SELECT * INTO v_existing_attendance FROM event_attendance 
    WHERE event_id = p_event_id AND qr_token = p_qr_token;
    
    IF FOUND THEN
        INSERT INTO scan_logs (qr_token, event_id, status, message, scanner_operator)
        VALUES (p_qr_token, p_event_id, 'ALREADY_REDEEMED', 
                format('Duplicate entry attempt at %s (First entered at %s)', 
                       v_existing_attendance.turnstile_location, v_existing_attendance.scanned_at),
                p_scanned_by);

        RETURN jsonb_build_object(
            'success', false,
            'code', 'ALREADY_REDEEMED',
            'message', 'Credential already redeemed for this event',
            'first_scanned_at', v_existing_attendance.scanned_at,
            'first_scanned_location', v_existing_attendance.turnstile_location
        );
    END IF;

    -- 3. Resolve Credential (Student or Visitor)
    SELECT * INTO v_student FROM students WHERE qr_token = p_qr_token AND is_verified = TRUE;
    IF FOUND THEN
        v_attendee_name := v_student.full_name;
        v_attendee_type := 'AMRITA_STUDENT';
    ELSE
        SELECT * INTO v_visitor FROM visitors WHERE qr_token = p_qr_token AND payment_status = 'COMPLETED';
        IF FOUND THEN
            v_attendee_name := v_visitor.full_name;
            v_attendee_type := 'EXTERNAL_VISITOR';
        ELSE
            INSERT INTO scan_logs (qr_token, event_id, status, message, scanner_operator)
            VALUES (p_qr_token, p_event_id, 'INVALID_TOKEN', 'Unrecognized or unpaid QR token presented', p_scanned_by);

            RETURN jsonb_build_object(
                'success', false,
                'code', 'INVALID_TOKEN',
                'message', 'Invalid or unverified festival pass token'
            );
        END IF;
    END IF;

    -- 4. Atomic Insertion (Protected by UNIQUE (event_id, qr_token))
    BEGIN
        INSERT INTO event_attendance (
            event_id, qr_token, attendee_name, attendee_type, scanned_by, turnstile_location
        ) VALUES (
            p_event_id, p_qr_token, v_attendee_name, v_attendee_type, p_scanned_by, p_location
        );

        -- Increment event registration count safely
        UPDATE events SET registered_count = registered_count + 1 WHERE id = p_event_id;

        -- Record successful scan log
        INSERT INTO scan_logs (qr_token, event_id, status, message, scanner_operator)
        VALUES (p_qr_token, p_event_id, 'APPROVED', format('Granted entry for %s (%s)', v_attendee_name, v_attendee_type), p_scanned_by);

        RETURN jsonb_build_object(
            'success', true,
            'code', 'APPROVED',
            'message', 'ACCESS APPROVED',
            'attendee_name', v_attendee_name,
            'attendee_type', v_attendee_type,
            'event_title', v_event.title,
            'timestamp', NOW()
        );

    EXCEPTION WHEN unique_violation THEN
        -- Race condition caught at database constraint level
        INSERT INTO scan_logs (qr_token, event_id, status, message, scanner_operator)
        VALUES (p_qr_token, p_event_id, 'CONCURRENCY_BLOCKED', 'Atomic duplicate collision prevented', p_scanned_by);

        RETURN jsonb_build_object(
            'success', false,
            'code', 'ALREADY_REDEEMED',
            'message', 'Concurrent scan blocked: Credential was already redeemed'
        );
    END;
END;
$$;

-- ------------------------------------------------------------------------------
-- 15. ROW LEVEL SECURITY (RLS) POLICIES (Rules 5, 6, 7, 40)
-- ------------------------------------------------------------------------------
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE stall_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN users u ON ur.user_id = u.id
        WHERE u.auth_id = auth.uid() AND ur.role_id = 'super_admin'
    );
$$;

CREATE OR REPLACE FUNCTION get_user_club_id()
RETURNS VARCHAR(64)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT ca.club_id FROM club_admins ca
    JOIN users u ON ca.user_id = u.id
    WHERE u.auth_id = auth.uid()
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_user_stall_id()
RETURNS VARCHAR(64)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT sa.stall_id FROM stall_admins sa
    JOIN users u ON sa.user_id = u.id
    WHERE u.auth_id = auth.uid()
    LIMIT 1;
$$;

-- RLS POLICIES:
-- 1. Public Read for Events & Clubs & Products & Stalls
CREATE POLICY "Public can view active events" ON events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active clubs" ON clubs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active stalls" ON stalls FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view available products" ON products FOR SELECT USING (is_available = TRUE);

-- 2. Students can view only their own record
CREATE POLICY "Student reads own profile" ON students FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR is_super_admin());

-- 3. Club Admins can manage only their assigned club events & view attendance
CREATE POLICY "Club Admin manages own events" ON events FOR ALL
    USING (club_id = get_user_club_id() OR is_super_admin())
    WITH CHECK (club_id = get_user_club_id() OR is_super_admin());

CREATE POLICY "Club Admin views own event attendance" ON event_attendance FOR SELECT
    USING (event_id IN (SELECT id FROM events WHERE club_id = get_user_club_id()) OR is_super_admin());

-- 4. Stall Admins can manage only their assigned stall products & orders
CREATE POLICY "Stall Admin manages own products" ON products FOR ALL
    USING (stall_id = get_user_stall_id() OR is_super_admin())
    WITH CHECK (stall_id = get_user_stall_id() OR is_super_admin());

CREATE POLICY "Stall Admin views and fulfills own orders" ON orders FOR ALL
    USING (stall_id = get_user_stall_id() OR is_super_admin())
    WITH CHECK (stall_id = get_user_stall_id() OR is_super_admin());

-- 5. Super Admin has unrestricted bypass across all entities
CREATE POLICY "Super admin full access users" ON users FOR ALL USING (is_super_admin());
CREATE POLICY "Super admin full access payments" ON payments FOR ALL USING (is_super_admin());
CREATE POLICY "Super admin full access audit_logs" ON audit_logs FOR ALL USING (is_super_admin());
CREATE POLICY "Super admin full access attendance" ON event_attendance FOR ALL USING (is_super_admin());
