<template>
  <header class="app-header">
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <AuthWidget />
      </nav>
    </div>
  </header>
  <div class="app-content">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AuthWidget from '@/widgets/auth/AuthWidget.vue'
import { loadUser } from '@/entities/user/model'

onMounted(async () => {
  await loadUser()
})
</script>
<style lang="scss">
.app-header {
  display: none;
  flex-shrink: 0;
  justify-content: center;
  padding: 0 10px;
  border-bottom: 1px solid white;
  a {
    color: white;
  }
}
.app-content {
  flex-grow: 1;
  position: relative;
  & > * {
    position: absolute;
    inset: 0;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
