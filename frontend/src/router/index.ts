import { createRouter, createWebHistory } from 'vue-router'
import NewTicketPage from '@/page/NewTicketPage.vue'
import RegisterForm from '@/page/RegisterForm.vue'
import ReportPage from '@/page/ReportPage.vue'
import EditTicketPage from '@/page/EditTicketPage.vue'
import TicketDetailPage from '@/page/TicketDetailPage.vue'   


const routes = [
  { path: '/newticket', name: 'NewTicket', component: NewTicketPage },          // หน้าแรกแสดงฟอร์มแจ้งปัญหา
  { path: '/', name: 'Register', component: RegisterForm }, // หน้าลงทะเบียน
  { path: '/reportpage',name: 'Report', component: ReportPage }, // หน้าเเสดงปัญหาทั้งหมด
  { path: '/edit/:id',name:'EditTicket', component: EditTicketPage},
  { path: '/ticket/:id', name: 'TicketDetail', component: TicketDetailPage, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
