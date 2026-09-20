import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseSchema = import.meta.env.PUBLIC_SUPABASE_SCHEMA || 'public';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: supabaseSchema,
  },
});

export async function getUserRole() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data } = await supabase.from('perfis').select('papel').eq('id', session.user.id).single();
  return data?.papel || null;
}
