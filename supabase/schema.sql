-- Figuri Database Schema
-- Run in Supabase SQL Editor (EU West region)
-- Enable RLS on all user-facing tables

-- ============================================================
-- ACCOUNTANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS accountants (
  id                          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       text NOT NULL,
  business_name               text NOT NULL DEFAULT '',
  logo_url                    text,
  reply_to_email              text,
  default_booking_link_url    text,
  stripe_customer_id          text UNIQUE,
  stripe_subscription_id      text,
  stripe_subscription_status  text CHECK (stripe_subscription_status IN ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid')),
  trial_ends_at               timestamptz,
  currency                    text NOT NULL DEFAULT 'GBP',
  created_at                  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE accountants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accountants: own row only" ON accountants
  FOR ALL USING (auth.uid() = id);

-- Service role can write (used by webhooks + API routes)
CREATE POLICY "accountants: service role write" ON accountants
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accountant_id    uuid NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  name             text NOT NULL,
  email            text NOT NULL,
  business_type    text NOT NULL,
  context_notes    text,
  language         text NOT NULL DEFAULT 'en',
  booking_link_url text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients: accountant access only" ON clients
  FOR ALL USING (auth.uid() = accountant_id);

CREATE POLICY "clients: service role write" ON clients
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- MONTHLY FIGURES
-- ============================================================
CREATE TABLE IF NOT EXISTS monthly_figures (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  accountant_id       uuid NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  period_month        text NOT NULL,           -- e.g. '2026-03'
  revenue             numeric NOT NULL,
  cost_of_goods       numeric,                  -- nullable for service businesses
  gross_margin_pct    numeric,                  -- nullable
  operating_expenses  numeric NOT NULL,
  net_profit          numeric NOT NULL,
  cash_position       numeric NOT NULL,
  one_off_items       text,
  context_note        text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, period_month)
);

ALTER TABLE monthly_figures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "monthly_figures: accountant access only" ON monthly_figures
  FOR ALL USING (auth.uid() = accountant_id);

CREATE POLICY "monthly_figures: service role write" ON monthly_figures
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- NARRATIVES
-- ============================================================
CREATE TABLE IF NOT EXISTS narratives (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  figures_id              uuid NOT NULL REFERENCES monthly_figures(id) ON DELETE CASCADE,
  client_id               uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  accountant_id           uuid NOT NULL REFERENCES accountants(id) ON DELETE CASCADE,
  language                text NOT NULL DEFAULT 'en',
  body_text               text NOT NULL,
  status                  text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent')),
  generated_at            timestamptz NOT NULL DEFAULT now(),
  sent_at                 timestamptz,
  booking_link_included   boolean NOT NULL DEFAULT false,
  UNIQUE (figures_id)     -- One narrative per set of figures
);

ALTER TABLE narratives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "narratives: accountant access only" ON narratives
  FOR ALL USING (auth.uid() = accountant_id);

CREATE POLICY "narratives: service role write" ON narratives
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- INDEXES (performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clients_accountant ON clients(accountant_id);
CREATE INDEX IF NOT EXISTS idx_monthly_figures_client ON monthly_figures(client_id, period_month DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_figures_accountant ON monthly_figures(accountant_id);
CREATE INDEX IF NOT EXISTS idx_narratives_client ON narratives(client_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_narratives_accountant ON narratives(accountant_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_narratives_figures ON narratives(figures_id);

-- ============================================================
-- STORAGE BUCKET (for logos)
-- ============================================================
-- Run in Supabase Storage tab:
-- Create bucket: "logos" (public: false)
-- Policy: allow authenticated users to upload to their own folder
