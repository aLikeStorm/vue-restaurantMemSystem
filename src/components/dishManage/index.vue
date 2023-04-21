<template>
  <div class="container">
    <el-card class="top-card"></el-card>
    <el-card class="bottom-card"></el-card>
  </div>
</template>

<script>
export default {
  name: "dishManage"
}
</script>

<style scoped lang="less">
.container{
  height: 100%;

  .top-card{
    height: 70px;
  }

  .bottom-card{
    margin-top: 10px;
    height: calc(100% - 70px);
  }
}
</style>
