<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const title = ref('')
const description = ref('')
const type = ref('')
const priority = ref('')
const contact = ref('')
const department = ref('')
const files = ref([])

function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files)
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  const validFiles = []

  for (const file of selectedFiles) {
    if (allowedTypes.includes(file.type)) {
      validFiles.push(file)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'แนบไฟล์ไม่ถูกต้อง',
        text: `ไม่อนุญาตให้แนบไฟล์ชนิดนี้: ${file.name}`,
      })
    }
  }

  files.value = validFiles
}

const submitForm = async () => {
  if (!title.value || !description.value || !type.value || !priority.value || !contact.value || !department.value) {
    Swal.fire({
      icon: 'warning',
      title: 'กรอกข้อมูลไม่ครบ',
      text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
    })
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('type', type.value)
  formData.append('priority', priority.value)
  formData.append('contact', contact.value)
  formData.append('department', department.value)

  files.value.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const response = await axios.post('http://localhost:3000/api/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    Swal.fire({
      icon: 'success',
      title: 'ส่งข้อมูลสำเร็จ 🎉',
      text: 'ปัญหาของคุณถูกส่งเรียบร้อยแล้ว',
    })

    // รีเซ็ตฟอร์ม
    title.value = ''
    description.value = ''
    type.value = ''
    priority.value = ''
    contact.value = ''
    department.value = ''
    files.value = []

  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err)
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่',
    })
  }
}

function removeFile(index) {
  files.value.splice(index, 1)
}
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">📋 แบบฟอร์มแจ้งปัญหา</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-6">

      <!-- 1️⃣ เลือกประเภทปัญหา -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">ประเภทปัญหา</label>
        <select v-model="type"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">เลือกประเภทปัญหา</option>
          <option value="hardware">ฮาร์ดแวร์</option>
          <option value="software">ซอฟต์แวร์</option>
          <option value="network">เครือข่าย</option>
          <option value="other">อื่นๆ</option>
        </select>
      </div>

      <!-- 2️⃣ หัวข้อปัญหา -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">หัวข้อปัญหา</label>
        <input v-model="title" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น: คอมพิวเตอร์เปิดไม่ติด" />
      </div>

      <!-- 3️⃣ รายละเอียดปัญหา -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">รายละเอียดปัญหา</label>
        <textarea v-model="description"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-y"
          placeholder="ระบุรายละเอียดเพิ่มเติม"></textarea>
      </div>

      <!-- 4️⃣ ความสำคัญ -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">ความสำคัญ</label>
        <select v-model="priority"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">เลือกระดับความสำคัญ</option>
          <option value="low">ต่ำ</option>
          <option value="medium">ปานกลาง</option>
          <option value="high">สูง</option>
        </select>
      </div>

      <!-- 5️⃣ แผนก -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">แผนก / สถานที่</label>
        <select v-model="department"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">เลือกเเผนก</option>
          <option value="IT">IT</option>
          <option value="Sell">Sell</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <!-- 6️⃣ อีเมลหรือเบอร์โทร -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">อีเมลหรือเบอร์โทร</label>
        <input v-model="contact" type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="เช่น: 089-1234567 หรือ your@email.com" />
      </div>

      <!-- 7️⃣ อัปโหลดไฟล์ -->
      <div>
        <label class="block text-gray-700 font-medium mb-1">ไฟล์แนบ (pdf, jpg, png เท่านั้น)</label>
        <input type="file" multiple @change="handleFileChange"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- แสดงไฟล์ที่แนบ -->
      <div v-if="files.length" class="text-sm text-gray-600 mt-2">
        แนบแล้ว {{ files.length }} ไฟล์:
        <ul class="space-y-1 mt-1">
          <li v-for="(file, index) in files" :key="index"
            class="flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
            <span class="truncate text-gray-700">{{ file.name }}</span>
            <button type="button" @click="removeFile(index)" class="text-red-600 text-sm hover:text-red-800">
              ❌ ลบ
            </button>
          </li>
        </ul>
      </div>

      <!-- ปุ่มส่งฟอร์ม -->
      <div class="text-right">
        <button type="submit"
          class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200">
          ส่งปัญหา
        </button>
      </div>
    </form>
  </div>
</template>

