<template>
  <div>
    <button v-if="user" @click="handleSignOut">Sign Out</button>
    <router-link v-else to="/login">Log In</router-link>
    <router-link v-if="!user" to="/signup">Sign Up</router-link>
  </div>
</template>

<script setup lang="ts">
import { user } from '@/entities/user/model'
import { logout } from '@/features/auth/logout'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleSignOut = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>
