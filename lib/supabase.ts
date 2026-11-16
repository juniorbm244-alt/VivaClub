import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Retorna null enquanto as credenciais do Supabase não forem configuradas.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
