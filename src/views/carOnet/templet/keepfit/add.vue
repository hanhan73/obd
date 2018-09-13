<template>
  <el-dialog
  title="新增保养套餐"
  :visible.sync="dialogVisible"
  width="50%"
  :modal-append-to-body="false"
  center>
    <el-row>
      <el-col>模板名称：<el-input v-model="templatename" placeholder="商品名称" class="w-200" clearable></el-input></el-col>
    </el-row>
    <div style="height:400px;">
    <el-scrollbar style="height:70%">
    <el-table :data="form" style="width: 100%" size="mini" stripe>
      <el-table-column
        type="index"
        width="35px">
      </el-table-column>
      <el-table-column
      label="商品"
      width="600">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="6">
              <img
                class="g-img"
                :src="scope.row.picName"
                alt="">
            </el-col>
            <el-col :span="18">{{scope.row.name}}</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
      prop="price"
      label="价格￥"
      width="160">
      </el-table-column>
    </el-table>
    </el-scrollbar>
      <div class="" style="padding:5px;">
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
          <el-form-item label="商品" prop="picName">
            <el-upload
              class="avatar-uploader"
              accept="image/jpg, image/jpeg, image/png"
              action="http://cowtest.dtmobi.com:8001/obd/maintain/addImage/"
              :headers="he"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              name="image"
              :data="dat"
              :before-upload="beforeAvatarUpload">
              <img v-if="formInline.picName" :src="formInline.picName" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formInline.name" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="formInline.price" placeholder="价格" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-row>
        <el-col><h3>备注：<el-input v-model="remark" placeholder="请输入备注"  class="w-300" clearable></el-input></h3></el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"  @click="allSubmit">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      dialogVisible: false,
      i: null,
      form: [],
      templatename: null,
      formInline: {
        picName: null,
        name: '',
        price: '',
      },
      he: {
        Accept: 'application/json',
      },
      dat: {
        tokenId: null,
      },
      remark: null,
    };
  },
  beforeCreate() {
    this.name = '/maintain/addOrUpdateSetMeal';
  },
  methods: {
    async open() {
      this.dialogVisible = true;
      this.dat.tokenId = Lockr.get('tokenId');
    },
    onSubmit() {
      this.form.push(Object.assign({}, this.formInline));
      this.$refs.formInline.resetFields();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async allSubmit() {
      await this.apiPost(this.name,
      { productList: JSON.stringify(this.form), name: this.templatename, remark: this.remark });
      this.$message.success('提交成功！');
      this.dialogVisible = false;
      this.$emit('init');
    },
    handleAvatarSuccess(res, file) {
      this.formInline.picName = file.response.data;
      console.log(this.formInline.picName);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 108px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .g-img {
    width: 100px;
    height: 100px;
  }
</style>