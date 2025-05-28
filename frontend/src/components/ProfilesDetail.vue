<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">👤 ข้อมูลผู้ใช้งาน</h2>

      
      <div v-if="isEditMode" class="space-x-2 flex items-center">
        <button
          class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all"
          @click="saveProfile">
          <span class="material-symbols-outlined text-base">save</span>
          <span>บันทึกข้อมูล</span>
        </button>

        <button
          class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-md transition-all"
          @click="cancelEdit">
          <span class="material-symbols-outlined text-base">close</span>
          <span>ยกเลิก</span>
        </button>

      </div>



      <button v-else
        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all"
        @click="enterEditMode">
        <span class="material-symbols-outlined text-base">edit</span>
        <span>เเก้ไขโปรไฟล์</span>

      </button>
    </div>




    <!-- Profile Image -->
    <div class="flex flex-col items-center space-y-2">
      <label class="relative group w-28 h-28 cursor-pointer">
        <img :src="imagePreview || defaultAvatar"
          class="w-full h-full rounded-full object-cover border-2 border-gray-300" alt="Profile Picture" />
        <!-- Overlay แบบกล้องมุมล่างขวา -->
        <div v-if="isEditMode"
          class="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>




        <input v-if="isEditMode" type="file" ref="fileInput" class="hidden" @change="onFileChange" />
      </label>

    </div>





    <!-- User Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="text-gray-500">ชื่อ-นามสกุล</p>
        <template v-if="isEditMode">
          <input v-model="fullName" type="text" class="border p-2 rounded w-full" />
        </template>
        <template v-else>
          <p class="font-medium text-lg">{{ fullName }}</p>
        </template>
      </div>

      <div>
        <p class="text-gray-500">อีเมล</p>
        <template v-if="isEditMode">
          <input v-model="email" type="text" class="border p-2 rounded w-full" />
        </template>
        <template v-else>
          <p class="font-medium text-lg">{{ email }}</p>
        </template>

      </div>
      <div>
        <p class="text-gray-500">ตำแหน่ง</p>
        <template v-if="isEditMode">
          <input v-model="position" type="text" class="border p-2 rounded w-full" />
        </template>
        <template v-else>
          <p class="font-medium text-lg">{{ position }}</p>
        </template>
      </div>
      <div>
        <p class="text-gray-500">สถานะบัญชี</p>
        <span class="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          ยืนยันแล้ว
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-4 pt-4 border-t">

      <button
        class="flex items-center gap-2 text-sm bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition-all"
        @click="LinkTelegram">
        <span class="material-symbols-outlined text-base">send</span>
        <span>เชื่อมต่อ Telegram</span>
      </button>
      <button
        class="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-all"
        @click="onChangePassword">
        <span class="material-symbols-outlined text-base">lock_reset</span>
        <span>เปลี่ยนรหัสผ่าน</span>
      </button>

      <!-- ออกจากระบบ -->
      <button
        class="flex items-center gap-2 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all"
        @click="onLogout">
        <span class="material-symbols-outlined text-base">logout</span>
        <span>ออกจากระบบ</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


// โหมดแก้ไข
const isEditMode = ref(false)

// เก็บข้อมูลผู้ใช้ปัจจุบัน
const originalProfile = ref({
  fullName: 'อุสมาน เจ๊อาลี',
  position: 'เจ้าหน้าที่ฝ่ายไอที',
})

// ข้อมูลที่แก้ไขได้
const fullName = ref(originalProfile.value.fullName)
const position = ref(originalProfile.value.position)
const email = ref('65200389@kmitl.ac.th')

// รูปโปรไฟล์
const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&f=y'
const imagePreview = ref(null)
const fileInput = ref(null)



const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imagePreview.value = reader.result
      Swal.fire('🎉 สำเร็จ', 'เปลี่ยนรูปโปรไฟล์เเล้ว', 'success')
    }
    reader.readAsDataURL(file)
  }
}

// ฟังก์ชันโหมดแก้ไข
const enterEditMode = () => {
  isEditMode.value = true
}

const saveProfile = () => {
  originalProfile.value.fullName = fullName.value
  originalProfile.value.position = position.value
  isEditMode.value = false
  Swal.fire({
    icon: 'success',
    title: 'บักทึกสำเร็จ',
    text: 'ข้อมูลของคุณได้รับการบันทึกเเล้ว',
    timer: 2000,
    showCancelButton: false

  })
}

const cancelEdit = async () => {
  const result = await Swal.fire({
    title: 'คุณเเน่ใจหรือไม่?',
    text: 'คุณต้องการยกเลิกการเเก้ไขข้อมูลหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ใช่, ยกเลิก',
    cancelButtonText: 'ไม่',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    fullName.value = originalProfile.value.fullName
    position.value = originalProfile.value.position
    isEditMode.value = false

    Swal.fire({
      title: 'ยกเลิกการเเก้ไขเเล้ว',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }
}



// อื่นๆ
const onChangePassword = () => {
  alert('🔐 ไปหน้าหรือ Modal เปลี่ยนรหัสผ่าน')
}


const LinkTelegram = () => {
  alert('💬 เชื่อมต่อ Telegram')
}

const onLogout = () => {
  Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการออกจากระบบใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {
      // 🔐 ทำ logic ออกจากระบบ เช่น clear token ก่อน
      // localStorage.clear()
      router.push('/')
      Swal.fire({
        title: 'ออกจากระบบแล้ว',
        text: 'ขอบคุณที่ใช้งานระบบ',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    }
  })
}
  


</script>
