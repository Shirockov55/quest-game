import { supabase } from '@/shared/api/supabase'

export const signup = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}
