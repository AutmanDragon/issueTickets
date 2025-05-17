<template>
  <div class="relative" ref="dropdownRef">
    <!-- ปุ่มกดเปิด dropdown -->
    <button @click="toggleDropdown" class="relative">
      <span class="material-symbols-outlined text-2xl text-gray-700">notifications</span>

      <!-- ตัวเลขแจ้งเตือนยังไม่อ่าน -->
      <span v-if="unreadCount > 0"
        class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow">
        {{ unreadCount }}
      </span>
    </button>

    <!-- กล่อง dropdown การแจ้งเตือน -->
    <transition name="fade-slide">
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-3 z-50">
        <h3 class="text-sm font-semibold mb-2">การแจ้งเตือน</h3>

        <div v-if="notifications.length > 0" class="max-h-60 overflow-y-auto space-y-2">
          <!-- 🔹 กลุ่ม: วันนี้ -->
          <template v-if="groupNotificationsByDay().today.length > 0">
            <p class="text-xs text-gray-400 px-2">วันนี้</p>
            <ul>
              <li v-for="noti in groupNotificationsByDay().today" :key="noti.id"
                class="p-2 rounded cursor-pointer transition hover:bg-gray-100" :class="{ 'bg-blue-50': !noti.read }"
                @click="goToTicket(noti.ticketId)">
                <p class="text-sm flex items-center gap-2">
  <span :class="`material-symbols-outlined text-base ${getIconColor(noti.type)}`">
    {{ getIcon(noti.type) }}
  </span>
  <span>{{ noti.message }}</span>
  <span class="text-[11px] text-gray-400" v-if="noti.ticketCode">({{ noti.ticketCode }})</span>
</p>

                <span class="text-xs text-gray-500">{{ timeAgo(noti.timestamp) }}</span>
              </li>
            </ul>
          </template>

          <!-- 🔹 กลุ่ม: ก่อนหน้านี้ -->
          <template v-if="groupNotificationsByDay().earlier.length > 0">
            <p class="text-xs text-gray-400 px-2 pt-2">ก่อนหน้านี้</p>
            <ul>
              <li v-for="noti in groupNotificationsByDay().earlier" :key="noti.id"
                class="p-2 rounded cursor-pointer transition hover:bg-gray-100" :class="{ 'bg-blue-50': !noti.read }"
                @click="goToTicket(noti.ticketId)">
                <p class="text-sm flex items-center gap-2">
                  <span class="material-symbols-outlined text-base text-blue-500">info</span>
                  {{ noti.message }}
                </p>
                <span class="text-xs text-gray-500">{{ timeAgo(noti.timestamp) }}</span>
              </li>
            </ul>
          </template>
        </div>

        <!-- ไม่มีการแจ้งเตือน -->
        <p v-else class="text-sm text-gray-500 text-center py-4">ไม่มีการแจ้งเตือน</p>
      </div>
    </transition>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

const showDropdown = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const dropdownRef = ref(null)

const userId = 4 // เปลี่ยนให้ dynamic ได้ภายหลัง

// ✅ โหลดเสียง
const notificationSound = new Audio('/sounds/notification.mp3')

function playNotificationSound() {
  notificationSound.currentTime = 0
  notificationSound.play().catch(err => {
    console.warn("ไม่สามารถเล่นเสียงได้:", err)
  })
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    markUnreadAsRead()
  }
}

function groupNotificationsByDay() {
  const today = new Date().toDateString()
  const grouped = { today: [], earlier: [] }

  for (const noti of notifications.value) {
    const notiDate = new Date(noti.timestamp).toDateString()
    if (notiDate === today) {
      grouped.today.push(noti)
    } else {
      grouped.earlier.push(noti)
    }
  }

  return grouped
}

async function fetchNotifications() {
  try {
    const res = await axios.get(`http://localhost:3000/api/notifications/user/${userId}`)
    notifications.value = res.data.map(n => ({
      id: n.id,
      message: n.message,
      ticketId: n.ticket_id,
      ticketCode: n.ticketCode || '',
      timestamp: n.created_at,
      read: n.is_read,
      type: n.type
    }))
    unreadCount.value = notifications.value.filter(n => !n.read).length
  } catch (err) {
    console.error('โหลดแจ้งเตือนไม่ได้:', err)
  }
}

async function markUnreadAsRead() {
  const unread = notifications.value.filter(n => !n.read)
  for (const noti of unread) {
    try {
      await axios.post(`http://localhost:3000/api/notifications/mark-read/${noti.id}`)
      noti.read = true
    } catch (err) {
      console.error('Mark as read failed:', err)
    }
  }
  unreadCount.value = 0
}

async function checkDoneNotifications() {
  try {
    const res = await axios.get(`http://localhost:3000/api/notifications/check-done/${userId}`)
    if (res.data.notify) {
      playNotificationSound() // ✅ ดังเมื่อมีแจ้งเตือนใหม่
      fetchNotifications()
    }
  } catch (err) {
    console.error('ตรวจสอบแจ้งเตือน done ไม่สำเร็จ:', err)
  }
}

async function checkInProgressNotifications() {
  try {
    const res = await axios.get(`http://localhost:3000/api/notifications/check-inprogress/${userId}`)
    if (res.data.notify) {
      playNotificationSound() // ✅ ดังเมื่อมีแจ้งเตือนใหม่
      fetchNotifications()
    }
  } catch (err) {
    console.error('ตรวจสอบแจ้งเตือน in_progress ไม่สำเร็จ:', err)
  }
}

function getIcon(type) {
  switch (type) {
    case 'in_progress_alert': return 'build'
    case 'done_alert': return 'check_circle'
    default: return 'info'
  }
}

function getIconColor(type) {
  switch (type) {
    case 'in_progress_alert': return 'text-yellow-500'
    case 'done_alert': return 'text-green-500'
    default: return 'text-blue-500'
  }
}

function timeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now - past;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return 'เมื่อครู่นี้';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;
  if (weeks < 4) return `${weeks} สัปดาห์ที่แล้ว`;
  if (months < 12) return `${months} เดือนที่แล้ว`;
  return `${years} ปีที่แล้ว`;
}

function goToTicket(ticketId) {
  window.location.href = `/ticket/${ticketId}`
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', handleClickOutside)

  // ตรวจสอบทุก 3 วินาที
  setInterval(() => {
    checkDoneNotifications()
    checkInProgressNotifications()
  }, 3000)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
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