<template>
  <el-dialog
      ref="dialog"
      title="新增账号名称"
      width="750px"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="账号名称" prop="username">
          <el-input v-model.trim="form.username" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="上级单位" prop="parentid">
          <el-select v-model="form.parentid"
                      clearable
                      class="w-200"
                      popper-class="w-200"
                      placeholder="请选择上级单位">
            <el-option
              v-for="item in parentOptions"
              :key="item.id"
              :label="item.parentName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人名称" prop="linkname">
          <el-input v-model.trim="form.linkname" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="联系人号码" prop="mobile">
          <el-input v-model.trim="form.mobile" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="useraccount">
          <el-input v-model.trim="form.useraccount" class="h-40 w-200"></el-input>
          <el-alert
            style="line-height: 20px; display: inline"
            title="设置后不可更改, 中英文均可, 长度限制4-20个字符"
            type="info"
            show-icon>
          </el-alert>
        </el-form-item>
        <el-form-item label="密码" prop="userpwd">
          <el-input v-model.trim="form.userpwd" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="roleid">
          <el-select v-model="form.roleid"
                      clearable
                      class="w-200"
                      popper-class="w-200"
                      placeholder="请选择角色权限">
            <el-option
              v-for="item in computedRoles"
              :key="item.id"
              :label="item.rolename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="pid === 1 || pid === 2" label="账号类型" prop="accounttype">
          <el-radio-group v-model="form.accounttype">
            <el-radio  :label="2">运营商</el-radio>
            <el-radio  :label="3">服务商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" class="h-40 w-200"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
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
      selfRoles: [],
      isEdit: false,
      userpwdDisabled: true,
      parentOptions: [],
      pid: null,
      form: {
        parentid: null,
        linkname: null,
        linkmobile: null,
        remark: null,
        useraccount: null,
        accounttype: null,
        userpwd: null,
        roleid: null,
      },
      rules: {
        username: [{ required: true, message: '请输入账号名称' }],
        linkname: [{ required: true, message: '请输入联系人名称' }],
        mobile: [{ required: true, validator: checkMobileno }],
        roleid: [{ required: true, message: '请选择角色权限', trigger: 'change' }],
        useraccount: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
        ],
        userpwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  computed: {
    computedRoles() {
      return this.roles.concat(this.selfRoles);
    },
    ...mapGetters(['roles']),
  },
  beforeCreate() {
    this.name = '/backUser/saveOrUpdate';
  },
  methods: {
    init() {
      this.pid = Lockr.get('accounttype');
      if (this.pid !== '1' && this.pid !== '5') {
        this.form.accounttype = parseInt(Lockr.get('accounttype'), 10);
      } else {
        this.form.accounttype = 3;
      }
    },
    async open(defaultPartnerId) {
      this.dialogVisible = true;
      this.preLoading = true;
      this.form.parentid = defaultPartnerId;
      await this.fetchRoles();
      let roleid = Lockr.get('backuser').roleid;
      const rolename = Lockr.get('backuser').rolename;
      if (roleid) {
        roleid -= 0;
        this.form.roleid = roleid;
        this.selfRoles = [{
          id: roleid,
          rolename,
        }];
      }
      const parentid = parseInt(Lockr.get('partnerid'), 10);
      const { data } = await this.apiPost('/backUser/findAll', { parentid, pageSize: 10000 });
      this.parentOptions = data;
      this.preLoading = false;
    },
    afterAdd() {
      this.form.useraccount = null;
    },
    ...mapActions(['fetchRoles']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
