<template>
  <div class="container">
    <div class="box">
      <div class="left"></div>
      <div class="right">
        <div class="login-box">
          <img src="./img/login-2.png"  alt="logo"/>
          <div class="user common">
            <el-input class="input" placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="username" clearable></el-input>
          </div>
          <div class="pwd common">
            <el-input class="input" placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" clearable type="password"></el-input>
          </div>
          <el-button type="warning" round style="width: 90%" @click="login">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import baseUrl from '../../../public/global.js'
export default {
  name: "login",
  data(){
    return {
      username: '',
      password: '',
    }
  },
  methods:{
    login(){
      // 用户名或密码为空
      if (this.username === '' || this.password === '') {
        this.$message({
          message: '请输入用户名或密码',
          type: 'warning',
          center: 'true'
        });
      }
      // this.$http.post(baseUrl + 'loginController/login', {username: this.username, password: this.password}).then(res=>{
      //   console.log(res)
      // })
      if (this.username === '1' && this.password === '2') {
        this.$router.push('/homepage')
      }
    }
  }
}
</script>

<style scoped lang="less">
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #302c31;
  width: 100%;
  height: 100%;

  .box{
    height: 60%;
    width: 70%;
    border-radius: 5px;

    .left{
      float: left;
      height: 100%;
      width: 60%;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background-image: url("./img/login-1.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .right{
      display: flex;
      justify-content: center;
      align-items: center;
      float: right;
      height: 100%;
      width: 40%;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      background-color: white;

      .login-box{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 60%;
        height: 70%;

        img{
          width: 60%;
          height: 14%;
        }

        .common{
          width: 90%;
          height: 10%;

          .input /deep/ .el-input__inner {
            border-top: 0;
            border-left: 0;
            border-right: 0;
          }

          .input /deep/ .el-input__prefix .el-input__icon:before{
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
