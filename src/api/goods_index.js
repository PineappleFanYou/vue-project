// 引入封装好的axios
import axios from '@/axios/axios.js'

export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
