// 引入封装好的axios
import axios from '@/axios/axios.js'

// 获取用户数据
export const getAllusers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 实现用户的新增
export const addUsers = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 实现用户编辑
export const editUser = (data) => {
  // console.log(data)
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 实现用户状态设置
export const updataUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 实现用户的删除
export const delUserById = (id) => {
  // console.log(id)
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 实现分配角色
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
