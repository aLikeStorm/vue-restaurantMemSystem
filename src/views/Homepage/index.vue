<template>
  <el-container>
    <!--  头部  -->
    <el-header>
      <div class="left">
        <img src="./img/homepage-1.png" alt="logo"/>
      </div>
      <div class="right">
        <span>你好,{{ user.nickName }}</span>
        <i class="el-icon-switch-button" @click="exit"></i>
      </div>
    </el-header>
    <el-container>
      <!--  导航栏  -->
      <el-aside>
        <el-menu class="el-menu-vertical-demo" default-active="1" @select="select" background-color="#545c64"
                 text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item :index="1">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item :index="2">
            <i class="el-icon-help"></i>
            <span slot="title">餐饮点管理</span>
          </el-menu-item>
          <el-menu-item :index="3">
            <i class="el-icon-fork-spoon"></i>
            <span slot="title">菜品管理</span>
          </el-menu-item>
          <el-menu-item :index="4">
            <i class="el-icon-dish"></i>
            <span slot="title">优惠卷管理</span>
          </el-menu-item>
          <el-menu-item :index="5">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item :index="6">
            <i class="el-icon-document"></i>
            <span slot="title">评论管理</span>
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
  name: "HomePage",
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.$http.get("/user").then(res => {
      if (res.data.success) {

        this.user = res.data.data;
        localStorage.setItem("user", this.user);
      } else {
        this.$message({
          message: res.data.errorMsg,
          type: 'error',
          center: 'true'
        });
      }
    })
  },
  methods: {
    select(index) {
      switch (index) {
        case 1:
          this.$router.push('/homepage/personManage');
          break;
        case 2:
          this.$router.push('/homepage/restManage');
          break;
        case 3:
          this.$router.push('/homepage/dishManage');
          break;
        case 4:
          this.$router.push('/homepage/couponManage');
          break;
        case 5:
          this.$router.push('/homepage/orderManage');
          break;
        case 6:
          this.$router.push('/homepage/commentManage');
          break;
      }
    },
    exit() {
      this.$router.push('/')
      localStorage.removeItem('authorization')
    }
  }
}
</script>

<style scoped lang="less">
.el-container {
  height: 100%;

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #B3C0D1;
    height: 20%;

    .left {
      height: 70%;

      img {
        height: 100%;
      }
    }

    .right {

      span {
        font-size: 25px;
        margin-right: 20px;
      }

      i {
        font-size: 30px;
        cursor: pointer;
      }
    }

  }

  .el-aside {
    background-color: rgb(84, 92, 100);
    width: 250px !important;
    height: 100%;

    .el-menu-item {
      width: 250px;
    }
  }

  .el-main {
    background-color: #E9EEF3;
    height: 100%;
  }
}
</style>
