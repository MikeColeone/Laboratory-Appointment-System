import axios from 'axios'
import router from '@/router'

// 创建可一个新的axios对象
const request = axios.create({
  baseURL: '/api/',
  timeout: 300000, // 30s请求超时
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(
  (config) => {
    // config.headers['Content-Type'] = 'application/json' // 设置请求头格式
    const token = window.localStorage.getItem('token') // 获取token
    if (token) {
      config.headers['token'] = token // 设置请求头
    }
    const user = JSON.parse(localStorage.getItem('xm-user') || '{}') // 获取缓存的用户信息
    config.headers['token'] = user.token // 设置请求头

    return config
  },
  (error) => {
    console.error('request error: ' + error) // for debug
    return Promise.reject(error)
  },
)

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  (response) => {
    let res = response.data

    // 兼容服务端返回的字符串数据
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    if (res.code === '401') {
      localStorage.removeItem('xm-user') // 清除用户信息
      localStorage.removeItem('token') // 清除 token
      router.push('/login')
    }
    return res
  },
  (error) => {
    console.error('response error: ' + error) // for debug
    return Promise.reject(error)
  },
)

export default request
