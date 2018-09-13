<template>
  <el-dialog
      ref="dialog"
      title="新增角色"
      width="30%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model.trim="form.rolename" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="">
          <el-input v-model.trim="form.roledesc" class="h-40 w-200"></el-input>
        </el-form-item>
        <!-- <el-form-item label="警情类型设置" prop="">
          <el-checkbox-group v-model="form.alertTypeIds" class="check-group">
            <el-checkbox v-for="item in typeOptions"
                         :key="item.id"
                         :label="item.id">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
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
        rolename: null,
        roledesc: null,
        alertTypeIds: [],
      },
      rules: {
        rolename: [{ required: true, message: '请输入角色名' }],
        // roledesc: [{ required: true, message: '请输入描述' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/roleMenu/addOrUpdateRole';
  },
  methods: {
    async init() {
      // const { data } = await this.apiPost('/deviceAlert/api/queryTypes', {});
      // this.typeOptions = data;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .check-group
    margin-left: -30px;
</style>
