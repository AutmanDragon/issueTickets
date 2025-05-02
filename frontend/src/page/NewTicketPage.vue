<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex flex-col flex-1 bg-gray-100">
        <Topbar />
        <main class="p-6">
          <TicketForm />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from '@/components/Sidebar.vue'
  import Topbar from '@/components/Topbar.vue'
  import TicketForm from '@/components/TicketForm.vue'
  </script>
  