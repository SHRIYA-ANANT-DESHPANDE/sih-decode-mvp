/*
# Create citizen_interaction_audit table (single-tenant, no auth)

1. New Tables
- `citizen_interaction_audit`
  - `id` (uuid, primary key)
  - `session_id` (text, groups messages within a single conversation session)
  - `language` (text, language code used by the citizen, e.g. 'en', 'hi', 'mr')
  - `user_query` (text, what the citizen asked / said)
  - `extracted_profile` (jsonb, structured profile inferred from the conversation)
  - `recommended_scheme_ids` (text[], scheme IDs returned as recommendations)
  - `follow_up_qa` (jsonb, array of follow-up question/answer pairs)
  - `feedback` (text, optional citizen feedback on the interaction)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `citizen_interaction_audit`.
- Allow anon + authenticated CRUD because this is a no-sign-in public-service app;
  the audit log is intentionally writable by any citizen session and readable for
  transparency. USING (true) is correct here per the single-tenant no-auth pattern.

3. Notes
- No user_id / auth.users reference — the app has no sign-in screen.
- session_id is a client-generated UUID grouping one conversation.
- This table supports the PRD requirement: "Every citizen interaction must be logged
  with a timestamp, language, query, and response for audit and improvement."
*/

CREATE TABLE IF NOT EXISTS citizen_interaction_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  user_query text,
  extracted_profile jsonb,
  recommended_scheme_ids text[] DEFAULT '{}',
  follow_up_qa jsonb DEFAULT '[]'::jsonb,
  feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_session ON citizen_interaction_audit (session_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON citizen_interaction_audit (created_at DESC);

ALTER TABLE citizen_interaction_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_audit" ON citizen_interaction_audit;
CREATE POLICY "anon_select_audit" ON citizen_interaction_audit FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_audit" ON citizen_interaction_audit;
CREATE POLICY "anon_insert_audit" ON citizen_interaction_audit FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_audit" ON citizen_interaction_audit;
CREATE POLICY "anon_update_audit" ON citizen_interaction_audit FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_audit" ON citizen_interaction_audit;
CREATE POLICY "anon_delete_audit" ON citizen_interaction_audit FOR DELETE
  TO anon, authenticated USING (true);
