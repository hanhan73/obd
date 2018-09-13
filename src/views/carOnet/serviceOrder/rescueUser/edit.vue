<template>
  <el-dialog
      ref="dialog"
      title="编辑救援人员"
      width="30%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="人员姓名" prop="name">
          <el-input v-model.trim="form.name" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="form.phone" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="">
          <el-input v-model.trim="form.idcard" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="">
          <el-input v-model.trim="form.address" class="h-40 w-200"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="edit()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    const validateMobilePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('负责人手机号不可为空'));
      } else {
        if (value !== '') {
          const reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入有效的手机号码'));
          }
        }
        callback();
      }
    };
    return {
      typeOptions: [],
      form: [],
      rules: {
        name: [{ required: true, message: '请输入姓名' }],
        phone: [{ validator: validateMobilePhone, trigger: 'blur' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/aid/saveOrUpdateRescueUser';
  },
  methods: {
    init() {},
    async open(row) {
      // console.log(row);
      this.id = row.id;
      this.form = row;
      this.dialogVisible = true;
      this.preLoading = true;
      this.preLoading = false;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .check-group
    margin-left: -30px;
</style>
