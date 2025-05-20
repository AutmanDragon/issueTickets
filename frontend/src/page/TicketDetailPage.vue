<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Ticket #{{ ticket.ticket_id }}</h1>

    <div v-if="loading">กำลังโหลด...</div>
    <div v-else>
      <p><strong>หัวข้อ:</strong> {{ ticket.title }}</p>
      <p><strong>รายละเอียด:</strong> {{ ticket.description }}</p>
      <p><strong>สถานะ:</strong> {{ ticket.status }}</p>
      <p><strong>ประเภท:</strong> {{ ticket.type }}</p>
      <p><strong>ความสำคัญ:</strong> {{ ticket.priority }}</p>
      <!-- เพิ่ม field อื่น ๆ ตามต้องการ -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route   = useRoute()
const id      = route.params.id      // จะได้ค่า 107 จาก /ticket/107
const ticket  = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get(`/api/tickets/${id}`)   // proxy /api ต้องตั้งไว้แล้ว
    ticket.value = res.data
  } catch (e) {
    console.error('โหลด ticket ล้มเหลว', e)
  } finally {
    loading.value = false
  }
})
</script>
