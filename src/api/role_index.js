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

// 3.为指定角色授权
export const grantRolsById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
