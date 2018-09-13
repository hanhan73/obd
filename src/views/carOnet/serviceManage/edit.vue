<template>
  <el-dialog
  title="服务商信息"
  :visible.sync="dialogVisible"
  width="28%"
  :modal-append-to-body="false"
  center>
      <div class="">
        <el-form ref="form" :model="form" :rules="rules" class="demo-form-inline">
          <el-row>
            <el-col :span="12">
              <el-form-item label="服务商" prop="name">
                <el-input v-model.trim="form.name" class="h-40 w-200" placeholder="请输入服务商名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="服务范围">
                <el-input v-model.trim="form.serviceType" class="h-40 w-200" placeholder="请输入服务范围"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="负责人">
                <el-input v-model.trim="form.chargePer" class="h-40 w-200" placeholder="请输入负责人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model.trim="form.chargePerTel" class="h-40 w-200" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="12">
                <el-form-item label="联系地址">
                  <el-input v-model.trim="form.address" class="h-40 w-200" placeholder="请输入联系地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="登录账号" prop="useraccount">
                <el-input v-model.trim="form.useraccount" class="h-40 w-200" placeholder="请输入登录账号" disabled="true"></el-input>
              </el-form-item>
            </el-col>
           </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="角色权限" prop="roleid">
                <el-select v-if="!isDisabledRoleSelect" v-model="form.roleName"
                            clearable
                            class="w-200"
                            popper-class="w-200"
                            placeholder="请选择角色权限">
                  <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.rolename"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-input v-else class="h-40 w-200" disabled v-model="rolename"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" class="h-40 w-200" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="门店">
                <el-upload
                  class="avatar-uploader"
                  accept="image/jpg, image/jpeg, image/png"
                  action="http://192.168.1.170:8001/obd/maintain/addImage/"
                  :headers="he"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  name="image"
                  :data="dat"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="form.picName" :src="form.picName" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"  @click="add()" :loading="isLoading">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    const checkMobileno = async (rule, mobileno, callback) => {
      if (!mobileno) {
        return callback(new Error('请输入车主电话'));
      }
      if (!this.$checkMobileNo(mobileno)) {
        return callback(new Error('请输入合法的手机号码'));
      }
      return callback();
    };
    return {
      dialogVisible: false,
      form: {
        picName: '',
        name: null,
        chargePer: null,
        chargePerTel: null,
        useraccount: null,
        password: null,
        serviceType: null,
        serviceProId: null,
      },
      rules: {
        name: [{ required: true, message: '请输入名称' }],
        chargePerTel: [{ validator: checkMobileno }],
        roleid: [{ required: true, message: '请选择角色权限' }],
        useraccount: [{ required: true, message: '请输入登录账号' }],
        password: [{ required: true, message: '请输入登录密码' }],
      },
      he: {
        Accept: 'application/json',
      },
      dat: {
        tokenId: null,
      },
    };
  },
  computed: {
    isDisabledRoleSelect() {
      return parseInt(Lockr.get('roleid'), 10) === this.form.roleid;
    },
    ...mapGetters(['roles']),
  },
  beforeCreate() {
    this.name = '/serviceProvider/saveOrUpdate';
  },
  methods: {
    async open(r) {
      this.form = r;
      this.dialogVisible = true;
    },
    async allSubmit() {
      await this.apiPost(this.name,
      { productList: JSON.stringify(this.form), name: this.templatename, id: this.i });
      // console.log(data);
    },
    handleAvatarSuccess(res, file) {
      this.form.picName = file.response.data;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    ...mapActions(['fetchRoles']),
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
    width: 158px;
    height: 158px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>