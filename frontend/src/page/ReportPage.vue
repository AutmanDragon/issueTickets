<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Topbar />
      <main class="p-6 bg-gray-100 min-h-screen">
        <ReportTable />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
import ReportTable from '@/components/ReportTable.vue' // ถ้าแยกแล้ว
</script>
