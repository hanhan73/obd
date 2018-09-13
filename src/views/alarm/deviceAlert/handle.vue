<template>
  <el-dialog
      ref="dialog"
      title="处理告警"
      size="tiny"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <!-- <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section> -->
    <section>
      <el-form ref="form" :model="form" :rules="rules" label-width="50px">
        <el-form-item label="备注" prop="handlecontent">
          <el-input v-model.trim="form.handlecontent" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" ></el-input>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer">
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  props: ['props'],
  mixins: [http, formMixin],
  data() {
    return {
      form: {
        devicealertid: null,
        handlecontent: null,
      },
      rules: {
        handlecontent: [{ required: true, message: '请输入备注' }],
      },
    };
  },
  beforeCreate() {
    this.name = '/deviceAlert/saveHandle';
  },
  computed: {},
  methods: {
    init() {},
    open(id) {
      this.form.devicealertid = id;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
