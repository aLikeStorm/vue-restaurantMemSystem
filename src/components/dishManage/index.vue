<template>
  <div class="container">
    <el-card class="top-card">
      <el-form ref="form" :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="菜品名称">
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
          <el-table-column prop="name" label="菜品名称"></el-table-column>
          <el-table-column prop="image" label="图片"></el-table-column>
          <el-table-column prop="category" label="菜品分类"></el-table-column>
          <el-table-column prop="price" label="售价"></el-table-column>
          <el-table-column prop="status" label="售卖状态"></el-table-column>
          <el-table-column prop="updateTime" label="最后操作时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" @click="doEdit(scope.row)">编辑</el-button>
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
            <td class="td-left">菜品名称</td>
            <td class=td-right>
              <el-form-item prop="name" :rules="{ required: true, message: '请输入菜品名称', trigger: 'blur' }">
                <el-input v-model="editForm.name" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left">菜品分类</td>
            <td class=td-right>
              <el-form-item prop="categoryId" :rules="{ required: true, message: '请选择菜品分类', trigger: 'change' }">
                <el-select v-model="editForm.categoryId" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">菜品价格</td>
            <td class=td-right>
              <el-form-item prop="price" :rules="{ required: true, message: '请输入菜品价格', trigger: 'blur' }">
                <el-input v-model="editForm.price" size="small" placeholder="请输入"></el-input>
              </el-form-item>
            </td>
            <td class="td-left"></td>
            <td class=td-right></td>
          </tr>
          <tr>
            <td class="td-left">口味做法配置</td>
            <td class=td-right colspan="3">
              <el-form-item>
                <div class="flavorBox">
                  <span v-if="dishFlavours.length === 0" class="addBut" @click="addFlavour"> + 添加口味</span>
                  <div v-if="dishFlavours.length !== 0" class="flavor">
                    <div class="title">
                      <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                    </div>
                    <div class="cont">
                      <div v-for="(item, index) in dishFlavours" :key="index" class="items">
                        <div class="itTit">
                          <!-- <SelectInput
                            :dish-flavors-data="dishFlavorsData"
                            :index="index"
                            :value="item.name"
                            @select="selectHandle"
                          /> -->
                          <div class="selectInput">
                            <div>
                              <el-input
                                  v-model="item.name"
                                  type="text"
                                  style="width: 100%"
                                  placeholder="请输入口味"
                                  @focus="selectFlavor(true,index)"
                                  @blur="outSelect(false,index)"
                                  @input="inputHandle(index)"
                              />
                            </div>
                            <div v-show="item.showOption" class="flavorSelect">
                          <span
                              v-for="(it, ind) in dishFlavorsData"
                              :key="ind"
                              class="items"
                              @click="checkOption(it,ind,index)"
                          >{{ it.name }}</span>
                              <span v-if="dishFlavorsData === []" class="none">无数据</span>
                            </div>
                          </div>
                        </div>
                        <div
                            class="labItems"
                            style="display: flex"
                        >
                      <span
                          v-for="(it, ind) in item.value"
                          :key="ind"
                      >{{ it }} <i @click="delFlavorLabel(index, ind)">X</i></span>
                          <div
                              class="inputBox"
                              style="flex: 1"
                              contenteditable="true"
                              @focus="flavorPosition(index)"
                              @keydown.enter="(val)=>keyDownHandle(val,index)"
                          ></div>
                        </div>
                        <span
                            class="delFlavor delBut non"
                            @click="delFlavor(index)"
                        >删除</span>
                      </div>
                    </div>
                    <div
                        class="addBut"
                        @click="addFlavour"
                    >
                      添加口味
                    </div>
                  </div>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-left">菜品照片</td>
            <td class=td-right colspan="3">
              <el-upload
                  class="avatar-uploader"
                  action="/common/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" :disabled="true">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </td>
          </tr>
          <tr>
            <td class="td-left">菜品描述</td>
            <td class=td-right colspan="3">
              <el-form-item prop="description" :rules="{ required: true, message: '请输入菜品描述', trigger: 'blur' }">
                <el-input type="textarea" v-model="editForm.description" size="small" placeholder="请输入"></el-input>
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
  name: "dishManage",
  data(){
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
      searchForm: {},
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      title: '',
      editDialog: false,
      editForm: {},
      categoryOptions: [],
      imageUrl: "",
      dishFlavours: [],
      dishFlavorsData: [],
    }
  },
  created() {
    this.$http.get(`/category/getCategoryListByType?type=1`).then(res => {
      if (res.status === 200) {
        this.categoryOptions = res.data.data
      }
    })// 口味临时数据
    this.getFlavorListHand()
  },
  methods:{
    doSearch(){},
    doClear(){},
    doAdd(){
      this.title = '新增'
      this.editDialog = true
      this.editForm = {}
      this.$nextTick(()=>{
        this.$refs.editForm.clearValidate()
      })
    },
    doEdit(){},
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
    },
    handleAvatarSuccess(res, file){
      this.editForm.image = res.data
      this.imageUrl = '/common/download?name=' + res.data
    },
    // 按钮 - 添加口味
    addFlavour () {
      this.dishFlavours.push({'name': '', 'value': [], showOption: false}) // JSON.parse(JSON.stringify(this.dishFlavorsData))
    },
    // 按钮 - 删除口味
    delFlavor (ind) {
      if(this.dishFlavours instanceof Array) {
        this.dishFlavours.splice(ind, 1)
      }
    },
    // 按钮 - 删除口味标签
    delFlavorLabel (index, ind) {
      this.dishFlavours[index].value.splice(ind, 1)
    },
    //口味位置记录
    flavorPosition (index) {
      this.index = index
    },
    // 添加口味标签
    keyDownHandle (val,index) {
      if (event) {
        event.cancelBubble = true
        event.preventDefault()
        event.stopPropagation()
      }

      if (val.target.innerText.trim() !== '') {
        this.dishFlavours[index].value.push(val.target.innerText)
        val.target.innerText = ''
      }
    },
    // 获取口味列表
    getFlavorListHand () {
      this.dishFlavorsData = [
        {'name':'甜味','value':['无糖','少糖','半糖','多糖','全糖']},
        {'name':'温度','value':['热饮','常温','去冰','少冰','多冰']},
        {'name':'忌口','value':['不要葱','不要蒜','不要香菜','不要辣']},
        {'name':'辣度','value':['不辣','微辣','中辣','重辣']}
      ]
    },
    selectFlavor(st,index){
      const obj = JSON.parse(JSON.stringify(this.dishFlavours[index]))
      obj.showOption = st
      this.dishFlavours.splice(index,1,obj)
      // this.dishFlavours[index].showOption = st
    },
    outSelect(st,index){
      const _this = this
      setTimeout(()=> {
        const obj = JSON.parse(JSON.stringify(_this.dishFlavours[index]))
        obj.showOption = st
        _this.dishFlavours.splice(index,1,obj)
      }, 200)
    },
    inputHandle(val,index){
      // this.selectFlavor(false,index)
    },
    checkOption(val, ind, index){
      this.selectHandle(val.name, index, ind)
      this.dishFlavours[index].name = val.name
    },
    selectHandle(val, key, ind){
      const arrDate = [...this.dishFlavours]
      arrDate[key] = JSON.parse(JSON.stringify(this.dishFlavorsData[ind]))
      this.dishFlavours = arrDate
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
