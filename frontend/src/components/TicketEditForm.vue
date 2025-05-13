<template>
    <form @submit.prevent="submit">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium">สถานะใหม่</label>
          <select v-model="form.status" class="mt-1 w-full border rounded p-2">
            <option value="ใหม่">ใหม่</option>
            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
          </select>
        </div>
  
        <div>
          <label class="block text-sm font-medium">ผู้รับผิดชอบ</label>
         <select v-model="form.status" class="mt-1 w-full border rounded p-2">
            <option value="Min">Min</option>
            <option value="Mung">Mung</option>
            <option value="Aot">Aot</option>
          </select>
        </div>
  
        <div>
          <label class="block text-sm font-medium">หมายเหตุ</label>
          <textarea v-model="form.note" rows="3" class="mt-1 w-full border rounded p-2" />
        </div>
  
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          บันทึกการแก้ไข
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    ticket: Object
  });
  
  const emit = defineEmits(['submit']);
  
  const form = ref({
    status: '',
    assignee: '',
    note: ''
  });
  
  watch(
    () => props.ticket,
    (newVal) => {
      form.value.status = newVal.status;
      form.value.assignee = newVal.assignee || '';
    },
    { immediate: true }
  );
  
  const submit = () => {
    emit('submit', form.value);
  };
  </script>
  