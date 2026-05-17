import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variáveis do Supabase (VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY) não foram encontradas no arquivo .env. Certifique-se de que o arquivo .env está configurado corretamente.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
