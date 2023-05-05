<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="员工姓名">
          <el-input v-model="searchForm.name" placeholder="请输入" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="doSearch" size="small">查询</el-button>
          <el-button icon="el-icon-delete" @click="doClear" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom-card">
      <el-button v-if="userInfo.id === '1'" icon="el-icon-plus" type="primary" @click="doAdd" size="small">新增</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="name" label="员工姓名"></el-table-column>
          <el-table-column prop="username" label="账号"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 1 ? "正常" : "禁用"}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="doEdit(scope.row)">编辑</el-button>
              <template v-if="userInfo.id === '1'">
                <el-button type="text" v-if="scope.row.status === 0" @click="statusChange(scope.row)">启用</el-button>
                <el-button type="text" v-if="scope.row.status === 1" @click="statusChange(scope.row)">禁用</el-button>
              </template>
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
            <td class="td-left">员工姓名</td>
            <td class=td-right>
              <el-form-item prop="name" :rules="{ required: true, message: '请输入员工姓名', trigger: 'blur' }">
                <el-input v-model="editForm.name" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">账号</td>
            <td class=td-right>
              <el-form-item prop="username" :rules="{ required: true, message: '请输入账号', trigger: 'blur' }">
                <el-input v-model="editForm.username" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">手机号</td>
            <td class=td-right>
              <el-form-item prop="phone" :rules="{ required: true, message: '请输入手机号', trigger: 'blur' }">
                <el-input v-model="editForm.phone" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">性别</td>
            <td class=td-right>
              <el-form-item prop="sex" :rules="{ required: true, message: '请选择性别', trigger: 'change' }">
                <el-select v-model="editForm.sex" placeholder="请选择">
                  <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">身份证号</td>
            <td class=td-right colspan="3">
              <el-form-item prop="idNumber" :rules="{ required: true, message: '请输入身份证号', trigger: 'blur' }">
                <el-input v-model="editForm.idNumber" size="small" placeholder="请输入"></el-input>
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
      searchForm: {},
      tableData: [],
      total: 0,
      editDialog: false,
      title: '',
      editForm: {},
      sexOptions:[
        {label: '男', value: '1'},
        {label: '女', value: '0'}
      ],
      currentPage: 1,
      pageSize: 10,
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  created() {
    this.doSearch()
  },
  methods:{
    doSearch(){
      this.$http.get(`/employee/getEmployeeList?name=${this.searchForm.name ? this.searchForm.name : ''}&currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        }
      })
    },
    doClear(){
      this.searchForm = {}
      this.doSearch()
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
    statusChange(row){
      if (row.status === 1){
        row.status = 0
      } else {
        row.status = 1
      }
      this.$http.post('/employee/update', row).then(res => {
        if(res.status === 200){
          if (res.data.code === 1){
            this.$message({
              message: res.data.data,
              type: 'success',
              center: 'true'
            });
            this.editDialog = false
            this.doSearch()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error',
              center: 'true'
            });
          }
        } else {
          this.$message({
            message: '系统错误，联系管理员',
            type: 'error',
            center: 'true'
          });
        }
      })
    },
    save(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let url = ''
          if (this.title === '新增') {
            url = '/employee/register'
          } else {
            url = '/employee/update'
          }
          this.$http.post(url, this.editForm).then(res => {
            if(res.status === 200){
              if (res.data.code === 1){
                this.$message({
                  message: res.data.data,
                  type: 'success',
                  center: 'true'
                });
                this.editDialog = false
                this.doSearch()
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error',
                  center: 'true'
                });
              }
            } else {
              this.$message({
                message: '系统错误，联系管理员',
                type: 'error',
                center: 'true'
              });
            }
          })
        }
      });
    },
    cancel(){
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
