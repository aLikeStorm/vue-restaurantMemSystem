<template>
  <el-container>
    <!--  头部  -->
    <el-header>
      <div class="left">
        <img src="./img/homepage-1.png"  alt="logo"/>
      </div>
      <div class="right">
        <span>你好,{{userInfo.name}}</span>
        <i class="el-icon-switch-button" @click="exit"></i>
      </div>
    </el-header>
    <el-container>
      <!--  导航栏  -->
      <el-aside>
        <el-menu class="el-menu-vertical-demo" default-active="1" @select="select" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="1">
            <i class="el-icon-user"></i>
            <span slot="title">员工管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-help"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-fork-spoon"></i>
            <span slot="title">菜品管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-dish"></i>
            <span slot="title">套餐管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--  主体  -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "homepage",
  data(){
    return {
      userInfo: {}
    }
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  },
  methods: {
    select(index) {
      if(index === '1'){
        this.$router.push('/homepage/personManage')
      } else if (index === '2') {
        this.$router.push('/homepage/classManage')
      } else if (index === '3') {
        this.$router.push('/homepage/dishManage')
      } else if (index === '4') {
        this.$router.push('/homepage/setMealManage')
      } else if (index === '5') {
        this.$router.push('/homepage/orderManage')
      }
    },
    exit(){
      this.$router.push('/')
      this.$http.post('employee/logout').then(res=>{
        if(res.status === 200){
          this.$message({
            message: res.data.data,
            type: 'success',
            center: 'true'
          });
        }else {
          this.$message({
            message: '系统错误，联系管理员',
            type: 'error',
            center: 'true'
          });
        }
      })
      localStorage.removeItem('userInfo')
    }
  }
}
</script>

<style scoped lang="less">
.el-container{
  height: 100%;

  .el-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #B3C0D1;
    height: 20%;

    .left{
      height: 70%;
      img{
        height: 100%;
      }
    }

    .right{

      span{
        font-size: 25px;
        margin-right: 20px;
      }

      i{
        font-size: 30px;
        cursor: pointer;
      }
    }

  }

  .el-aside{
    background-color: rgb(84, 92, 100);
    width: 250px !important;
    height: 100%;

    .el-menu-item{
      width: 250px;
    }
  }

  .el-main {
    background-color: #E9EEF3;
    height: 100%;
  }
}
</style>
