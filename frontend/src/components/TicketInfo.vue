<template>
    <div v-if="ticket" class="grid grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
      <div><strong>หัวข้อ:</strong> {{ ticket.title }}</div>
      <div><strong>หมวดหมู่:</strong> {{ ticket.category }}</div>
      <div><strong>ความสำคัญ:</strong> {{ ticket.priority }}</div>
      <div><strong>ผู้แจ้ง:</strong> {{ ticket.reporter }}</div>
      <div class="col-span-2"><strong>รายละเอียด:</strong> {{ ticket.description }}</div>
      <div><strong>สถานะ:</strong> {{ ticket.status }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router'
  
  const ticket = ref(null)
  const route = useRoute()
  
  onMounted(async () => {
    const id = route.params.id
    const res = await axios.get(`http://localhost:3000/api/tickets/${id}`)
    ticket.value = res.data
  })
  </script>
  