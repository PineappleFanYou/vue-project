// 引入封装好的axios
import axios from '@/axios/axios.js'

// 获取用户数据
export const getAllusers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
