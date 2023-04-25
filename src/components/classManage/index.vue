<template>
  <div class="container">
    <el-card class="bottom-card">
      <el-button icon="el-icon-plus" type="primary" @click="doAdd" size="small">新增分类</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column prop="type" label="分类类型"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间"></el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="doEdit(scope.row)" style="width: 50px">编辑</el-button>
              <el-button type="text" @click="doDelete(scope.row)" style="width: 50px">删除</el-button>
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
    <el-dialog :title="title" :visible.sync="editDialog" width="80%">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">分类名称</td>
            <td class=td-right>
              <el-form-item prop="name" :rules="{ required: true, message: '请输入分类名称', trigger: 'blur' }">
                <el-input v-model="editForm.name" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">分类类型</td>
            <td class=td-right>
              <el-form-item prop="type" :rules="{ required: true, message: '请选择分类类型', trigger: 'blur' }">
                <el-select v-model="editForm.type" placeholder="请选择">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">排序</td>
            <td class=td-right>
              <el-form-item prop="sort" :rules="{ required: true, message: '请输入排序', trigger: 'blur' }">
                <el-input v-model="editForm.sort" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left"></td>
            <td class=td-right></td>
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
  name: "classManage",
  data(){
    return {
      typeOptions: [{label: '菜品分类', value: 1}, {label: '套餐分类', value: 2}],
      tableData: [],
      title: '',
      editDialog: false,
      editForm: {},
      currentPage: 1,
      pageSize: 10,
    }
  },
  created() {
    this.doSearch()
  },
  methods:{
    doSearch(){
      this.$http.get(`/category/getCategoryList?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.data.records
        }
      })
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
    doDelete(row){
      let target = Object.assign({} , row)
      target.isDeleted = 1
      this.$http.post('/category/update', target).then(res => {
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
            url = '/category/add'
          } else {
            url = '/category/update'
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

  .bottom-card{
    height: 100%;

    /deep/.el-card__body{
      height: 100%;

      .el-button{
        height: 32px;
        width: 100px;
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
