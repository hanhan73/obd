<template>
  <el-dialog
      ref="dialog"
      :title="`${form.fenceid === null ? '新增' : '绑定'}电子围栏`"
      custom-class="w-400"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      @close="handleClose">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else class="addFenceWrapper">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="form.fenceid === null" label="围栏名称" prop="desc">
          <el-input v-model.trim="form.desc" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item v-else label="围栏类型" prop="mindType">
          <el-select v-model="form.mindType">
            <el-option :value="1" label="进围栏"></el-option>
            <el-option :value="2" label="出围栏"></el-option>
            <el-option :value="0" label="进出围栏"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [
    http,
    formMixin,
  ],
  data() {
    const form = {
      sns: null,
      fenceid: null,
      fenceType: 0,
      desc: null,
      mindType: null,
      'circle.lng': null,
      'circle.lat': null,
      'circle.redius': null,
    };
    this._resetForm = _.cloneDeep(form);
    return {
      form,
      rules: {
        desc: [{ required: true, message: '请输入围栏名称' }],
        mindType: [{ required: true, message: '请输入围栏类型' }],
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/addUserFence';
  },
  computed: {},
  methods: {
    init() {
    },
    async open({ lng, lat, radius, fenceid, sns }) {
      this.form = _.cloneDeep(this._resetForm);
      this.dialogVisible = true;
      // this.preLoading = true;
      if (fenceid && sns) {
        this.form.fenceid = fenceid;
        this.form.sns = sns;
      } else {
        this.form['circle.lng'] = lng;
        this.form['circle.lat'] = lat;
        this.form['circle.redius'] = parseInt(radius, 10);
      }
      // this.preLoading = false;
    },
    handleClose() {
      //
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  // .addFenceWrapper
  //   display: flex
  //   >div
  //     flex: 0 0 50%
</style>
