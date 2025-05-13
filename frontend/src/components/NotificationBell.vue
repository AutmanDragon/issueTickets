<template>
  <div class="relative" ref="dropdownRef">
    <button @click="toggleDropdown" class="relative">
      <span class="material-symbols-outlined text-2xl text-gray-700">notifications</span>
      <span v-if="unreadCount > 0"
        class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow">
        {{ unreadCount }}
      </span>
    </button>

    <transition name="fade-slide">
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
        <h3 class="text-sm font-semibold mb-2">การแจ้งเตือน</h3>

        <ul v-if="notifications.length > 0" class="max-h-60 overflow-y-auto space-y-2">
          <li v-for="noti in notifications" :key="noti.id"
            class="p-2 rounded cursor-pointer transition hover:bg-gray-100"
            :class="{ 'bg-blue-50': !noti.read }"
            @click="goToTicket(noti.ticketId)">
            <p class="text-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-base text-blue-500">info</span>
              {{ noti.message }}
            </p>
            <span class="text-xs text-gray-500">{{ timeAgo(noti.timestamp) }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-gray-500 text-center py-4">ไม่มีการแจ้งเตือน</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showDropdown = ref(false)

const unreadCount = ref(0)
const dropdownRef = ref(null)

const userId = 123  // TODO: แก้ให้ดึงจากระบบ auth จริงของคุณ

const res = await fetch(`http://localhost:3000/api/notifications/${userId}`);
const notifications = await res.json();

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

async function fetchNotifications() {
  try {
    const res = await fetch(`http://localhost:3000/api/notifications/in-progress/${userId}`)
    const data = await res.json()
    notifications.value = data
    unreadCount.value = data.filter(n => !n.read).length
  } catch (err) {
    console.error("ไม่สามารถโหลดการแจ้งเตือนได้:", err)
  }
}

function timeAgo(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 60000)
  return diff < 1 ? 'เมื่อครู่นี้' : `${diff} นาทีที่แล้ว`
}

function goToTicket(ticketId) {
  const formattedId = 'TK' + String(ticketId).padStart(4, '0')
  window.location.href = `/ticket/${formattedId}`
}

// 📌 จับคลิกนอก dropdown เพื่อปิด
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 🔁 โหลดแจ้งเตือนใหม่ทุก 30 วินาที
setInterval(() => {
  fetchNotifications()
}, 30000)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
