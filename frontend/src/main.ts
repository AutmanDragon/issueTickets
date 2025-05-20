import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css' // ถ้าใช้ Tailwind ก็จะอยู่ในไฟล์นี้
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
app.use(Toast)
createApp(App).use(router).mount('#app') //เพิ่มมาใหม่