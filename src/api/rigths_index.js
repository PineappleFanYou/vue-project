// 引入封装好的的axios
import axios from 'axios'

// 获取所有权限列表数据
export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
