<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Log In</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/features/auth/login'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Error logging in:', error)
  }
}
</script>
