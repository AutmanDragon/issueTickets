<script setup>
import { ref } from 'vue'
import axios from 'axios'

// ตัวแปรข้อมูลฟอร์ม
const title = ref('')
const description = ref('')
const type = ref('')
const priority = ref('')
const contact = ref('')
const department = ref('')
const files = ref([]);  // สำหรับเก็บไฟล์หลายไฟล์

// เมื่อผู้ใช้เลือกไฟล์
function handleFileChange(event) {
  const selectedFiles = Array.from(event.target.files)
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'] 

  const validFiles = []

  for (const file of selectedFiles) {
    if (allowedTypes.includes(file.type)) {
      validFiles.push(file)
    } else {
      alert(`ไม่อนุญาตให้แนบไฟล์ชนิดนี้: ${file.name}`)
    }
  }

  files.value = validFiles
}

// เมื่อกดปุ่มส่งฟอร์ม
const submitForm = async () => {

  if (!title.value || !description.value || !type.value || !priority.value || !contact.value || !department.value) {
  alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
  return;

}


  const formData = new FormData()

  // ใส่ข้อมูลฟอร์มลง FormData
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('type', type.value)
  formData.append('priority', priority.value)
  formData.append('contact', contact.value)
  formData.append('department', department.value)

  // ใส่ไฟล์แนบทุกไฟล์เข้าไป
  files.value.forEach((file) => {
    formData.append('files', file) // ใช้ชื่อว่า 'files' เหมือนกันหมด
  })

  try {
    const response = await axios.post('http://localhost:3000/api/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // ต้องใส่ header นี้
      },
    })

    alert('ส่งข้อมูลสำเร็จ 🎉')
    console.log(response.data)

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
    alert('ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่')
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">แบบฟอร์มแจ้งปัญหา</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <!-- หัวข้อปัญหา -->
      <div class="mb-4">
        <label class="block mb-1">หัวข้อปัญหา</label>
        <input v-model="title" type="text" class="w-full border rounded p-2" placeholder="กรุณากรอกหัวข้อปัญหา" />
      </div>

      <!-- อีเมลหรือเบอร์โทร -->
      <div class="mb-4">
        <label class="block mb-1">อีเมลหรือเบอร์โทร</label>
        <input v-model="contact" type="text" class="w-full border rounded p-2" />
      </div>

      <!-- แผนก -->
      <div class="mb-4">
        <label class="block mb-1">แผนก / สถานที่</label>
        <input v-model="department" type="text" class="w-full border rounded p-2" />
      </div>

      <!-- ประเภทปัญหา -->
      <div class="mb-4">
        <label class="block mb-1">ประเภทปัญหา</label>
        <select v-model="type" class="w-full border rounded p-2">
          <option value="">เลือกประเภทปัญหา</option>
          <option value="hardware">ฮาร์ดแวร์</option>
          <option value="software">ซอฟต์แวร์</option>
          <option value="network">เครือข่าย</option>
          <option value="other">อื่นๆ</option>
        </select>      
      </div>

      <!-- ความสำคัญ -->
      <div class="mb-4">
        <label class="block mb-1">ความสำคัญ</label>
        <select v-model="priority" class="w-full border rounded p-2">
          <option value="">เลือกระดับความสำคัญ</option>
          <option value="low">ต่ำ</option>
          <option value="medium">ปานกลาง</option>
          <option value="high">สูง</option>
        </select>
      </div>

      <!-- รายละเอียดปัญหา -->
      <div class="mb-4">
        <label class="block mb-1">รายละเอียดปัญหา</label>
        <textarea v-model="description" class="w-full border rounded p-2 h-32"></textarea>
      </div>

      <!-- อัปโหลดไฟล์ -->
      <div class="mb-4">
        <label class="block mb-1">ไฟล์แนบ (pdf, jpg, png เท่านั้น)</label>
        <input type="file" multiple @change="handleFileChange" class="w-full border rounded p-2" /> 
      </div>

      <!-- ปุ่มส่งฟอร์ม -->
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        ส่งปัญหา
      </button>
    </form>
  </div> 
</template>
