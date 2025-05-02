<template>
  <tr class="border-b hover:bg-gray-50 transition">
    <td class="p-3">{{ ticket?.title }}</td>
    <td class="p-3 truncate max-w-xs">{{ ticket.description }}</td>
    <td class="p-3 capitalize">{{ ticket.type }}</td>

    <!-- ✅ PRIORITY BADGE -->
    <td class="p-3">
      <span
        :class="{
          'bg-red-100 text-red-700': ticket.priority?.toLowerCase() === 'high' || ticket.priority === 'Critical',
          'bg-yellow-100 text-yellow-700': ticket.priority?.toLowerCase() === 'medium',
          'bg-green-100 text-green-700': ticket.priority?.toLowerCase() === 'low'
        }"
        class="px-2 py-1 rounded-full text-xs font-semibold capitalize"
      >
        {{ ticket.priority }}
      </span>
    </td>

    <td class="p-3">{{ ticket.contact }}</td>
    <td class="p-3">{{ ticket.department }}</td>

    <!-- ✅ STATUS BADGE -->
    <td class="p-3">
      <span
        @click="toggleStatusDropdown = !toggleStatusDropdown"
        :class="[
          'px-2 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer',
          ticket.status === 'new' ? 'bg-gray-200 text-gray-800' :
          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        ]"
      >
        {{
          ticket.status === 'new'
            ? 'ใหม่'
            : ticket.status === 'in_progress'
            ? 'กำลังดำเนินการ'
            : 'เสร็จสิ้น'
        }}
      </span>

      <!-- Dropdown for changing status -->
      <div
        v-if="toggleStatusDropdown"
        class="mt-2 absolute bg-white border rounded shadow-md w-36 z-10"
      >
        <ul>
          <li
            v-for="status in statusOptions"
            :key="status.value"
            @click="changeStatus(status.value)"
            class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {{ status.label }}
          </li>
        </ul>
      </div>
    </td>

    <td class="p-3">
      <FileLinks :filePath="ticket.file_path" />
    </td>

    <td class="p-3">
      <button class="text-yellow-600 hover:underline">✏️ แก้ไข</button>
    </td>
  </tr>
</template>

<script setup>
import { ref } from 'vue'
import FileLinks from './FileLinks.vue'

const props = defineProps({
  ticket: Object,
  onStatusChange: Function
})

const toggleStatusDropdown = ref(false)

const statusOptions = [
  { value: 'new', label: 'ใหม่' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'done', label: 'เสร็จสิ้น' }
]

const changeStatus = (newStatus) => {
  toggleStatusDropdown.value = false
  props.onStatusChange(props.ticket.id, newStatus)
}
</script>
