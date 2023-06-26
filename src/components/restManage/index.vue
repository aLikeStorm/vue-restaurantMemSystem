<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="findInfo" label-width="80px" :inline="true">
        <el-select v-model="province" placeholder="餐饮点所在省份">
          <el-option v-for="item in provinceList" :label="item" :value="item"></el-option>
        </el-select>
        <el-select v-model="findInfo.cityCode" placeholder="餐饮点城市">
          <el-option v-for="item in choiceCity" :label="item.cityName" :value="item.cityCode" :key="item.cityCode"></el-option>
        </el-select>
        <el-select v-model="findInfo.restType" placeholder="餐饮点类型">
          <el-option v-for="item in choiceList" :label="item.typeName" :value="item.typeId" :key="item.typeId"></el-option>
        </el-select>
        <el-form-item label="餐饮店">
          <el-input v-model="findInfo.info" placeholder="请输入餐饮店名" size="small"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="doSearch" size="small">查询</el-button>
          <el-button icon="el-icon-delete" @click="doClear" size="small">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom-card">
      <el-button icon="el-icon-plus" type="primary" @click="doAdd" size="small">新增分类</el-button>
      <div class="table_area">
        <el-table :data="tableData" stripe height="600" style="width: 100%" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" border>
          <el-table-column prop="restId" label="店铺ID"></el-table-column>
          <el-table-column label="店铺图片">
            <template v-slot="scope">
              <div class="demo-image__preview" >
                <el-image
                    style="width: 100px; height: 100px"
                    :src="scope.row.imageList[0]"
                    :preview-src-list="scope.row.imageList">
                </el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="restName" label="店铺名"></el-table-column>
          <el-table-column prop="restType" label="店铺类型"></el-table-column>
          <el-table-column prop="restDescription" label="店铺描述"></el-table-column>
          <el-table-column prop="restAddress" label="店铺地址"></el-table-column>
          <el-table-column prop="restScore" label="店铺评分"></el-table-column>
          <el-table-column prop="restLikeNum" label="点赞人数"></el-table-column>
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
    <el-dialog :title="title" :visible.sync="editDialog" width="80%" heiht="100%">
      <el-form :model="editForm" ref="editForm" label-width="100px" class="demo-ruleForm">
        <table style="width: 80%;margin: 0 auto;border-collapse: collapse;">
          <tr>
            <td class="td-left">名称</td>
            <td class=td-right>
              <el-form-item prop="restName" :rules="{ required: true, message: '请输入餐饮店名称', trigger: 'blur' }">
                <el-input v-model="editForm.restName" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">类型</td>
            <td class=td-right>
              <el-select v-model="editForm.restType" placeholder="餐饮点类型">
                <el-option v-for="item in choiceList" :label="item.typeName" :value="item.typeId" :key="item.typeId"></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td class="td-left">描述</td>
            <td class=td-right>
              <el-form-item prop="restDescription" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                <el-input type="textarea" v-model="editForm.restDescription" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">地址</td>
            <td class=td-right colspan="3">
              <el-form-item prop="restAddress" :rules="{ required: true, message: '请输入地址', trigger: 'blur' }">
                <el-input v-model="editForm.restAddress" size="small" placeholder="请输入"></el-input>
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
                      <span style="font-size: 10px"></span>
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
import cityList from "../../../public/cityList";

export default {
  name: "restManage",
  data() {
    return {
      choiceList: [{typeId: 1, typeName: "川菜"}, {typeId: 2, typeName: "粤菜"}],
      fileImageUrl: "http://localhost:8081/file/uploadImages",
      tableData: [{
        createTime: "null", imageList: [], restAddress: "null", restCity: "null",
        restDescription: "null", restId: "null", restLikeNum: "null", restName: "null",
        restScore: "null", restType: "null"
      }],
      total: 0,
      title: '',
      editDialog: false,
      editForm: {restName: "", restType: 0, restDescription: "", restAddress: "", imageList: [], restId:1},
      currentPage: 1,
      pageSize: 10,
      provinceList: [],
      province: "",
      choiceCity: [{cityCode: 1, cityName: '默认', provinceName: "默认"}],
      findInfo: {
        cityCode: "默认",
        restType: "默认",
        info: ""
      },
      //文件数组
      fileArr: [],
      //页面显示的图片文件数组
      fileList: [],
      src: "",
    }
  },
  watch: {
    province: function (newVal, oldVal) {
      let cityTemp = new Set();
      for (let i = 0; i < cityList.length; i++) {
        if (cityList[i].provinceName === newVal) {
          cityTemp.add(cityList[i])
        }
      }
      this.choiceCity = Array.from(cityTemp);
    }
  },
  created() {
    let province = new Set();
    for (let i = 0; i < cityList.length; i++) {
      province.add(cityList[i].provinceName)
    }
    this.provinceList = Array.from(province);
    this.findRestType();
    this.doSearch();
  },
  methods: {
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

    doClear() {
      this.findInfo.cityCode = '默认';
      this.findInfo.restType = '默认'
      this.findInfo.info = '';
    },
    findRestType() {
      this.$http.get("/restaurants/getRestType").then(res => {
        if (res.data.success) {
          this.choiceList = res.data.data;
        } else {
          this.$message({
            message: res.data.errorMsg,
            type: 'error',
            center: 'true'
          });
        }
      })
    },
    doSearch() {
      // 默认则查找所有城市
      if (this.findInfo.cityCode === '默认') {
        this.findInfo.cityCode = 1;
      }
      if (this.findInfo.restType === '默认') {
        this.findInfo.restType = 1;
      }
      if (this.findInfo.info === null || this.findInfo.info === '') {
        this.findInfo.info = 'all'
      }
      let url = '/restaurants/findRestList/'
          + this.findInfo.cityCode + '/'
          + this.findInfo.restType + '/'
          + this.findInfo.info + '/'
          + this.currentPage + '/'
          + this.pageSize;
console.log(url);
      this.$http.get(url).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
          let restTypeMap = new Map();
          for (let i = 0; i < this.choiceList.length; i++) {
            restTypeMap.set(this.choiceList[i].typeId, this.choiceList[i].typeName);
          }
          this.choiceList
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].restScore *= 100;
            this.tableData[i].restType = restTypeMap.get(this.tableData[i].restType);
          }
          this.total = res.data.data.total
        }
      })
    },
    doAdd() {
      this.title = '新增店铺'
      this.editDialog = true
      this.editForm = {}
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    doEdit(row) {
      this.title = '更新店铺'
      this.editDialog = true
      row.imageList = [];
      this.editForm = Object.assign({}, row)
    },
    doDelete(row) {
      this.$http.post('/restaurants/delete', row.restId).then(res => {
        if (res.data.success) {
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
    save() {
      let url = ''
      if (this.title === '新增店铺') {
        url = '/restaurants/add'
      } else {
        url = '/restaurants/update'
      }
      this.$http.post(url, this.editForm).then(res => {
        if (res.data.success) {
          this.$message({
            message: res.data.data,
            type: 'success',
            center: 'true'
          });
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
    },
    cancel() {
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
    },
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

.avatar-uploader {
  margin-top: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
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
  display: flex;
}
</style>
