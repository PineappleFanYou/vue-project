<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo"></div>
           <el-menu
      :router = 'true'
      :unique-opened='true'
      default-active="2-1"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu :index="first.path" v-for="first in meunList" :key="first.id">
        <template slot="title">
          <i class="el-icon-warning"></i>
          <span>{{ first.authName }}</span>
        </template>
          <el-menu-item :index="'/home/' + second.path" v-for="second in first.children" :key="second.id">
            <template slot="title">
          <i class="el-icon-caret-bottom"></i>
          <span>{{ second.authName }}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span class="myicon el-icon-tickets toggle-btn"></span>
          <span class="system-title">电商后台管理系统</span>
          <a href="javascript:;" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// 引入接口文件
import { getLeftMeun } from '@/api/rigths_index.js'
export default {
  data () {
    return {
      meunList: []
    }
  },
  mounted () {
    getLeftMeun()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.meunList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: white;
  }
}
</style>
