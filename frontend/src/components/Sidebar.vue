<template>

  <aside class="bg-gray-900 text-white w-60 h-full p-6 space-y-8">
    <h1 class="text-2xl font-bold">🎫 Issue System</h1>
    <nav class="flex flex-col space-y-4">
      <button class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': route.path === '/newticket' }" @click="setActive('new')">
        <span>📝</span>
        <span>New Ticket</span>
      </button>

      <button class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': route.path === '/reportpage' }" @click="setActive('report')">
        <span>📊</span>
        <span>Report</span>
      </button>

      
      <button class="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-700 transition"
        :class="{ 'bg-gray-700': route.path === '/profiles' }" @click="setActive('Profiles')">
        <span>👤</span>
        <span>Profile</span>
      </button>




    </nav>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const setActive = (page) => {
  if (page === 'new') router.push('/newticket')
  else if (page === 'report') router.push('/reportpage')
  else if (page ==='Profiles') router.push('/profiles')
}
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