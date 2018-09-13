<template>
  <el-dialog
      custom-class="w-700"
      ref="dialog"
      title="新增设备"
      size="small"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="devicename">
              <el-input v-model.trim="form.devicename" class="h-40 w-200" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="typeid">
              <el-select v-model="form.typeid"
                          clearable
                          class="w-200"
                          popper-class="w-200"
                          placeholder="请选择设备类型">
                <el-option
                  v-for="item in deviceType"
                  :key="item.id"
                  :label="item.deviceModel"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="SN" prop="sn">
              <el-input @change="val => form.imei = val" v-model.trim="form.sn" class="h-40 w-200" placeholder="请输入SN"></el-input>
            </el-form-item>
            <el-form-item label="IMEI" prop="imei">
              <el-input v-model.trim="form.imei" class="h-40 w-200" placeholder="请输入IMEI"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码" prop="simphone">
              <el-input v-model.trim="form.simphone" class="h-40 w-200" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="ICCID" prop="iccid">
              <el-input v-model.trim="form.iccid" class="h-40 w-200" placeholder="请输入ICCID"></el-input>
            </el-form-item>
            <el-form-item label="账号名称" prop="partnerid">
              <el-select v-model="form.partnerid"
                          clearable
                          class="w-200"
                          popper-class="w-200"
                          placeholder="请选择账号名称">
                <el-option
                  v-for="item in partners"
                  :key="item.id"
                  :label="item.partnername"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务年限" prop="serviceLife">
              <el-radio-group v-model="form.serviceLife" >
                <el-radio-button label="1">1年</el-radio-button>
                <el-radio-button label="2">2年</el-radio-button>
                <el-radio-button label="3">3年</el-radio-button>
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

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      deviceType: [],
      form: {
        devicename: null,
        typeid: null,
        imei: null,
        sn: null,
        simphone: null,
        iccid: null,
        partnerid: null,
        serviceLife: null,
      },
      rules: {
        devicename: [{ required: true, message: '请选择设备名称' }],
        typeid: [{ required: true, message: '请选择设备类型' }],
        imei: [{ required: true, message: '请输入IMEI' }],
        sn: [{ required: true, message: '请输入SN' }],
        simphone: [{ required: true, message: '请输入电话号码' }],
        iccid: [{ required: true, message: '请输入ICCID' }],
        partnerid: [{ required: true, message: '请选择账号名称' }],
        serviceLife: [{ required: true, message: '请选择服务年限' }],
      },
    };
  },
  computed: {
    ...mapGetters(['partners']),
  },
  beforeCreate() {
    this.name = '/device/saveOrUpdateDevice';
  },
  methods: {
    init() {
    },
    async open() {
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchPartners();
      const { data } = await this.apiPost('/devicetype/qryDevicetype', { pageSize: 10000 });
      this.deviceType = data;
      this.preLoading = false;
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
