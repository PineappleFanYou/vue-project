// 引入axios
import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
// 拦截器的本质并不是发起请求的，而是对请求报文进行处理
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么：获取token
  // 1.获取token
  let mytoken = localStorage.getItem('itcast_manager_token')
  // console.log(mytoken)
  //   console.log(config)
  // 这里要判断一下是否是有token
  if (mytoken) {
    // 2.设置请求头：config.headers是一个对象（这个是打印config出来才知道的，里面一个headers）里面就包含着当前请求头的设置
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  // Promise.reject(error):终止本次请求
  return Promise.reject(error)
})
export default axios
