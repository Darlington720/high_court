import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zzejgwxitnbnqkwiqgls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZWpnd3hpdG5ibnFrd2lxZ2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjkyNTgsImV4cCI6MjA1MzQwNTI1OH0.FdyOWcF0jTrF9Ek0WngvwG0ZXDbWeXIEJsi-C6_xQI4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function checkSupabaseConnection() {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  return supabase;
}