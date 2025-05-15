<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import TicketRow from './TicketRow.vue'
import { computed } from 'vue'

const tickets = ref([])
const searchText = ref('')
const statusFilter = ref('all')

const perPage = ref(10) //ค่าเริ่มต้นเเสดงปัญหาจะเป็น 10 หน้า

const sortOrder = ref('desc') // ค่าเริ่มต้น :ใหม่ -> เก่า

const visibleTickets = computed(() => {
    return filteredTickets.value.slice(0, perPage.value)
})

watch(perPage, (val) => {
    if (val < 1) perPage.value = 1
})


const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}


//Search Ticketnumber
function formatTicketId(datetime) {
    const d = new Date(datetime);
    const yy = String(d.getFullYear()).slice(2);
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `TK${yy}${MM}${dd}${hh}${mm}`;
}



//Search Keyword
const filteredTickets = computed(() => {
    return tickets.value.filter(ticket => {
        const keyword = searchText.value.toLowerCase()

        const matchesSearch =
            formatTicketId(ticket.created_at).toLowerCase().includes(keyword) ||
            (ticket.title || '').toLowerCase().includes(keyword) ||
            (ticket.description || '').toLowerCase().includes(keyword) ||
            (ticket.contact || '').toLowerCase().includes(keyword) ||
            (ticket.department || '').toLowerCase().includes(keyword) ||
            (ticket.status || '').toLowerCase().includes(keyword) ||
            (ticket.type || '').toLowerCase().includes(keyword) ||

            (ticket.ticket_id || '').toLowerCase().includes(keyword) ||

            (ticket.dev || '').toLowerCase().includes(keyword) ||

            (ticket.priority || '').toLowerCase().includes(keyword)



        const matchesStatus =
            statusFilter.value === 'all' || ticket.status === statusFilter.value

        return matchesSearch && matchesStatus
    })

        .sort((a, b) => {
            const dateA = new Date(a.created_at)
            const dateB = new Date(b.created_at)

            return sortOrder.value == 'asc'
                ? dateA - dateB //เก่าก่อน
                : dateB - dateA // ใหม่ก่อน
        })


})


//get all From Database
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

    <p class="text-sm text-gray-500 mb-2">
        ปัญหาทั้งหมดมี่ : {{ filteredTickets.length }} รายการ
    </p>
    <div class="mb-4 flex items-center gap-2">
        <label class="text-sm">แสดงรายการ:</label>
        <input type="number" min="1" v-model.number="perPage" class="w-24 border px-2 py-1 rounded text-sm"
            placeholder="ใส่จำนวนเช่น 5" />


    </div>


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

                        <th class="p-3 ml-5 cursor-pointer select-none flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
                            @click="toggleSortOrder">
                            วันที่
                            <span class="material-symbols-outlined text-sm transition-transform duration-200" :class="{
                                'rotate-180': sortOrder === 'desc',
                            }">
                                arrow_downward
                            </span>
                        </th>




                        <th class="p-3">ผู้เเก้ไข</th>
                        <!-- <th class="p-3">จัดการ</th> -->

                    </tr>
                </thead>
                <tbody>

                    <template v-if="tickets && tickets.length > 0">
                        <TicketRow v-for="(ticket, index) in visibleTickets" :key="ticket.id" :ticket="ticket"
                            :index="index" :onStatusChangeFn="updateStatus" :sortOrder="sortOrder" />
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