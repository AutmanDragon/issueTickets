<template>
    <span
  :class="[
    'px-2 py-1 rounded text-white text-xs',
    ticket.status === 'open' ? 'bg-gray-500' :
    ticket.status === 'in_progress' ? 'bg-yellow-500' :
    ticket.status === 'done' ? 'bg-green-600' : 'bg-gray-300'
  ]"
>
  {{
    ticket.status === 'open' ? 'ใหม่' :
    ticket.status === 'in_progress' ? 'กำลังดำเนินการ' :
    ticket.status === 'done' ? 'เสร็จสิ้น' : 'ไม่ระบุ'
  }}
</span>

  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({ status: String })
  
  const badgeClass = computed(() => {
    return {
      'bg-blue-100 text-blue-600': props.status === 'open',
      'bg-yellow-100 text-yellow-600': props.status === 'in_progress',
      'bg-green-100 text-green-600': props.status === 'done',
    }
  })
  
  const statusText = computed(() => {
    return props.status === 'open'
      ? 'ใหม่'
      : props.status === 'in_progress'
      ? 'กำลังดำเนินการ'
      : 'เสร็จสิ้น'
  })
  </script>
  