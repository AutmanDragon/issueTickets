<template>
  <aside class="bg-gray-900 text-white w-60 min-h-screen p-6 space-y-8">
    <h1 class="text-2xl font-bold">🎫 Issue System</h1>
    <nav class="flex flex-col space-y-4">
      <button
        class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': active === 'new' }"
        @click="setActive('new')"
      >
        <span>📝</span>
        <span>New Ticket</span>
      </button>
      <button
        class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': active === 'report' }"
        @click="setActive('report')"
      >
        <span>📊</span>
        <span>Report</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const active = ref('report') // default หน้า report

const setActive = (page) => {
  active.value = page
  // router.push(`/path/${page}`) ← ใส่ router ถ้ามีการจัดการเส้นทาง
}
</script>
