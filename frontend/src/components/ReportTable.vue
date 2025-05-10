<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import TicketRow from './TicketRow.vue'
import { computed } from 'vue'

const tickets = ref([])
const searchText = ref('')
const statusFilter = ref('all')

const filteredTickets = computed(() => {
    return tickets.value.filter(ticket => {
        const keyword = searchText.value.toLowerCase()

        const matchesSearch =
            (ticket.title || '').toLowerCase().includes(keyword) ||
            (ticket.description || '').toLowerCase().includes(keyword) ||
            (ticket.contact || '').toLowerCase().includes(keyword) ||
            (ticket.department || '').toLowerCase().includes(keyword) ||
            (ticket.status || '').toLowerCase().includes(keyword) ||
            (ticket.type || '').toLowerCase().includes(keyword) ||

            (ticket.dev || '').toLowerCase().includes(keyword) ||

            (ticket.priority || '').toLowerCase().includes(keyword)
            


        const matchesStatus =
            statusFilter.value === 'all' || ticket.status === statusFilter.value

        return matchesSearch && matchesStatus
    })

    .sort((a, b)=> Date(a.created_at) - new Date(b.created_at)) //เรียงจากเก่า  ไป ใหม่
})



const fetchTickets = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/tickets')
        console.log('Data from API:', response.data)
        tickets.value = response.data
    } catch (error) {
        console.error('Error', error.response?.data || error.message)
    }
}

const updateStatus = async (ticketId, newStatus) => {
    try {
        // console.log(ticketId, newStatus)
        await axios.put(`http://localhost:3000/api/tickets/${ticketId}`, {
            status: newStatus

        })

        // ✅ อัปเดตสถานะใน array เดิม (reactive)
        const ticket = tickets.value.find(t => t.id === ticketId)
        if (ticket) {
            ticket.status = newStatus
        }

    } catch (error) {
        console.error('Error updating status:', error);
    }
}

onMounted(fetchTickets) // ใช้อันเดียวพอ
</script>

<template>
    <div class="mb-4 flex flex-col md:flex-row gap-4 justify-between">
        <!-- Search -->
        <input type="text" v-model="searchText" placeholder="🔍 ค้นหาหัวข้อหรือรายละเอียด"
            class="border px-4 py-2 rounded shadow-sm w-full md:w-1/2" />

        <!-- Filter Status -->
        <select v-model="statusFilter" class="border px-4 py-2 rounded shadow-sm w-full md:w-1/4">
            <option value="all">📋 ทั้งหมด</option>
            <option value="open">🆕 ใหม่</option>
            <option value="in_progress">⏳ กำลังดำเนินการ</option>
            <option value="done">✅ เสร็จสิ้น</option>
        </select>
    </div>


    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">📋 รายการแจ้งปัญหา</h2>
        <div class="overflow-auto">
            <table class="min-w-full table-auto text-sm text-left">
                <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
                    <tr>
                        <th class="p3" style="text-align:center;">หมายเลข</th>
                        <th class="p-3">หัวข้อ</th>
                        <!-- <th class="p-3">รายละเอียด</th> -->
                        <th class="p-3">หมวดหมู่</th>
                        <th class="p-3">ความสำคัญ</th>

                        <th class="p-3">แผนก</th>
                         <th class="p-3">สถานะ</th> 
                        <th class="p-3"  >วันที่</th>
                        <th class="p-3">ผู้เเก้ไข</th>
                        <th class="p-3">จัดการ</th>

                    </tr>
                </thead>
                <tbody>

                    <template v-if="tickets && tickets.length > 0">
                        <TicketRow v-for="(ticket, index) in filteredTickets" :key="ticket.id" :ticket="ticket" :index="index"
                        
                            :onStatusChangeFn="updateStatus" />
                    </template>
                    <tr v-else>
                        <td colspan="9" class="p-4 text-center text-gray-500">
                            ไม่พบข้อมูล
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>