<template>
  <header class="bg-white shadow px-6 py-3 flex justify-end">
    <div class="flex items-center space-x-4">
      
      <!-- แทนที่ด้วย component -->
      <NotificationBell />

      <!-- โปรไฟล์ -->
      <div class="w-8 h-8 bg-black rounded-full"></div>
      <h1>User</h1>
    </div>
  </header>
</template>

<script setup>
import NotificationBell from '@/components/NotificationBell.vue'
</script>

<style>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
}
</style>
