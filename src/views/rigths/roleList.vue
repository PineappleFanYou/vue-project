<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="top_list">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" class="btnmgb">添加角色</el-button>
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
                @close="delRoleList(props.row, first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" class="secondjurisdiction">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'warning'"
                    @close="delRoleList(props.row, second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'danger'"
                    v-for="third in second.children"
                    :key="third.id"
                    class="thirdjurisdiction"
                    @close="delRoleList(props.row, third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-start">
            <el-button type="primary" icon="el-icon-share" @click="btnRoleList"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="primary" icon="el-icon-delete"></el-button>
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
      :data="roleList"
      show-checkbox
      node-key="id"
      :default-checked-keys="[5]"
      :default-expand-all='true'
      :props="defaultProps"
    ></el-tree>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
  </div>
</template>
<script>
import { getAllRoleList, delRightByRoleId } from '@/api/role_index.js'
export default {
  data () {
    return {
      grantdialogFormVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      roleList: []
    }
  },
  methods: {
    // 授权角色对话框
    btnRoleList () {
      this.grantdialogFormVisible = true
    },
    // 删除角色
    delRoleList (row, rightId) {
      delRightByRoleId(row.id, rightId)
        .then(res => {
          //   console.log(res)
          if (res.data.meta.status === 200) {
            // 刷新,不要使用init，因为init会刷新整个表格，造成展开行合并
            // res.data.data就是实现当前权限删除操作后该角色还拥有的权限数据
            // 展开行数据：scope.row.children
            row.children = res.data.data
            this.$message.success('取消权限成功')
            // console.log(res)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
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
