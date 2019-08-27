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
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top-start">
            <el-button type="primary" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
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
      :data="rigthList"
      show-checkbox
      node-key="id"
      :default-checked-keys="chkedArr"
      :default-expand-all='true'
      :props="defaultProps"
    ></el-tree>
     <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightByRoleId } from '@/api/role_index.js'
import { getAllRightList } from '@/api/rigths_index.js'
export default {
  data () {
    return {
      grantdialogFormVisible: false,
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
    // 弹出授权角色对话框--开始
    showGrantDialog (row) {
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
          // 我们只需要获取最后一级，--建议尽量做一个判断
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
    // 这个是取消授权角色里面的权限--结束
  },
  mounted () {
    // 这个是一点击角色列表，然后就加载数据到页面的---开始
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
