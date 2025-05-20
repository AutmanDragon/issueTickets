<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-2xl font-bold mb-6">แก้ไข Ticket</h1>

    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2">หัวข้อ:</label>
      <input v-model="ticket.title" class="w-full border p-2 rounded" disabled />
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2">รายละเอียด:</label>
      <textarea v-model="ticket.description" class="w-full border p-2 rounded" rows="4" disabled></textarea>
    </div>

    <div class="mb-4">
      <label class="block text-gray-700 font-semibold mb-2">สถานะ:</label>
      <select v-model="ticket.status" class="w-full border p-2 rounded">
        <option value="open">ใหม่</option>
        <option value="in_progress">กำลังดำเนินการ</option>
        <option value="done">เสร็จสิ้น</option>
      </select>
    </div>

    <button @click="updateStatus"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      บันทึกการเปลี่ยนแปลง
    </button>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'


const route = useRoute()
const router = useRouter()

const ticket = ref({
  title: '',
  description: '',
  status: ''
})

const fetchTicket = async () => {
  const id = route.params.id // เช่น TK25052001
  const res = await axios.get(`/api/tickets/${id}`)
  ticket.value = res.data
}

const updateStatus = async () => {
  const id = route.params.id
  await axios.put(`/api/tickets/${id}`, {
    status: ticket.value.status
  })
  alert('อัปเดตสถานะเรียบร้อยแล้ว')
  router.push('/') // เปลี่ยนไปหน้า list หรือหน้าหลัก
}

onMounted(fetchTicket)
</script>

