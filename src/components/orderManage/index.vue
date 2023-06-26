<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
        <el-select v-model="searchForm.type" placeholder="查询id类型">
          <el-option v-for="item in typeList" :label="item.name" :value="item.type" :key="item.type"></el-option>
        </el-select>
        <el-form-item label="查询信息">
          <el-input v-model="searchForm.number" placeholder="请输入" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="doSearch" size="small">查询</el-button>
          <el-button icon="el-icon-delete" @click="doClear" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom-card">
      <el-button icon="el-icon-plus" type="primary" @click="doAdd" size="small">新增</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="couponOrder" label="订单号"></el-table-column>
          <el-table-column prop="couponName" label="优惠卷名"></el-table-column>
          <el-table-column prop="orderCouId" label="优惠卷Id"></el-table-column>
          <el-table-column prop="orderUserId" label="优惠卷Id"></el-table-column>
          <el-table-column prop="restName" label="餐饮店名"></el-table-column>
          <el-table-column prop="beginTime" label="活动开启时间"></el-table-column>
          <el-table-column prop="endTime" label="活动截止时间"></el-table-column>
          <el-table-column prop="createTime" label="优惠卷创建时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="view(scope.row)">查看详情</el-button>
              <el-button type="text" @click="doDelete(scope.row)">删除订单</el-button>
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

    <el-dialog title="添加订单" :visible.sync="editDialog" width="80%">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">优惠卷id</td>
            <td class=td-right>
              <el-form-item prop="orderCouId" :rules="{ required: true, message: '请输入优惠卷Id', trigger: 'blur' }">
                <el-input v-model="editForm.orderCouId" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <el-select v-model="orderChooseUser" placeholder="选择下单用户">
              <el-option v-for="item in ChooseList" :label="item.name" :value="item.type" :key="item.type"></el-option>
            </el-select>
          </tr>
            <tr v-if="orderChooseUser == 2">
            <td class="td-left">用户Id</td>
            <td class=td-right>
              <el-form-item prop="orderUserId" :rules="{ required: true, message: '请输入用户Id', trigger: 'blur' }">
                <el-input v-model="editForm.orderUserId" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="save" size="small">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="viewDialog" width="80%">
      <el-form :model="viewForm" ref="viewForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">订单号</td>
            <td class=td-right>
              {{viewForm.couponOrder}}
            </td>
            <td class="td-left">优惠卷Id</td>
            <td class=td-right>
              {{viewForm.orderCouId}}
            </td>
          </tr>
          <tr>
            <td class="td-left">店铺名</td>
            <td class=td-right>
              {{viewForm.restName}}
            </td>
            <td class="td-left">店铺地址</td>
            <td class=td-right>
              {{viewForm.restAddress}}
            </td>
          </tr>
          <tr>
            <td class="td-left">店铺类型</td>
            <td class=td-right>
              {{viewForm.restType}}
            </td>
            <td class="td-left">店铺描述</td>
            <td class=td-right>
              {{viewForm.restDescription}}
            </td>

          </tr>
          <tr>
            <td class="td-left">优惠卷名</td>
            <td class=td-right>
              {{viewForm.couponName}}
            </td>
            <td class="td-left">优惠金额(元)</td>
            <td class=td-right>
              {{viewForm.couponAmount}}
            </td>
          </tr>
          <tr>
            <td class="td-left">用户Id</td>
            <td class=td-right>
              {{viewForm.orderUserId}}
            </td>
            <td class="td-left">用户名</td>
            <td class=td-right>
              {{viewForm.nickName}}
            </td>
          </tr>
          <tr>
            <td class="td-left">用户邮箱</td>
            <td class=td-right>
              {{viewForm.email}}
            </td>
            <td class="td-left">用户地址</td>
            <td class=td-right>
              {{viewForm.userAddress}}
            </td>
          </tr>
          <tr>
            <td class="td-left">活动开始时间</td>
            <td class=td-right>
              {{viewForm.beginTime}}
            </td>
            <td class="td-left">活动截止时间</td>
            <td class=td-right>
              {{viewForm.endTime}}
            </td>
          </tr>
          <tr>
            <td class="td-left">下单时间</td>
            <td class=td-right>
              {{viewForm.createTime}}
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
      searchForm: {type:3,number:""},
      typeList:[{type:1,name:"用户id"},{type:2,name:"店铺id"},{type: 3,name:"订单id"}],
      ChooseList:[{type:1,"name":"为自己下单"},{type:2,name:"给指定用户下单"}],
      orderChooseUser:1,
      tableData:[{
        couponOrder: "",
        couponName: "",
        orderCouId: "",
        orderUserId: "",
        restName: "",
        beginTime: "",
        endTime: "",
        createTime: ""
      }],
      viewDialog: false,
      title: '',
      viewForm: {beginTime:"", couponAmount:"", couponName:"", couponOrder:"",
       createTime:"", email:"", endTime:"", nickName:"", orderCouId:"",
      orderUserId:"", restAddress:"", restDescription:"", restName:"", restType:"", userAddress:""},
      currentPage: 1,
      pageSize: 10,
      editForm: {
        orderCouId:1,
        orderUserId:1,
        type: 1,
      },
      editDialog:false
    }
  },
  methods:{
    doAdd(){
      this.editDialog = true;
    },
    doDelete(row) {
      this.$http.get('/order/delete/'+row.couponOrder).then(res=>{
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
      let url = '/order/getOrderList/'+this.searchForm.type
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
    doClear(){
      this.searchForm = {}
    },
    view(row){
      this.title = '查看'

      this.$http.get("/order/getDetail/"+row.couponOrder).then(res=>{
        if (res.data.success) {
          this.viewForm = res.data.data;
          this.viewDialog = true
        } else {
          this.$message({
            message:res.data.errorMsg,
            type:"error",
            center:true
          })
        }
      })

    },
    save(){
      if (Number(this.editForm.orderCouId).toString() == 'NaN' || Number(this.editForm.orderUserId).toString() == 'NaN') {
        this.$message({
          message:"查询id必须为数字",
          type:"warning",
          center:true
        })
        return;
      }
      this.editForm.type = this.orderChooseUser;
      this.$http.post("/order/place",this.editForm).then(res=>{
        if (res.data.success) {
          this.$message({
            message:"下单成功，查询试试",
            type:"success",
            center:true
          })
        } else {
          this.$message({
            message:res.data.errorMsg,
            type:"error",
            center:true
          })
        }
      })
    },
    cancel(){
      this.editForm ={};
      this.editDialog = false;
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
