<template>
  <el-dialog
      ref="dialog"
      title="编辑消息"
      width="30%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model.trim="form.name" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="series" >
        <el-select v-model="form.series" clearable  placeholder="请选择模板类型" class="w-200">
          <el-option label="救援模板" value="RESCUE_TEMPLATE"></el-option>
          <el-option label="保养模板" value="MAINTENANCE_TEMPLATE"></el-option>
          <el-option label="保险模板" value="INSURANCE_TEMPLATE"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="备注" prop="">
          <el-input v-model.trim="form.remark" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" >
          <el-input v-model.trim="form.content" class="h-40 w-200" type="textarea" :rows="4"></el-input>
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
    return {
      typeOptions: [],
      form: {
        remark: null,
        name: null,
        content: null,
        series: null,
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入模板内容', trigger: 'blur' }],
        series: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/messTemplate/addOrUpdate';
  },
  methods: {
    async open(row) {
      this.id = row.id;
      this.form.remark = row.remark;
      this.form.name = row.name;
      this.form.content = row.content;
      this.form.series = row.series;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .check-group
    margin-left: -30px;
</style>
