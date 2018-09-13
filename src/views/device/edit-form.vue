<template>
  <div>
    <section v-if="preLoading" class="tx-c p-b-20">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <el-form v-else ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="devicename">
            <el-input v-model.trim="form.devicename" class="h-40 w-200" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="typeid">
            <el-select v-model="form.typeid"
                        :disabled="true"
                        class="w-200"
                        popper-class="w-200"
                        placeholder="请选择设备类型">
              <el-option
                v-for="item in deviceType"
                :key="item.id"
                :label="item.typecode"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="SN" prop="sn">
            <el-input v-model.trim="form.sn" :disabled="true" class="h-40 w-200" placeholder="请输入SN"></el-input>
          </el-form-item> -->
          <el-form-item label="电话号码" prop="simphone">
            <el-input v-model.trim="form.simphone" :disabled="true" class="h-40 w-200" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item label="ICCID" prop="iccid">
            <el-input v-model.trim="form.iccid" :disabled="true" class="h-40 w-200" placeholder="请输入ICCID"></el-input>
          </el-form-item>
          <el-form-item label="IMEI" prop="imei">
            <el-input v-model.trim="form.imei" :disabled="true" class="h-40 w-200" placeholder="请输入IMEI"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号名称" prop="backUserId">
            <!-- <el-select v-model="form.partnerid"
                        @change="handlePartneridChange"
                        class="w-200"
                        popper-class="w-200"
                        placeholder="请选择账号名称">
              <el-option
                v-for="item in partners"
                :key="item.id"
                :label="item.partnername"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-cascader
              class="w-200"
              placeholder="请选择账号名称"
              v-model="backUserId"
              :options="partnersTree"
              :props="{label: 'username', value: 'id', children: '_children'}"
              filterable
              clearable
              change-on-select
            ></el-cascader>
            <i v-show="showConfirmLoading" class="el-icon-loading"></i>
          </el-form-item>
          <template v-if="form.activetime !== ''">
            <el-form-item label="激活时间:">
              <el-input v-model="form.activetime" :disabled="true" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="服务到期时间:">
              <el-input v-model="expiretime" :disabled="true" class="h-40 w-200"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="备注:">
            <el-input v-model="form.remark" class="h-40 w-200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-show="showConfirm">
      <el-alert
        class="m-t-5 m-b-5"
        :title="`由于改变账号名称为${changePartnername}, 是否将以下设备或车辆更换为${changePartnername}?`"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-table
        :header-row-style="{ background: '#f5f7fa' }"
        v-show="vehicleData.length"
        class="m-t-5"
        :data="vehicleData">
        <el-table-column
          prop="userName"
          label="车主姓名">
        </el-table-column>
        <el-table-column
          prop="carNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="vinNumber"
          label="车架号">
        </el-table-column>
      </el-table>
      <el-table
        :header-row-style="{ background: '#f5f7fa' }"
        v-show="deviceData.length"
        class="m-t-5"
        :data="deviceData">
        <el-table-column
          prop="date"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="imei"
          label="设备IMEI">
        </el-table-column>
        <el-table-column
          prop="typecode"
          label="设备类型">
        </el-table-column>
      </el-table>
      <div class="m-t-15 tx-r">
        <el-button type="primary" @click="form.bindtype = 0;edit()" :loading="isLoading && form.bindtype === 0" :disabled="isLoading && form.bindtype === 1">确认更改</el-button>
        <el-button type="danger" @click="form.bindtype = 1;edit()" :loading="isLoading && form.bindtype === 1" :disabled="isLoading && form.bindtype === 0">不改动,解除绑定</el-button>
        <el-button @click="handleGiveUpChange">放弃更改</el-button>
      </div>
    </div>
    <div class="m-t-40 tx-r" v-show="!preLoading && !showConfirm">
      <el-button type="primary" @click="edit()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      backUserId: [],
      changePartnername: null,
      showConfirm: false,
      showConfirmLoading: false,
      vehicleData: [],
      deviceData: [],
      deviceType: [],
      form: {
        devicename: null,
        typeid: null,
        imei: null,
        sn: null,
        simphone: null,
        iccid: null,
        backUserId: null,
        vehicleid: null,
        status: null,
        activetime: null,
        remark: null,
        password: null,
        serviceLife: null,
        bindtype: null, // 0: 一同更改, 1: 解除绑定
      },
      rules: {
        devicename: [{ required: true, message: '请选择设备名称' }],
        typeid: [{ required: true, message: '请选择设备类型' }],
        imei: [{ required: true, message: '请输入IMEI' }],
        sn: [{ required: true, message: '请输入SN' }],
        simphone: [{ required: true, message: '请输入电话号码' }],
        iccid: [{ required: true, message: '请输入ICCID' }],
        backUserId: [{ required: true, message: '请选择账号名称' }],
      },
      rejected_form: ['imei', 'simphone', 'iccid', 'status', 'activetime', 'serviceLife'],
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) return;
      this.$emit('close');
    },
    backUserId(newValue) {
      let backUserId = null;
      if (newValue.length) {
        backUserId = newValue[newValue.length - 1];
      }
      this.form.backUserId = backUserId;
      // this.handlePartneridChange(partnerId);
    },
  },
  computed: {
    expiretime() {
      if (this.form.activetime !== '') {
        const year = this.form.serviceLife === '' ? 1 : this.form.serviceLife - 0;
        return moment(this.form.activetime).add(year, 'year').format('YYYY-MM-DD HH:mm:ss');
      }
      return '';
    },
    ...mapGetters(['partnersTree', 'partners']),
  },
  beforeCreate() {
    this.getUrl = '/device/getDeviceById';
    this.name = '/device/addOrUpdate';
  },
  methods: {
    async open(row) {
      await this.fetchPartners(true);
      this.showConfirm = false;
      this.form = row;
      this.id = row.id;
      this.dialogVisible = true;
      this.preLoading = true;
      // await this.fetchPartners(true);
      // await this.getById();
      // this.$emit('setVehicleId', this.form.vehicleid);
      // this.setPartnerId();
      this._partnerid = this.form.backUserId;
      const { data } = await this.apiPost('/device/findAllDeviceType', {});
      this.deviceType = data;
      this.preLoading = false;
    },
    setPartnerId() {
      const findPartner = (data) => {
        const partnerId = [];
        data.forEach((item) => {
          if (partnerId.length) return false;
          if (item.id === this.form.partnerid) {
            partnerId.push(item.id);
          } else if (item._children) {
            const temp = findPartner(item._children);
            if (temp.length) {
              partnerId.push(item.id, ...temp);
            }
          }
          return true;
        });
        return partnerId;
      };
      this.partnerid = findPartner(this.partnersTree);
    },
    afterEdit() {
      this.showConfirm = false;
    },
    async handlePartneridChange(id) {
      if (this.form.status !== 1 && id !== this._partnerid) {
        const vehicleid = this.form.vehicleid;
        this.changePartnername = this.partners[
          this.partners.findIndex(i => i.id === id)
        ].partnername;
        try {
          this.showConfirmLoading = true;
          const { data } = await this.apiPost('/vehicle/getVehicles', { id: vehicleid });
          const { data: deviceData } = await this.apiPost('/userDevice/getVehicleDevice', { vehicleid });
          this.deviceData = deviceData.filter(i => i.id !== this.id);
          this.vehicleData = data;
        } finally {
          this.showConfirm = true;
          this.showConfirmLoading = false;
        }
      } else if (id === this._partnerid) {
        this.showConfirm = false;
      }
    },
    handleGiveUpChange() {
      this.showConfirm = false;
      this.form.bindtype = null;
      this.dialogVisible = false;
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

