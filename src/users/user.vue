<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:45px">
      <!-- to：路由跳转对象，同 vue-router 的 to -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <!-- 这个userKey是我们以后要用的，因为v-model是双向数据绑定，搜索用的，到时候我们再搞一下userKey就行了 -->
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:400px;margin-right:15px"
        @keydown.enter.native = 'init'
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" round>添加用户</el-button>
    </div>
    <!-- table表格 -->
    <template>
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="width:280px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="success" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
              <el-button type="warning" icon="el-icon-share"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
// 调用axios接口
import { getAllusers } from '@/api/user_index.js'
export default {
  data () {
    return {
      userKey: '',
      userList: [],
      userobj: {
        // query:查询参数，可以为空
        // pagenum: 当前页码，不能为空，这里暂时写1页
        // pagesize:每页显示的条数，不能为空
        query: '',
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    init () {
      getAllusers(this.userobj)
        .then((res) => {
        // 这里还要判断一下否是 200，因为有可能是无效的token，那就是400，打印出来看到的
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
          } else if (res.data.meta.status === 400) {
          // 那就给一个错误提示，而且强制跳转到登录页面,这个$message是element-ui里面的内置成员，只要我们下载引入了，就有这个东西
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  // 这些数据是一加载就要显示出来的，所以只有钩子函数适合
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
