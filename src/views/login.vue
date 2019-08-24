<template>
  <div class="login">
      <div class="container">
          <img src="../assets/avatar.jpg" alt="" class="avatar">
              <el-form
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="demo-ruleForm"
    >
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
      </div>
  </div>
</template>
<script>
import { Login } from '@/api/login_index.js'
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  // 实现二次认证
  methods: {
    login () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // console.log('可以发送请求了')
          Login(this.loginForm)
            .then((res) => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                // 将token 存储在本地存储
                localStorage.setItem('itcast_manager_token', res.data.data.token)
                this.$router.push({ name: 'home' })
                // 弹框提示
                this.$message({
                  showClose: true,
                  message: '恭喜你，登录成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.meta.msg,
                  type: 'warning'
                })
              }
            })
            .catch(() => {
              // console.log(err)  由于我们不需要用到错误参数，所以可以不传入
              this.$message.error('服务器异常，请稍后重试')
            })
        } else {
          // console.log('失败')
          this.$message({
            message: '错了哦，请输入用户数据',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
