<script setup>
import { ref } from 'vue'

// รูปโปรไฟล์เริ่มต้น (placeholder)
const profileImage = ref('https://via.placeholder.com/150')

// handle file upload
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      profileImage.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <header class="bg-white shadow px-6 py-3 flex justify-between items-center">
    <!-- ชื่อระบบ -->
    <div class="flex items-center space-x-3">
      
    </div>

    <!-- โปรไฟล์ -->
    <div class="flex items-center space-x-4">
      <div class="relative group">
        <!-- แสดงรูปโปรไฟล์ -->
        <div class="flex items-center space-x-2 cursor-pointer">
          <label class="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:opacity-80 transition">
            <img :src="profileImage" alt="Profile" class="object-cover w-full h-full" />
            <!-- input แบบซ่อน -->
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          <span class="text-gray-600 text-sm">admin</span>
        </div>

        <!-- เมนู -->
        <div
          class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">โปรไฟล์</a>
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">ตั้งค่า</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">ออกจากระบบ</a>
        </div>
      </div>
    </div>
  </header>
</template>
