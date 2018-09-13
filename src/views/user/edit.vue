<template>
  <el-dialog
      ref="dialog"
      title=""
      size="small"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>编辑后台用户</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model.trim="form.username" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="用户账户" prop="useraccount">
            <el-input v-model.trim="form.useraccount" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="userpwd">
            <el-input v-model.trim="form.userpwd" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.trim="form.mobile" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model.trim="form.email" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleid">
            <el-select v-model="form.roleid"
              clearable
              class="w-200"
              popper-class="w-200"
              placeholder="请选择用户角色">
              <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.rolename"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="tx-c m-t-20">
        <el-button class="w-100" type="primary" @click="edit()" :loading="isLoading">确定</el-button>
        <el-button class="w-100" @click="dialogVisible = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      roleOptions: [],
      form: {
        username: null,
        useraccount: null,
        userpwd: null,
        mobile: null,
        email: null,
        roleid: null,
        accounttype: null,
        // partnerid: null,
      },
      rules: {
        username: [{ required: true, message: '请输入用户姓名' }],
        useraccount: [{ required: true, message: '请输入用户账户' }],
        userpwd: [{ required: true, message: '请输入用户密码' }],
        roleid: [{ required: true, message: '请选择用户角色' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/backuser/upSecurUser';
    this.getUrl = '/backuser/qryUserInfoList';
  },
  methods: {
    init() {},
    async open(id) {
      this.id = id;
      this.dialogVisible = true;
      this.preLoading = true;
      const { data } = await this.apiPost('/role/queryList', { pageSize: 10000 });
      this.roleOptions = data;
      await this.getById();
      let backuser = Lockr.get('backuser');
      if (backuser) {
        backuser = JSON.parse(backuser);
        this.form.accounttype = backuser.accounttype;
        // this.form.partnerid = backuser.partnerid;
      }
      this.preLoading = false;
    },
    beforeAdd() {
      if (
        this.form.accounttype === 1 ||
        this.form.accounttype === 2 ||
        this.form.accounttype === 5
      ) {
        this.form.accounttype = 2;
        // this.form.partnerid = 0;
      } else {
        this.form.accounttype = 4;
      }
      return this.form;
    },
    getById() {
      return new Promise(async (resolve, reject) => {
        if (!this.id) return;
        try {
          const { data: [data] } = await this.apiPost(this.getUrl, { id: this.id });
          for (const i in this.form) {
            if (data[i] !== undefined) {
              this.form[i] = data[i];
            }
          }
          this.form.userpwd = data.password;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
