<template>
  <div class="goodsList">
    <!-- 面包屑开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="guangli">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑结束 -->
    <!-- 搜索框 + 按钮开始 -->
    <el-input placeholder="请输入内容" v-model="listKey" class="input-with-select listgoods">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="info">添加商品</el-button>
    <!-- 搜索框 + 按钮结束 -->
    <!-- table表格开始 -->
    <template>
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="520"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200">
            <template slot-scope="scope">
                {{ scope.row.add_time | timeFormat }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <!-- slot-scope="scope" 先把这个拿出来，要用的时候再放上去，不然老是报错 -->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="right">
              <el-button type="success" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核" placement="right">
              <el-button type="info" icon="el-icon-share"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- table表格结束 -->
    <!-- 分页开始 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[1, 2, 3, 4,5]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 分页结束 -->
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
import { timeFormat } from '@/axios/filters.js'
export default {
  data () {
    return {
      total: 0,
      // 这里listKey是以后搜索商品列表的时候用的，先存着，不然数据双向绑定的时候老是报错
      listKey: '',
      // 这个是商品列表数据的对象
      goodsobj: {
        query: '',
        pagenum: 10,
        pagesize: 5
      },
      // 这个是商品列表数据的空数组，到时候请求后然后复制
      goodsList: []
    }
  },
  filters: {
    timeFormat
  },
  methods: {
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.goodsobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.goodsobj.pagenum = val
      this.init()
    },
    search () {
      this.goodsobj.query = this.listKey
      console.log(this.listKey)
      this.init()
    },
    init () {
      getAllGoodsList(this.goodsobj)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.guangli {
  line-height: 45px;
}
.listgoods {
  width: 444px;
  margin-right: 15px;
}
</style>
