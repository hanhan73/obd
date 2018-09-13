<template>
  <el-dialog
      ref="dialog"
      title="新增设备类型"
      width="750px"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型编码" prop="typecode">
              <el-input v-model.trim="form.typecode" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="厂商名称" prop="deviceModel">
              <el-input v-model.trim="form.deviceModel" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desctype">
              <el-input v-model.trim="form.desctype" class="h-40 w-200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-radio-group v-model="form.name">
                <el-radio label="ZY-V"></el-radio>
                <el-radio label="ZY-T"></el-radio>
                <el-radio label="ZY-M"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="设备类型" prop="devicetype">
              <el-radio-group v-model="form.devicetype">
                <el-radio label="0">GPS</el-radio>
                <el-radio label="1">OBD</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="接线类型" prop="connectedtype">
              <el-radio-group v-model="form.connectedtype">
                <el-radio label="0">有源</el-radio>
                <el-radio label="1">无源</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
      form: {
        typecode: null,
        name: null,
        desctype: null,
        devicetype: null,
        connectedtype: null,
        deviceModel: null,
      },
      rules: {
        deviceModel: [{ required: true, message: '请输入厂商名称' }],
        typeCode: [{ required: true, message: '请输入类型编码' }],
        name: [{ required: true, message: '请输入名称' }],
        desctype: [{ required: true, message: '请输入描述' }],
        devicetype: [{ required: true, message: '请选择设备类型' }],
        connectedtype: [{ required: true, message: '请选择接线类型' }],
      },
    };
  },
  beforeCreate() {
    this.name = '/device/saveOrUpdateDeviceType';
  },
  computed: {},
  methods: {
    init() {
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
