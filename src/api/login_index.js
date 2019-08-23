// 引入axios
import axios from '@/axios/axios.js'

export const Login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
