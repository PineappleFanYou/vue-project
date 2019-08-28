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

// 4.添加角色
export const addRoleList = (data) => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}

// 5.编辑用户
export const editUserRoleById = (data) => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data
  })
}

// 6.删除角色
export const delRoleById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
