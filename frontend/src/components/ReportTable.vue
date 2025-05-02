<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TicketRow from './TicketRow.vue'


const tickets = ref([])

const data = ref([])


const fetchTickets = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/tickets')
    tickets.value = response.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const getdata = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/tickets/get')
    data.value = response.data
    console.log('data from API :',data.value) //ดูมาข้อมูลมาไหม
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const updateStatus = async (id, newStatus) => {
  try {
    await axios.put(`http://localhost:3000/api/tickets/${id}/status`, {
      status: newStatus
    })
    fetchTickets()
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

onMounted(getdata)
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-semibold mb-4">📋 รายการแจ้งปัญหา</h2>
    <div class="overflow-auto">
      <table class="min-w-full table-auto text-sm text-left">
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th class="p-3">หัวข้อ</th>
            <th class="p-3">รายละเอียด</th>
            <th class="p-3">หมวดหมู่</th>
            <th class="p-3">ความสำคัญ</th>
            <th class="p-3">ติดต่อ</th>
            <th class="p-3">แผนก</th>
            <th class="p-3">สถานะ</th>
            <th class="p-3">ไฟล์แนบ</th>
            <th class="p-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <TicketRow
            v-for="ticket in data"
            :key="ticket.id"
            :ticket="ticket"
            :onStatusChange="updateStatus"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
