import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const client = checkSupabaseConnection();

      // Get initial session
      client.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication error'));
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
}