<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>
  <div class="app-content">
    <RouterView />
  </div>
</template>
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
