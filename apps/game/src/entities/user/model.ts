import { ref } from 'vue'
import { supabase } from '@/shared/api/supabase'
import type { User } from '@supabase/supabase-js'

export const user = ref<User | null>(null)

export const loadUser = async () => {
  const {
    data: { user: currentUser }
  } = await supabase.auth.getUser()

  user.value = currentUser
}
