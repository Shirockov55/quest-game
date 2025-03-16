<template>
  <form @submit.prevent="handleSignup">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Sign Up</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { signup } from '@/features/auth/signup'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleSignup = async () => {
  try {
    await signup(email.value, password.value)
    router.push('/login')
  } catch (error) {
    console.error('Error signing up:', error)
  }
}
</script>
