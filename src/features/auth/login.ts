import { supabase } from '@/shared/api/supabase'

export const login = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}
