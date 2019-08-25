// 引入封装好的axios
import axios from 'axios'

export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
