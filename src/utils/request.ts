import axios from 'axios'
import router from '@/router'

// 创建一个新的 axios 实例
const request = axios.create({
  baseURL: '/api/', // 后端的接口地址
  timeout: 300000, // 30s 请求超时
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json' // 设置请求头格式
    const token = window.localStorage.getItem('token') // 获取 token
    console.log('Request token:', token) // 打印 token
    if (token) {
      config.headers['token'] = token // 设置请求头
    }
    const user = JSON.parse(localStorage.getItem('xm-user') || '{}') // 获取缓存的用户信息
    if (user && user.token) {
      config.headers['token'] = user.token // 设置请求头
    }
    console.log('Request config:', config) // 打印请求配置
    return config
  },
  (error) => {
    console.error('Request error:', error) // for debug
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    let res = response.data

    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }

    // 打印响应头
    console.log('Response headers:', response.headers)

    // 如果响应中包含 token，则将其存储到 localStorage
    const token = response.headers['token']
    if (token) {
      console.log('Response token:', token) // 打印 token
      localStorage.setItem('token', token)
    }

    if (res.code === 401) {
      localStorage.removeItem('xm-user') // 清除用户信息
      localStorage.removeItem('token') // 清除 token
      router.push('/login')
    }
    return res
  },
  (error) => {
    console.error('Response error:', error) // for debug
    console.error('Response error details:', error.response) // 打印详细的响应错误信息
    return Promise.reject(error)
  },
)

export default request
