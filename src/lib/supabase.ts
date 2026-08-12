import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

export type AuditRow = {
  id?: string
  session_id: string
  language: string
  user_query?: string | null
  extracted_profile?: Record<string, unknown> | null
  recommended_scheme_ids?: string[]
  follow_up_qa?: Array<{ q: string; a: string }> | null
  feedback?: string | null
  created_at?: string
}
