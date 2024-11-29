import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'

import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/admin/dashboard',
    component: () => import('@/views/admin/indexView.vue'),
  },
  { path: '/teacher/home', component: () => import('@/views/teacher/indexView.vue') },
  { path: '/super-admin/panel', component: () => import('@/views/superAdmin/indexView.vue') },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('userRole') // 从本地存储获取角色信息

  if (to.path.startsWith('/admin') && role !== 'admin') {
    ElMessage.error('无权访问该页面')
    next('/') // 重定向到首页或登录页
  } else if (to.path.startsWith('/teacher') && role !== 'teacher') {
    ElMessage.error('无权访问该页面')
    next('/')
  } else {
    next() // 允许访问
  }
})

export default router
