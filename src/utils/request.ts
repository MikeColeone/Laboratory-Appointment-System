import axios from 'axios'
import { ElMessage } from 'element-plus'
//对axios进行二次封装

const http = axios.create({
  //换成接口文档前缀
  baseURL: '/login',
  timeout: 5000,
})
//添加拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('')
    //不需要token的接口 添加到白名单
    const whiteUrl: (string | undefined)[] = []
    if (token && !whiteUrl.includes(config.url)) {
      config.headers[''] = token
    }
    return config
  },
  (error) => {
    //接口异常
    return Promise.reject(error)
  },
)

//添加拦截器
http.interceptors.response.use(
  (response) => {
    if (response.data.code == -1) {
      ElMessage.warning(response.data.message)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default http
