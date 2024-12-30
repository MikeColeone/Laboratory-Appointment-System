import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

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
          name: '控制台',
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
              name: '实验室详情',
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
            path: '/teachers',
            name: 'Teachers',
            component: () => import('@/views/admin/teacherManage.vue'),
            meta: {
              id: '1',
              name: '教师管理',
              icon: 'EditPen',
              path: '/teachers',
              descibe: '用于表示教师管理',
            },
          },
          {
            path: '/admins',
            name: 'Admins',
            component: () => import('@/views/admin/adminManage.vue'),
            meta: {
              id: '2',
              name: '管理员管理',
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
              id: '3',
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
    component: () => import('@/views/Login/loginView.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})
// router.beforeEach((to, form, next) => {
//   const user = JSON.parse(localStorage.getItem('xm-user') || '{}')
//   if (to.path == '/') {
//     if (user.role) {
//       if (user.role == 'USER') {
//         next('')
//       } else if (user.role == 'ADMIN') {
//         next('')
//       } else if (user.role == 'SUPERADMIN') {
//         next('')
//       } else {
//         next('/login')
//       }
//     }
//   }
// })

export default router
