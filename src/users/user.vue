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
      <el-button type="success" round @click="addDialogFormVisible = true">添加用户</el-button>
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
            <!-- 事件说明：change --switch 状态发生变化时的回调函数，switch 官方规定只能使用change事件-->
            <!-- scope.row.id 当前行数据的id，我们要知道我们是修改的哪一个用户状态 -->
            <!-- scope.row.mg_state 用户布尔值，true  or  false, mg_state打印出来就知道了 -->
              <el-switch v-model="scope.row.mg_state"  active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row.id,scope.row.mg_state)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="width:280px">
          <!-- 我们是要获取操作里面的每一行数据，不用把操作页包裹，如果包裹了，那就是要拿整个表单的数据 -->
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="success" icon="el-icon-edit" @click='showEditDialog(scope.row)'></el-button>
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
    <!-- 分页展示区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1,2,3,4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      <!--  @size-change="handleSizeChange" 当切换sizes下拉列表是触发
            @current-change="handleCurrentChange" 当切换当前页码是触发
            :current-page="currentPage4" 当前页码
            :page-sizes="[100, 200, 300, 400]" size下拉列表中选项
            :page-size="100" 默认每页显示的记录数
            layout="total, sizes, prev, pager, next, jumper" 分页组件的布局结构
            :total="400" 总记录数 -->
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
  <el-form :model="addForm" :label-width="'80px'" :rules='rules' ref="addForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </div>
</el-dialog>

<!-- 编辑用户对话框 -->
 <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
  <el-form :model="editForm" :label-width="'80px'" :rules='rules' ref="editForm">
    <el-form-item label="用户名">
      <el-input v-model="editForm.username" auto-complete="off" disabled style="width:100px"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
// 调用axios接口
import { getAllusers, addUsers, editUser, updataUserState } from '@/api/user_index.js'
export default {
  data () {
    return {
      // 编辑用户的
      editDialogFormVisible: false,
      // 添加用户的
      addDialogFormVisible: false,
      // 编辑用户的
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 添加用户的
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+[@]\w+[.]\w+/, message: '请输入合法的电子邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入合法的手机号', trigger: 'blur' }
        ]
      },
      total: 0,
      userKey: '',
      userList: [],
      userobj: {
        // query:查询参数，可以为空
        // pagenum: 当前页码，不能为空，这里暂时写1页
        // pagesize:每页显示的条数，不能为空
        query: '',
        pagenum: 1,
        pagesize: 4
      }
    }
  },
  methods: {
    // 实现用户状态设置
    /* 这里传入的两个参数只是形参，changeState (id, type)是要传入两个形参，如果这里不传入两个形参，那我们调用axios的时候就没有参入形参，为什么传入两个？因为，我们后台的接口文档写明了发送请求的时候要传入两个参数，然后我们传入两个参数过去，后台去判断是哪一条数据，不然根本不知道是修改哪一条 */
    changeState (id, type) {
      updataUserState(id, type)
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.$message.success('修改用户状态成功')
            // 重新加载页面
            this.init()
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('修改用户状态失败')
        })
    },
    // 点击确定，然后编辑成功
    editUser () {
      // 实现二次认证--用户有可能填空，我们不能让他们填空
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          editUser(this.editForm)
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success('编辑成功')
                this.init()
                // 成功之后让编辑框消失
                this.editDialogFormVisible = false
                // 重置表单元素
                this.$refs.editForm.resetFields()
              }
            })
            .catch((err) => {
              console.log(err)
              this.$message.error('编辑用户失败')
            })
        } else {
          this.$message.error('获取用户数据失败')
          return false
        }
      })
    },
    // 弹出编辑对话框--实现数据默认展示
    showEditDialog (row) {
      // 点击编辑按钮，弹出编辑框
      this.editDialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 用户新增
    add () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addUsers(this.addForm)
            .then((res) => {
              console.log(res)
              if (res.data.meta.status === 201) {
                // 如果我们添加成功了，是直接加到数据库的，所以我们添加成功之后要刷新页面才能看到
                this.$message.success('添加用户成功')
                // 刷新页面
                this.init()
                // 添加成功之后，弹出框会消失
                this.addDialogFormVisible = false
                // 清空表单元素的数据--重置表单元素--resetFields()这个是框架里面的
                this.$refs.addForm.resetFields()
              }
            })
            .catch((err) => {
              console.log(err)
              this.$message.success('用户新增失败')
            })
        } else {
          this.$message.warning('请输入所有必填数据')
        }
      })
    },
    // 当切换sizes下拉列表时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    // 当切换当前页码时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // 1.修改参数
      this.userobj.pagenum = val
      // 2.重新请求
      this.init()
    },
    init () {
      getAllusers(this.userobj)
        .then((res) => {
        // 这里还要判断一下否是 200，因为有可能是无效的token，那就是400，打印出来看到的
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取记录总数
            this.total = res.data.data.total
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
