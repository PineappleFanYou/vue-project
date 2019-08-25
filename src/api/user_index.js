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
