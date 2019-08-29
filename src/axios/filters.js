// 引入下载安装好的monent
import moment from 'moment'
// 添加一个全局的事件处理过滤器
export const timeFormat = (time) => {
  time = new Date(time * 1000)
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

// 这种是不用下载引入monent的，就简单的用法
// export const timeFormat = (time) => {
//   time = new Date(time * 1000)
//   return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
// }
