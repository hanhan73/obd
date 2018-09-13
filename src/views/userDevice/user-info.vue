<template>
  <el-dialog
      ref="dialog"
      title="用户信息"
      custom-class="w-600"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form"
                :model="form"
                :rules="rules"
                label-width="80px"
                class="user-info-form column-2">
        <el-form-item label="用户账号: " prop="">
          {{form.mobile}}
        </el-form-item>
        <el-form-item label="用户密码: " prop="">
          {{form.password}}
        </el-form-item>
        <el-form-item label="用户姓名: " prop="">
          {{form.username}}
        </el-form-item>
        <el-form-item label="性别: " prop="">
          {{form.sex | sexFilter}}
        </el-form-item>
        <el-form-item label="身份证: " prop="">
          {{form.idcard}}
        </el-form-item>
        <el-form-item label="邮箱: " prop="">
          {{form.email}}
        </el-form-item>
      </el-form>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  filters: {
    sexFilter(sex) {
      return sex === 1 ? '男' : '女';
    },
  },
  data() {
    return {
      form: {
        mobile: null,
        password: null,
        username: null,
        sex: null,
        idcard: null,
        email: null,
      },
      rules: {
        // login_name: [{ required: true, message: '请输入登录名' }],
      },
    };
  },
  computed: {},
  methods: {
    init() {
    },
    async open(userdeviceId) {
      this.userdeviceId = userdeviceId;
      this.dialogVisible = true;
      this.preLoading = true;
      await this.getById();
      this.preLoading = false;
    },
    getById() {
      const userdeviceId = this.userdeviceId;
      return new Promise(async (resolve, reject) => {
        try {
          const { data: [data] } = await this.apiPost('/userDevice/getBindUserInfo', { userdeviceId });
          for (const i in this.form) {
            if (data[i] !== undefined) {
              this.form[i] = data[i];
            }
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .user-info-form
    .el-form-item__label
      color: #999
</style>
