<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
        <el-select v-model="searchForm.type" placeholder="查询id类型">
          <el-option v-for="item in typeList" :label="item.name" :value="item.type" :key="item.type"></el-option>
        </el-select>
        <el-form-item label="查询id">
          <el-input v-model="searchForm.number" placeholder="请输入" size="small"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="doSearch" size="small">查询</el-button>
          <el-button icon="el-icon-delete" @click="doClear" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom-card">
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="cid" label="评论id"></el-table-column>
          <el-table-column prop="comment" label="评论内容"></el-table-column>
          <el-table-column prop="nickName" label="用户昵称"></el-table-column>
          <el-table-column prop="rid" label="店铺id"></el-table-column>
          <el-table-column prop="uid" label="用户id"></el-table-column>
          <el-table-column prop="commentScore" label="用户打分(5分)"></el-table-column>
          <el-table-column prop="createTime" label="优惠卷创建时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="doDelete(scope.row)">删除评论</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "commentManage",
  data(){
    return {
      searchForm: {type:3,number:"1"},
      typeList:[{type:1,name:"用户id"},{type:2,name:"店铺id"},{type:3,name:"默认全部"}],
      tableData:[{cid:"", comment:"", commentScore:"", createTime:"", nickName:"", rid:"", uid:""}],
      currentPage: 1,
      pageSize: 10,
    }
  },
  methods:{
    doDelete(row) {
      this.$http.get('/comments/delete/'+row.cid).then(res=>{
        if (res.data.success) {
          this.doSearch();
        } else {
          this.$message({
            message:res.data.errorMsg,
            type:"error",
            center:true
          })
        }
      })
    },

    doSearch(){
      if (Number(this.searchForm.number).toString() == 'NaN' || Number(this.searchForm.type).toString() == 'NaN') {
        this.$message({
          message:"查询id必须为数字",
          type:"warning",
          center:true
        });
        return;
      }
      let url = '/comments/getCommentList/'+this.searchForm.type
          +'/'+this.searchForm.number
          +'/'+this.currentPage
          +'/'+this.pageSize;
      this.$http.get(url).then(res=>{
        if (res.data.success) {
          this.tableData = res.data.data;
        } else {
          this.$message({
            message:res.data.errorMsg,
            type:"error",
            center:true
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
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

    /deep/.el-card__body{
      height: 95%;

      .el-button{
        height: 32px;
        width: 72px;
      }

      .table_area{
        margin-top: 20px;
        height: 85%;
        margin-bottom: 52px;
      }
    }
  }

  /deep/.el-dialog{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 70% !important;

    .td-left{
      width: 20%;
      height: 60px;
      text-align: right;
      padding-right: 20px;
      border: 1px solid lightgray;
      background-color: whitesmoke;
    }
    .td-right{
      width: 30%;
      text-align: left;
      padding-left: 20px;
      padding-right: 20px;
      border: 1px solid lightgray;

      .el-form-item{
        margin: 0;
        .el-form-item__content{
          margin: 0 !important;
        }
      }
    }

    .el-dialog__header{
      background-color: #409EFF;
      padding-top: 0;
      padding-bottom: 0;
      line-height: 50px;
      .el-dialog__title{
        color: white;
      }
    }

    .el-dialog__body{
      height: 70%;
      padding: 0;
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
}
</style>
