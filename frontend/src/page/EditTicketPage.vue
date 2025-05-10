<template>
    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">แก้ไขปัญหา Ticket #{{ ticket.id }}</h1>
  
      <!-- ข้อมูลเดิม -->
      <TicketInfo :ticket="ticket" />
  
      <!-- ฟอร์มแก้ไข -->
      <TicketEditForm
        :ticket="ticket"
        @submit="handleSubmit"
      />
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  import TicketInfo from '@/components/TicketInfo.vue';
  import TicketEditForm from '@/components/TicketEditForm.vue';
  
  const route = useRoute();
  const router = useRouter();
  const ticketId = route.params.id;
  
  const ticket = ref({});
  
  onMounted(async () => {
    const res = await axios.get(`/api/tickets/${ticketId}`);
    ticket.value = res.data;
  });
  
  const handleSubmit = async (formData) => {
    await axios.put(`/api/tickets/${ticketId}`, formData);
    alert('อัปเดตสำเร็จ');
    router.push('/report');
  };
  </script>
  