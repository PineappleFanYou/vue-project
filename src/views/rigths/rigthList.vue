<template>
  <div class="rigthList">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="top_list">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rigthList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
              <span>{{ scope.row.level | levelFormat }}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAllRightList } from '@/api/rigths_index.js'
export default {
  data () {
    return {
      rigthList: []
    }
  },
  mounted () {
    getAllRightList('list')
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.rigthList = res.data.data
        } else {
          this.$message.error('数据获取失败')
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.top_list {
  line-height: 45px;
}
</style>
