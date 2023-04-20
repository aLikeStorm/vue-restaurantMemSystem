<template>
  <el-container>
    <!--  头部  -->
    <el-header></el-header>
    <el-container>
      <!--  导航栏  -->
      <el-aside>
        <el-menu class="el-menu-vertical-demo"
            @select="select"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
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
        <el-card class="box-card">
          <router-view></router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "homepage",
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
    }
  }
}
</script>

<style scoped lang="less">
.el-container{
  height: 100%;

  .el-header{
    background-color: #B3C0D1;
    height: 20%;
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

    .box-card{
      height: 99%;
    }
  }
}
</style>
