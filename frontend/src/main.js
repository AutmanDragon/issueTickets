import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css' // ถ้าใช้ Tailwind ก็จะอยู่ในไฟล์นี้

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')