import { supabase } from '@/shared/api/supabase'

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
