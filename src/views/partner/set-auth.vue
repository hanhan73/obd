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
            <el-breadcrumb-item>单位账号</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="单位账号" prop="useraccount">
            <el-input v-model.trim="form.useraccount" :disabled="isEdit || userpwdDisabled" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userpwd">
            <el-input v-model.trim="form.userpwd" :disabled="userpwdDisabled" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="roleid">
            <el-select v-model="form.roleid"
                       :disabled="userpwdDisabled"
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
          </el-form-item>
        </el-form>
      </el-card>
      <div class="tx-c m-t-20">
        <el-button class="w-100" :disabled="userpwdDisabled" type="primary" @click="edit()" :loading="isLoading">确定</el-button>
        <el-button class="w-100" @click="dialogVisible = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      isEdit: false,
      userpwdDisabled: true,
      form: {
        id: null,
        accounttype: 3,
        useraccount: null,
        userpwd: null,
        roleid: null,
      },
      rules: {
        roleid: [{ required: true, message: '请选择角色权限' }],
      },
      // rejected_form: ['accounttype'],
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        for (const i in this._form) {
          if (this._form[i] !== undefined) {
            this.form[i] = this._form[i];
          }
        }
      }
    },
  },
  computed: {
    ...mapGetters(['roles']),
  },
  beforeCreate() {
    this.getUrl = '/backuser/qryUserInfoList';
    this.editUrl = '/backuser/upSecurUser';
    this.addUrl = '/backuser/saveSecurUserInfo';
  },
  created() {
    this._form = _.cloneDeep(this.form);
  },
  methods: {
    init() {},
    async open({ id, parentid, partnername, partnerid }) {
      this.id = id;
      this.partnername = partnername;
      this.partnerid = partnerid;
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchRoles();
      await this.getById();
      const _partnerid = parseInt(Lockr.get('partnerid'), 10);
      if (_partnerid === parentid) {
        this.userpwdDisabled = false;
      } else {
        this.userpwdDisabled = true;
      }
      this.preLoading = false;
    },
    getById() {
      return new Promise(async (resolve, reject) => {
        if (!this.id) return;
        try {
          const { data: [data] } = await this.apiPost(this.getUrl, {
            partnerid: this.id,
            accounttype: 3,
          });
          if (data) {
            this.isEdit = true;
            for (const i in this.form) {
              if (data[i] !== undefined) {
                this.form[i] = data[i];
              }
            }
            this.form.userpwd = data.password;
            resolve(data);
          } else {
            this.isEdit = false;
            resolve({});
          }
        } catch (e) {
          reject(e);
        }
      });
    },
    edit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          let form = _g.cloneJson(this.form);
          if (typeof this.beforeEdit === 'function') {
            form = this.beforeEdit();
          }
          if (this.rejected_form) {
            _(this.rejected_form).forEach(val => delete form[val]);
          }
          this.isLoading = !this.isLoading;
          try {
            if (this.isEdit) {
              delete form.accounttype;
            } else {
              delete form.id;
              form.username = this.partnername;
              form.partnerid = this.id;
            }
            await this.apiPost(this.isEdit ? this.editUrl : this.addUrl, form);
            _g.toastMsg('success', '编辑成功');
            setTimeout(() => {
              this.isLoading = !this.isLoading;
              this.goback();
              this.$emit('init');
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    ...mapActions(['fetchRoles']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
