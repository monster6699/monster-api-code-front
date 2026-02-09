import axios from 'axios'

const request = axios.create({
  baseURL: '/api', // 你的 API 基础路径
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，添加 token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    // 例如，统一处理业务错误
    const { data } = response
    if (data.code !== 0) {
      // 这里可以根据实际业务错误码进行处理
      console.error(data.message || '请求失败')
      return Promise.reject(data.message || 'Error')
    }
    return response.data
  },
  (error) => {
    // 对响应错误做些什么
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('Network Error:', error.message)
    } else {
      // 在设置请求时发生了某些事情，触发了一个错误
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default request
