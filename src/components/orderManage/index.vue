<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="订单号">
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
          <el-table-column prop="name" label="订单号"></el-table-column>
          <el-table-column prop="count" label="订单状态"></el-table-column>
          <el-table-column prop="phone" label="用户名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="phone" label="地址"></el-table-column>
          <el-table-column prop="phone" label="下单时间"></el-table-column>
          <el-table-column prop="phone" label="实收金额"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="view(scope.row)">查看</el-button>
              <el-button type="text" @click="cancel(scope.row)">取消</el-button>
              <el-button type="text" @click="send(scope.row)">派送</el-button>
              <el-button type="text" @click="over(scope.row)">完成</el-button>
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
    <el-dialog :title="title" :visible.sync="viewDialog" width="80%">
      <el-form :model="viewForm" ref="viewForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">订单号</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
            <td class="td-left">订单状态</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
          </tr>
          <tr>
            <td class="td-left">用户名</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
            <td class="td-left">手机号</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
          </tr>
          <tr>
            <td class="td-left">地址</td>
            <td class=td-right colspan="3">
              {{viewForm.name}}
            </td>
          </tr>
          <tr>
            <td class="td-left">下单时间</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
            <td class="td-left">实收金额</td>
            <td class=td-right>
              {{viewForm.name}}
            </td>
          </tr>
        </table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialog = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "orderManage",
  data(){
    return {
      searchForm: {},
      tableData: [
        {name: '张三', count: '17777777777', phone: '17777777777'},
      ],
      viewDialog: false,
      title: '',
      viewForm: {},
      currentPage: 1,
      pageSize: 10,
    }
  },
  methods:{
    doSearch(){},
    doClear(){
      this.searchForm = {}
      this.doSearch()
    },
    view(row){
      this.title = '查看'
      this.viewDialog = true
      this.viewForm = Object.assign({}, row)
    },
    send(row){},
    cancel(row){},
    over(row){},
    doForbidden(row){},
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
