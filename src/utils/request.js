/* 配置统一的请求 */
import axios from 'axios'
import store from '@/store'
import jsonBig from 'json-bigint'
// 创建实例 好处：可以根据不同的路径去请求不同的服务器
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return data
    }
  }]
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const user = store.state.token
  // 可以解构
  // const { user } = store.state
  // 添加判断条件
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, async function (error) {
  // console.log(error)
  /* //监测token过期 */
  if (error.response.status === 401) {
    // console.log('token过期')
    // 发请求，刷新token
    // 注意：不能用request发，会死循环，因为request设置了请求拦截器，会注入老token
    // 用axios发请求
    const { data } = await axios({
      url: 'http://toutiao.itheima.net/v1_0/authorizations',
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${store.state.token.refresh_token}` /* //怎么拿refresh_token */
      }
    })
    // 新token存到vuex中，存到本地存储，在js文件中不能用辅助函数
    // 利用解构赋值覆盖旧token
    store.commit('setUser', { ...store.state.token, token: data.data.token })
    // 再发一次上次发送过得请求(error里有上一次发送的地址和错误的token)
    return request(error.config)
  }
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 默认导出
export default request
