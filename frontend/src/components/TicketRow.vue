<template>
  <tr class="border-b hover:bg-gray-50 transition">
    <td class="p-3" style="text-align:center;">TK{{ formatDateCode(ticket.created_at) }}</td>

    <td class="p-3 relative group cursor-pointer max-w-xs">
      <div class="truncate">
        {{ ticket?.title }}
      </div>

      <!-- Tooltip -->
      <div
  class="tooltip-fade absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 delay-150 w-72 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl pointer-events-none">

        <span class="break-words leading-snug max-h-40 overflow-y-auto">
          <strong class="block text-orange-400 mb-1">รายละเอียด:</strong>
          <span class="text-white text-sm">{{ ticket.description}}</span>
        </span>

        <!-- Tooltip arrow -->
        <div class="tooltip-arrow absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 z-[-1]">
        </div>
      </div>
    </td>




    <!-- <td class="p-3 truncate max-w-xs">{{ ticket.description }}</td> -->
    <td class="p-3 capitalize">{{ ticket.type }}</td>

    <!-- PRIORITY BADGE -->
    <td class="p-3">
      <span :class="{
        'bg-red-100 text-red-700': ticket.priority?.toLowerCase() === 'high',
        'bg-yellow-100 text-yellow-700': ticket.priority?.toLowerCase() === 'medium',
        'bg-green-100 text-green-700': ticket.priority?.toLowerCase() === 'low'
      }" class="px-2 py-1 rounded-full text-xs font-semibold capitalize">
        {{ ticket.priority }}
      </span>
    </td>


    <td class="p-3">{{ ticket.department }}</td>

    <!-- STATUS BADGE -->
    <td class="p-3 whitespace-nowrap relative">
      <span @click.stop="toggleStatusDropdown = !toggleStatusDropdown" :class="[
        'px-2 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer',
        ticket?.status === 'open' ? 'bg-gray-200 text-gray-800' :
          ticket?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
      ]">
        {{
          ticket?.status === 'open'
            ? 'ใหม่'
            : ticket?.status === 'in_progress'
              ? 'กำลังดำเนินการ'
              : 'เสร็จสิ้น'
        }}
      </span>




      <!-- Dropdown for changing status -->
      <div v-if="toggleStatusDropdown" ref="dropdownRef"
        class="absolute mt-1 bg-white border rounded shadow-md w-36 z-10">
        <ul>
          <li v-for="status in statusOptions" :key="status.value" @click="changeStatus(status.value)"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
            {{ status.label }}
          </li>
        </ul>
      </div>
    </td>



    <td class="p-3 whitespace-nowrap text-sm text-gray-600">
      {{ formatDate(ticket.created_at) }}
    </td>

    <td class="p-3 whitespace-nowrap text-sm text-gray-600">
      {{ ticket.dev }}
    </td>


    <!-- <td class="p-3">    *ตรงนี้เอาไปโชวลิ้งกดไปโชวร์รูปในBrowser
      <FileLinks :filePath="ticket.file_path" />
    </td> -->

    <td class="p-3">
      <router-link :to="`/edit/${ticket.id}`">
        <button class="text-orange-500 hover:underline">แก้ไข</button>
      </router-link>
    </td>
  </tr>





</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import FileLinks from './FileLinks.vue'

const props = defineProps({
  ticket: Object,
  index: Number,
  onStatusChangeFn: Function,
})

const toggleStatusDropdown = ref(false)
const dropdownRef = ref(null)

const statusOptions = [
  { value: 'open', label: 'ใหม่' },
  { value: 'in_progress', label: 'กำลังดำเนินการ ' },
  { value: 'done', label: 'เสร็จสิ้น' }
]

const changeStatus = async (newStatus) => {
  console.log(props.ticket.id)
  await props.onStatusChangeFn(props.ticket.id, newStatus)
  toggleStatusDropdown.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    toggleStatusDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatDate = (isoDate) => {
  if (!isoDate) return '-'
  const d = new Date(isoDate)
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

}
function formatDateCode(datetime) {
  const d = new Date(datetime);
  const yy = String(d.getFullYear()).slice(2); // ตัด 2 ตัวหน้า
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${MM}${dd}${hh}${mm}`;
}

</script>

<style scoped>
.tooltip-arrow {
  position: absolute;
  top: -6px;
}

.group:hover .tooltip-fade {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
