/*
# Create data_ledger table (no-auth public app pattern)

1. New Tables
- `data_ledger`
  - `id` (uuid, primary key)
  - `session_id` (text, groups entries within a session)
  - `action` (text, what happened)
  - `details` (text, human-readable description)
  - `scheme_id` (text, optional scheme reference)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `data_ledger`.
- Allow anon + authenticated CRUD (no-auth public app pattern).
*/

CREATE TABLE IF NOT EXISTS data_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  action text NOT NULL,
  details text,
  scheme_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ledger_session ON data_ledger (session_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created ON data_ledger (created_at DESC);

ALTER TABLE data_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ledger" ON data_ledger;
CREATE POLICY "anon_select_ledger" ON data_ledger FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ledger" ON data_ledger;
CREATE POLICY "anon_insert_ledger" ON data_ledger FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ledger" ON data_ledger;
CREATE POLICY "anon_update_ledger" ON data_ledger FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ledger" ON data_ledger;
CREATE POLICY "anon_delete_ledger" ON data_ledger FOR DELETE
  TO anon, authenticated USING (true);
