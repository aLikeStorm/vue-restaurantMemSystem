<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchInfo" label-width="80px" :inline="true">
        <el-form-item label="查询菜品">
          <el-input v-model="searchInfo" placeholder="请输入餐饮店名或id" size="small"></el-input>
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
            <el-table-column prop="foodId" label="菜品ID"></el-table-column>
            <el-table-column prop="ImageList[1]" label="菜品图片"></el-table-column>
            <el-table-column prop="foodName" label="菜品名"></el-table-column>
            <el-table-column prop="foodDescription" label="菜品描述"></el-table-column>
            <el-table-column prop="foodPrice" label="菜品价格(元)"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
            :total="total">
        </el-pagination>
      </el-card>
    <el-dialog :title="title" :visible.sync="editDialog" width="80%">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">名称</td>
            <td class=td-right>
              <el-form-item prop="foodName" :rules="{ required: true, message: '请输入食物名称', trigger: 'blur' }">
                <el-input v-model="editForm.foodName" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">价格(元)</td>
            <td class=td-right>
              <el-form-item prop="foodPrice" :rules="{ required: true, message: '请输入价格名称', trigger: 'blur' }">
                <el-input v-model="editForm.foodPrice" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">描述</td>
            <td class=td-right>
              <el-form-item prop="foodDescription" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                <el-input type="textarea" v-model="editForm.foodDescription" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">店铺图片</td>
            <td>
              <!-- 图片上传(支持多图) -->
              <div>
                <main-head> </main-head>
                <main-content>
                  <el-row :gutter="20">
                    <el-col :span="4">
                      <span style="font-size: 10px">宝贝卡片背景图</span>
                      <!--                      <el-image :src="src" />-->
                    </el-col>
                    <el-col :span="12">
                      <el-upload
                          class="upload-demo"
                          ref="upload"
                          action="string"
                          accept="image/jpeg,image/png,image/jpg"
                          list-type="picture-card"
                          :before-upload="onBeforeUploadImage"
                          :on-change="fileChange"
                          :on-remove="removeFile"
                          :file-list="fileList"
                          :auto-upload="false"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                          只能上传jpg/jpeg/png文件，且不超过500kb
                        </div>
                      </el-upload>

                      <el-button type="primary" plain @click="sumbit()">上传</el-button>
                    </el-col>
                  </el-row>
                </main-content>
              </div>
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
  name: "dishManage",
  data(){
    return {
      searchInfo: "",
      tableData: [
        {
          foodId: null, foodName: "null", foodDescription: "null",
          foodPrice: "", createTime: "null", imageList: []
        }],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      title: '',
      editDialog: false,
      editForm: {
        createTime: null, foodDescription: null, foodFormRest: null,
        foodId: null, foodName: null, foodPrice: null, imageList: null
      }
    }
  },
  methods:{
    //上传之前的钩子,自定义上传后，该钩子失效
    onBeforeUploadImage(file) {},
    //文件改变钩子
    fileChange(file, fileList) {
      if (this.fileArr.length > 4) {
        //写的是多图上传，但是这个模块只用到了单图，所以加个判断，多图的可以留着后面用
        this.$message.error("餐饮点信息最多只能上传四张图片");
        fileList = fileList.pop();
        return;
      }
      const isIMAGE = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt1M = file.size / 1024 / 1024/10 < 1;
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      //将文件存到数组中
      this.fileArr.push(file.raw);
    },
    //提交事件
    sumbit() {
      const formData = new FormData();
      //这一步要特别注意！！！如果直接formData.append("files",this.fileArr)，那么后端将会收不到参数，一定一定要遍历这个数组然后一个个重新append formdata中
      for (var i = 0; i < this.fileArr.length; i++) {
        formData.append("images",this.fileArr[i]);
      }
      this.$http.post("/file/uploadImages",formData).then(res=>{
        if (res.data.success){
          this.editForm.imageList = res.data.data;
          console.log(this.editForm.imageList)
        } else {
          this.$message.error(res.data.errorMsg);
        }

      })

    },
    //移除文件的钩子
    removeFile(file, fileList) {
      for (var i = 0; i < this.fileArr.length; i++) {
        //如果传入的文件uid和即将提交的图片数组中的某个uid一致，那么移除此图片
        if (file.raw.uid == this.fileArr[i].uid) {
          this.fileArr.splice(this.fileArr[i], 1);
        }
      }
    },
    doSearch(){
      //查询类型 1代表以店铺id查询，否则代表以店铺名模糊查询
      if (this.searchInfo == "") {
        this.searchInfo = 2;
      }
      let type = 1;
      if (Number(this.searchInfo).toString() == 'NaN') {
        type = 2;
      }
      let url = '/food/getFoodList/'+type
          +'/' +this.searchInfo
          +'/'+this.currentPage
          +'/'+this.pageSize;
      this.$http.get(url).then(res => {
        if (res.data.success) {
            this.tableData = res.data.data;
            this.total = res.data.total;
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
      this.searchInfo = "";
    },
    doAdd(){
      this.title = '新增'
      this.editDialog = true
      this.editForm = {};
      this.editForm.foodFormRest = this.tableData[0].foodFormRest;
    },
    doEdit(row){
      this.title = '更新'
      this.editDialog = true
      this.editForm = Object.assign({}, row)
    },
    doDelete(row) {
      this.$http.get("/food/delete/"+row.foodId).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success',
          center: 'true'
        });
        this.doSearch();
      })
    },
    save(){
      let url = ''
      if (this.title === '新增') {
        url = '/food/add'
      } else {
        url = '/food/update'
      }
      this.$http.post(url, this.editForm).then(res => {
        this.$message({
          message: res.data.data,
          type: 'success',
          center: 'true'
        });
        this.editForm = {};
        this.editDialog = false
        this.doSearch();
      })
    },
    cancel(){
      this.editForm = {};
      this.editDialog = false
    },
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

      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        margin: 10px 0;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }

      .flavorBox {
        margin: 10px 0;
        width: 90%;
      }
      .flavorBox .addBut {
        background: #ffc200;
        display: inline-block;
        padding: 0px 20px;
        border-radius: 3px;
        line-height: 40px;
        cursor: pointer;
        border-radius: 4px;
        color: #333333;
        font-weight: 500;
      }
      .flavorBox .flavor {
        border: solid 1px #dfe2e8;
        border-radius: 3px;
        padding: 15px;
        background: #fafafb;
      }
      .flavorBox .flavor .title {
        color: #606168;
      }
      .flavorBox .flavor .cont .items {
        display: flex;
        margin: 10px 0;
      }
      .flavorBox .flavor .cont .items .itTit {
        width: 150px;
        margin-right: 15px;
      }
      .flavorBox .flavor .cont .items .itTit input {
        width: 100%;
        line-height: 40px;
        border-radius: 3px;
        padding: 0 10px;
      }
      .flavorBox .flavor .cont .items .labItems {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        border-radius: 3px;
        min-height: 39px;
        border: solid 1px #d8dde3;
        background: #fff;
        padding: 0 5px;
      }
      .flavorBox .flavor .cont .items .labItems span {
        display: inline-block;
        color: #f19c59;
        margin: 5px;
        line-height: 26px;
        height: 26px;
        padding: 0 10px;
        background: #fdf4eb;
        border-radius: 3px;
        border: solid 1px #fae2cd;
      }
      .flavorBox .flavor .cont .items .labItems span i {
        cursor: pointer;
        font-style: normal;
      }
      .flavorBox .flavor .cont .items .labItems .inputBox {
        display: inline-block;
        width: 100%;
        height: 36px;
        line-height: 36px;
        overflow: hidden;
      }
      .flavorBox .flavor .cont .items .delFlavor {
        display: inline-block;
        padding: 0 10px;
        color: #f19c59;
        cursor: pointer;
      }
      .selectInput {
        position: relative;
        width: 100%;
        min-width: 100px;
      }
      .selectInput .flavorSelect {
        position: absolute;
        width: 100%;
        padding: 0 10px;
        border-radius: 3px;
        border: solid 1px #FF903D;
        line-height: 30px;
        text-align: center;
        background: #fff;
        top: 50px;
        z-index: 99;
      }
      .selectInput .flavorSelect .items {
        cursor: pointer;
        display: inline-block;
        width: 100%;
        line-height: 35px;
        border-bottom: solid 1px #f4f4f4;
        color: #666;
      }
      .selectInput .flavorSelect .none {
        font-size: 14px;
      }

      #food-add-app .uploadImg .el-form-item__label::before{
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
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
      overflow: auto;
      height: 70%;
      padding: 0;
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
}
</style>
