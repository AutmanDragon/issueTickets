<script setup>
const props = defineProps({
  filePath: [String, Array, null]
})

let files = []

// ป้องกัน error ถ้า filePath เป็น null
if (props.filePath) {
  try {
    // ถ้า filePath เป็น string JSON → แปลงเป็น array
    if (typeof props.filePath === 'string') {
      files = JSON.parse(props.filePath)
    } else if (Array.isArray(props.filePath)) {
      files = props.filePath
    }
  } catch (e) {
    console.warn('❗ Error parsing filePath:', props.filePath)
  }
}
</script>

<template>
  <div class="space-y-1">
    <div v-if="files.length === 0" class="text-gray-400 italic">ไม่มีไฟล์แนบ</div>
    <div v-else>
      <a
        v-for="(file, index) in files"
        :key="index"
        :href="`http://localhost:3000/uploads/${file}`"
        class="text-blue-600 hover:underline block"
        target="_blank"
        rel="noopener"
      >
        📎 {{ file }}
      </a>
    </div>
  </div>
</template>
