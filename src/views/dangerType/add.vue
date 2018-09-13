<template>
  <el-dialog
      ref="dialog"
      title="新增告警类型"
      size="tiny"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="告警类型" prop="alerttypeids">
          <!-- <el-select v-model="form.alerttypeid"
                      clearable
                      class="w-200"
                      popper-class="w-200"
                      placeholder="请选择告警类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
          <el-checkbox-group v-model="form.alerttypeids" class="check-group">
            <el-checkbox v-for="item in typeOptions"
                         :key="item.id"
                         :label="item.id">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
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

export default {
  mixins: [http, formMixin],
  data() {
    return {
      typeOptions: [],
      form: {
        alerttypeids: [],
      },
      rules: {
        alerttypeids: [{ required: true, message: '请选择告警类型' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/vehicleDanger/save';
  },
  methods: {
    init() {
    },
    async open() {
      this.dialogVisible = true;
      this.preLoading = true;
      const { data } = await this.apiPost('/vehicleDanger/queryCanChoose', {});
      this.typeOptions = data;
      this.preLoading = false;
    },
    afterAdd() {
      this.form.alerttypeid = null;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .check-group
    .el-checkbox
      margin-left: 30px;
</style>
