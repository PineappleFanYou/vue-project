// 引入封装好的axios
import axios from '@/axios/axios.js'

export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 2.删除角色指定的权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
