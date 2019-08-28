<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="top_list">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" class="btnmgb" @click="addRoleDialogFormVisible = true">添加角色</el-button>
    <!-- 表格-展开航 -->
    <el-table :data="roleList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- 这个内容在我们的项目中需要我们自己来生成 -->
          <!-- 准备进行嵌套循环生成展开行数据展示结构 -->
          <el-row v-for="first in props.row.children" :key="first.id" class="firstjurisdiction">
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;delRoleList(props.row, first.id)"
              >{{first.authName}}</el-tag>
              <!-- 上面定义 cnt=0; 是想让在data()函数对象中定义的cnt 重置为0，如果我们不重置为0，那么我们在cnt++ 自增之后，cnt > 0 始终大于0，所以我们重新置0 -->
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" class="secondjurisdiction">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'warning'"
                    @close="cnt=0;delRoleList(props.row, second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'danger'"
                    v-for="third in second.children"
                    :key="third.id"
                    class="thirdjurisdiction"
                    @close="cnt=0;delRoleList(props.row, third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
           <el-row>
              <el-col :span="24" v-show="props.row.children.length === 0">还没有任何的权限，请先分配</el-col>
            </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-start">
            <el-button type="warning" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" @click="delEditRole(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权角色对话框 -->
    <!-- :data="data2" 数据源--数组  -->
    <!-- show-checkbox  显示复选框 -->
    <!-- node-key="id" // 唯一标识当前节点的属性，影响后期节点的数据获取，获取节点数据时可以获取到这个id -->
    <!-- :default-expanded-keys="[2, 3]" // 默认展开的节点,展开子节点默认也会展开父级节点，意味着如果想展开某个节点，只需要获取最底层的节点id即可 -->
    <!-- :default-checked-keys="[5]"//默认被选择中的节点 -->
    <!-- :default-expand-all='true'// 默认展开所有节点 -->
    <!-- :props="defaultProps"> // 配置：节点展示的文本属性 节点的下级数据 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
    <el-tree
      :data="rigthList"
      ref = "tree"
      show-checkbox
      node-key="id"
      :default-checked-keys="chkedArr"
      :default-expand-all='true'
      :props="defaultProps"
    ></el-tree>
     <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogFormVisible">
 <el-form :model="roleForm"  :rules="rules" ref="roleForm" label-width="100px" class="demo-roleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="roleForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="roleForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑用户对话框 -->
<el-dialog title="编辑用户" :visible.sync="editUserDialogFormVisible">
  <el-form :model="editUser" :label-width="'80px'" :rules='rules' ref="editUser">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="editUser.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="editUser.roleDesc" auto-complete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserRole">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightByRoleId, grantRolsById, addRoleList, editUserRoleById, delRoleById } from '@/api/role_index.js'
import { getAllRightList } from '@/api/rigths_index.js'
export default {
  data () {
    return {
      // 这里是让添加角色编辑用户框一开始就隐藏，点击的时候才是true
      editUserDialogFormVisible: false,
      // 这里定义一个编辑用户的对象
      editUser: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      // 这里是添加角色的验证规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 这里是让添加角色框一开始就隐藏，点击的时候才是true
      addRoleDialogFormVisible: false,
      // 这里定义一个对象，等点击确定的时候再赋值
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 这里定义一个常量，等一下要用
      cnt: 0,
      // 这里定义一个角色id
      roleId: '',
      // 这里是让角色授权框一开始就隐藏，点击的时候才是true
      grantdialogFormVisible: false,
      // 修改默认的配置选项:props
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 这个是加载树形的数组
      rigthList: [],
      // 这个是展开行数据的数组
      roleList: [],
      // 当前角色所拥有的权限id的数组
      chkedArr: []
    }
  },
  methods: {
    // 调用接口方法--实现删除--开始
    delEditRole (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoleById(row)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.init()
            }
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 调用接口方法--实现删除--开始
    // 调用接口方法实现用户编辑--开始
    editUserRole () {
      this.$refs.editUser.validate((valid) => {
        if (valid) {
          editUserRoleById(this.editUser)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.editUser = res.data.data
                this.editUserDialogFormVisible = false
                this.$refs.editUser.resetFields()
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('数据获取失败')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 调用接口方法实现用户编辑--结束

    // 权限管理中的编辑默认数据展示--showEditDialog-开始
    showEditDialog (row) {
      this.editUserDialogFormVisible = true
      this.editUser.roleName = row.roleName
      this.editUser.roleDesc = row.roleDesc
      this.editUser.id = row.id
    },
    // 权限管理中的编辑默认数据展示--showEditDialog-结束
    // 点击确定，然后添加角色---开始
    addRole () {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          addRoleList(this.roleForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.roleForm = res.data.data
                this.addRoleDialogFormVisible = false
                this.$message.success(res.data.meta.msg)
                this.$refs.roleForm.resetFields()
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('添加失败')
            })
        } else {
          this.$message.error('请输入角色名称或角色描述')
          return false
        }
      })
    },
    // 点击确定，然后添加角色---结束

    // 调用接口方法实现角色权限--开始
    grantRole () {
      // rids--参数名  权限 ID 列表  以 , 分割的权限 ID 列表--接口文档规定的
      // 先获取到当前用户所选择所有的权限id，拼接为以（，逗号）分割的字符串
      // getHalfCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      // getCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      // console.log(this.$refs.tree.getCheckedKeys())
      // concat() 方法用于连接两个或多个数组。
      // let arr = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      let arr = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()]
      let temp = arr.join(',')
      // console.log(this.roleId)
      // console.log(temp)
      grantRolsById(this.roleId, temp)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.grantdialogFormVisible = false
            this.init()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    // 调用接口方法实现角色权限--结束

    // 弹出授权角色对话框--开始
    showGrantDialog (row) {
      this.roleId = row.id
      // 1.让对话框展示
      this.grantdialogFormVisible = true
      // 2.加载树形组件的数据--就是一点开角色授权，默认数据的展示--开始
      getAllRightList('tree')
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.rigthList = res.data.data
          }
          // 选中默认节点前要清空上一次选中的
          this.chkedArr.length = 0
          // 3.获取权限id,让节点默认被选择
          // 获取当前角色的所有权限id，添加到chkedArr
          // 我们只需要获取最后一级，--建议尽量做一个判断--开始
          row.children.forEach(first => {
            if (first.children.length > 0) {
              first.children.forEach(second => {
                if (second.children.length > 0) {
                  second.children.forEach(third => {
                    this.chkedArr.push(third.id)
                  })
                }
              })
            }
          })
          // 我们只需要获取最后一级，--建议尽量做一个判断--结束
        })
        .catch(err => {
          console.log(err)
        })

      // 加载树形组件的数据--就是一点开角色授权，默认数据的展示--开始
    },
    // 弹出授权角色对话框--结束

    // 这个是取消授权角色里面的权限--开始
    delRoleList (row, rightId) {
      delRightByRoleId(row.id, rightId)
        .then(res => {
          //   console.log(res)
          if (res.data.meta.status === 200) {
            // 这里判断，如果我们定义的 === 0，那就进入这个判断，弹出提示框
            if (this.cnt === 0) {
              this.$message.success('取消权限成功')
              // 在这里自增，当第一次进入之后，自增一次，那么，当cnt > 0 就进不来了，就不会弹框了
              this.cnt++
            }
            // 刷新,不要使用init，因为init会刷新整个表格，造成展开行合并
            // res.data.data就是实现当前权限删除操作后该角色还拥有的权限数据
            // 展开行数据：scope.row.children
            row.children = res.data.data
            // console.log(res)
            // 判断当前权限是否还有下一级权限，如果没有，则需要将这级权限也删除
            row.children.forEach((v1, in1) => { // 这里是遍历一级权限
              if (v1.children.length === 0) {
                this.delRoleList(row, v1.id) // 这里是，如果遍历一级权限后，发现没有二级权限，我们使用递归，这个函数调用自己本身，传入一级权限的id，然后删除自己
              } else {
                v1.children.forEach((v2, in2) => { // 遍历二级权限，如果没有三级权限，则使用递归，调用自己删除二级权限
                  if (v2.children.length === 0) {
                    this.delRoleList(row, v2.id)
                  }
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 这个是取消授权角色里面的权限--结束
    init () {
      getAllRoleList()
        .then(res => {
        // console.log(res)
          if (res.data.meta.status === 200) {
            this.roleList = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    // 这个是一点击角色列表，然后就加载数据到页面的---开始
    this.init()
  }
  // 这个是一点击角色列表，然后就加载数据到页面的---结束
}
</script>
<style lang="less" scoped>
.top_list {
  line-height: 45px;
}
.btnmgb {
  margin-bottom: 15px;
}
.firstjurisdiction {
  margin-bottom: 15px;
  border-bottom: 1px solid pink;
}
.secondjurisdiction {
  margin-bottom: 10px;
}
.thirdjurisdiction {
  margin-right: 15px;
}
</style>
