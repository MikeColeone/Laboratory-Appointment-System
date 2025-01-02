import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/MainView.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/dashboard/indexView.vue'),
        meta: {
          id: '1',
          name: '首页',
          icon: 'Platform',
          path: '/dashboard',
          describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据',
        },
      },
      {
        path: 'info-management',
        name: 'InfoManagement',
        meta: {
          id: '2',
          name: '信息管理',
          icon: 'Document',
          path: '/info-management',
          descibe: '用于信息管理',
        },
        children: [
          {
            path: '/announcements',
            name: 'Announcements',
            component: () => import('@/views/components/newsView.vue'),
            meta: {
              id: '1',
              name: '公告信息',
              icon: 'BellFilled',
              path: '/announcements',
              descibe: '用于展示实验室公告信息',
            },
          },
          {
            path: '/reservations',
            name: 'Reservations',
            component: () => import('@/views/components/appointmentInfo.vue'),
            meta: {
              id: '2',
              name: '预约信息',
              icon: 'List',
              path: '/reservations',
              descibe: '用于展示实验室公告信息',
            },
          },
          {
            path: '/details',
            name: 'Details',
            component: () => import('@/views/components/labDetails.vue'),
            meta: {
              id: '3',
              name: '临时预约',
              icon: 'Reading',
              path: '/details',
              descibe: '用于展示实验室详细信息',
            },
          },
        ],
      },
      {
        path: 'personnel-management',
        name: 'PersonnelManagement',
        meta: {
          id: '3',
          name: '人员管理',
          icon: 'Avatar',
          path: '/personnel-management',
          descibe: '用于表示实验室人员管理',
        },
        children: [
          {
            path: '/admins',
            name: 'Admins',
            component: () => import('@/views/admin/adminManage.vue'),
            meta: {
              id: '1',
              name: '用户管理',
              icon: 'UserFilled',
              path: '/admins',
              descibe: '用于表示管理员管理',
            },
          },
          {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/components/personnalInfo.vue'),
            meta: {
              id: '2',
              name: '个人信息',
              icon: 'User',
              path: '/profile',
              descibe: '用于表示个人信息管理',
            },
          },
        ],
      },
    ],
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/components/loginView.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/components/403.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('xm-user') || '{}')

  // && to.path !== '/profile' 添加该逻辑 防止用户在跳转的时侯一直发请修改密码 阻塞进程
  if (user.password === user.account && user.role === 'teacher' && to.path !== '/profile') {
    next('/profile')
    ElMessage.error('请修改密码')
    return
  }

  if (to.path === '/admin/manage' && user.role !== 'admin') {
    next('/403')
    ElMessage.error('无权限访问')
    return
  }

  if (!user.role && to.path !== '/login') {
    next('/login')
    return
  }

  if (to.path === '/') {
    if (user.role === 'user') {
      next('/dashboard')
    } else {
      next('/login')
    }
    return
  }

  next() // 继续导航
})

export default router
