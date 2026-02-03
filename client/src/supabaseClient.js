import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajfyzjdjxuwpfdmlnmlg.supabase.co';
const supabaseAnonKey = 'sb_publishable_oVq4UX58NzTmB7h4KIBxiw_ux-to2Ov';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
