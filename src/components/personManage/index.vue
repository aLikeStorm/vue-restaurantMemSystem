<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchInfo" label-width="80px" :inline="true">
        <el-form-item label="用户查询">
          <el-input v-model="searchInfo" placeholder="请输入用户名或邮箱" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="doSearch" size="small">查询</el-button>
          <el-button icon="el-icon-delete" @click="doClear" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom-card">
      <el-button  icon="el-icon-plus" type="primary" @click="doAdd" size="small">新增</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="userId" label="用户id"></el-table-column>
          <el-table-column prop="nickName" label="用户昵称"></el-table-column>
          <el-table-column prop="email" label="邮箱地址"></el-table-column>
          <el-table-column prop="userAddress" label="用户地址"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="doEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="doDelete (scope.row)">删除</el-button>
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
          :total="total">
      </el-pagination>
    </el-card>
    <el-dialog :title="title" :visible.sync="editDialog" width="80%">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">用户昵称</td>
            <td class=td-right>
              <el-form-item prop="nickName" :rules="{ required: true, message: '请输入用户昵称', trigger: 'blur' }">
                <el-input v-model="editForm.nickName" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">邮箱</td>
            <td class=td-right>
              <el-form-item prop="email" :rules="{ required: true, message: '请输入邮箱地址', trigger: 'blur' }">
                <el-input v-model="editForm.email" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">密码</td>
            <td class=td-right>
              <el-form-item prop="password" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
                <el-input type="password" v-model="editForm.password" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">确认密码</td>
            <td class=td-right>
              <el-form-item prop="password" :rules="{ required: true, message: '请确认密码', trigger: 'blur' }">
                <el-input type="password" v-model="confirmPassword" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">地址</td>
            <td class=td-right colspan="3">
              <el-form-item prop="userAddress" :rules="{ required: true, message: '请输入地址', trigger: 'blur' }">
                <el-input v-model="editForm.userAddress" size="small" placeholder="请输入"></el-input>
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
  </div>
</template>

<script>
export default {
  name: "personManage",
  data(){
    return {
      searchInfo: '',
      tableData: [],
      total: 0,
      editDialog: false,
      title: '',
      editForm: {userId:null,nickName:"",email:"",userAddress:"",password:""},
      currentPage: 1,
      pageSize: 10,
      user: localStorage.getItem("user"),
      confirmPassword:""
    }
  },
  created() {
    this.doSearch()
  },
  methods:{
    doSearch(){
      let url;
      if (this.searchInfo === null || this.searchInfo === '') {
        url = '/user/getUserList/默认/' + this.currentPage + '/' + this.pageSize
      }else {
        url = '/user/getUserList/'+this.searchInfo+'/' + this.currentPage + '/' + this.pageSize
      }

      this.$http.get(url).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
          this.total = res.data.data.total
        } else {
          this.$message({
            message: res.data.errorMsg,
            type: 'error',
            center: 'true'
          });
        }
      })
    },
    doClear(){
      this.confirmPassword = "";
      this.tableData = null;
    },
    doAdd(){
      this.title = '新增'
      this.editDialog = true
      this.editForm = {}
      this.$nextTick(()=>{
        this.$refs.editForm.clearValidate()
      })
    },
    doEdit(row){
      this.title = '更新'
      this.editDialog = true
      this.editForm = Object.assign({}, row)
    },
    doDelete(row) {
      this.$http.get("/user/delete/"+row.userId).then(res=>{
        if(res.data.success){
          this.$message({
            message: res.data.data,
            type: 'success',
            center: 'true'
          });
          this.doSearch();
        } else {
          this.$message({
            message: res.data.errorMsg,
            type: 'error',
            center: 'true'
          });
        }
      })
    },
    save(){
      this.$refs.editForm.validate((valid) => {
        if (this.editForm.password !== this.confirmPassword) {
          this.$message({
            message: "密码不一致",
            type: 'success',
            center: 'true'
          });
          this.confirmPassword = "";
          return;
        }
        if (valid) {
          let url = ''
          if (this.title === '新增') {
            url = '/user/register'
          } else {
            url = '/user/update'
          }
          this.$http.post(url, this.editForm).then(res => {
            if(res.data.success){
              this.$message({
                message: res.data.data,
                type: 'success',
                center: 'true'
              });
              this.confirmPassword = "";
              this.editForm = {};
              this.editDialog = false;
              this.doSearch();
            } else {
                this.$message({
                  message: res.data.errorMsg,
                  type: 'error',
                  center: 'true'
                });
            }
          })
        }
      });
    },
    cancel(){
      this.confirmPassword = "";
      this.editForm = {};
      this.editDialog = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.doSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.doSearch()
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
        margin-bottom: 20px;
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
