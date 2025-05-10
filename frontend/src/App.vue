<template>
  <div class="flex h-screen">
    <Sidebar />
    <main class="flex-1 overflow-y-auto bg-gray-100 p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
