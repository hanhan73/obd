<template>
  <el-dialog
      custom-class="settings-dialog"
      ref="dialog"
      title=""
      size="small"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="终端参数设置" name="0">
        <active ref="active" :isonline="isonline" :deviceInfo="deviceInfo" @close="close" @init="$emit('init')" v-if="active"></active>
        <passive ref="passive" :isonline="isonline" :deviceInfo="deviceInfo" @close="close" v-else></passive>
      </el-tab-pane>
      <el-tab-pane label="设备状态" name="1">
        <span slot="label">设备状态 <i @click="search(true)" class="fa fa-refresh" :class="{ 'fa-spin': deviceStatusLoading }" aria-hidden="true"></i></span>
        <el-card class="box-card" v-for="(i, index) in resultData" :key="index">
          <div slot="header" class="clearfix">
            <h3>设备:{{i.imei}} 的状态</h3>
          </div>
          <el-form v-loading="deviceStatusLoading" style="column-count: 2" size="mini">
            <el-form-item label="设备名称:">
              {{i.typeName}}
            </el-form-item>
            <el-form-item label="设备类型:">
              {{i.devicetype === '0' ? 'GPS' : 'OBD'}}
            </el-form-item>
            <el-form-item label="是否有源:">
              {{i.connectedtype === '0' ? '有源' : '无源'}}
            </el-form-item>
            <el-form-item label="IMEI号:">
              {{i.imei}}
            </el-form-item>
            <el-form-item label="SN:">
              {{i.sn}}
            </el-form-item>
            <el-form-item label="设备状态:">
              {{i.useStatus === '1' ? '未使用' : '已使用'}}
            </el-form-item>
            <el-form-item label="电话卡号码:">
              {{i.simphone}}
            </el-form-item>
            <el-form-item label="账号名称ID:">
              {{i.partnername}}
            </el-form-item>
            <el-form-item label="设备激活时间:">
              {{i.activetime}}
            </el-form-item>
            <el-form-item label="安放位置:">
              {{i.position}}
            </el-form-item>
            <el-form-item label="安装备注:">
              {{i.remark}}
            </el-form-item>
            <el-form-item label="设备绑定车辆时间:">
              {{i.dvBindTime}}
            </el-form-item>
            <el-form-item label="车架号:">
              {{i.vinnumber}}
            </el-form-item>
            <el-form-item label="车牌号:">
              {{i.carnumber}}
            </el-form-item>
            <el-form-item label="最新定位时间:">
              {{i.gpstime}}
            </el-form-item>
            <el-form-item label="最新连接时间:">
              {{i.connecttime}}
            </el-form-item>
            <el-form-item label="定位是否有效:">
              {{i.isValid === 'A' ? '有效' : '无效'}}
            </el-form-item>
            <el-form-item label="经度:">
              {{i.lng}}
            </el-form-item>
            <el-form-item label="纬度:">
              {{i.lat}}
            </el-form-item>
            <el-form-item label="是否在线:">
              {{i.onlie ? '在线' : '离线'}}
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';

import Active from './active';
import Passive from './passive';

export default {
  mixins: [http],
  data() {
    return {
      dialogVisible: false,
      active: true,
      isonline: false,
      activeName: '0',
      resultData: [],
      deviceStatusLoading: false,
      disabledSend: false,
      deviceInfo: {
        id: null,
        sn: null,
        lng: null,
        lat: null,
        isActive: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/addUserFence';
  },
  computed: {
  },
  methods: {
    open(isActive, sn, lng, lat, isonline, id) {
      this.dialogVisible = true;
      this.active = isActive;
      this.isonline = isonline;
      this.activeName = '0';
      this.deviceInfo = {
        id,
        sn,
        lng,
        lat,
        isActive,
      };
      this.$nextTick(() => {
        if (this.active) {
          this.$refs.active.init();
        } else {
          this.$refs.passive.init();
        }
      });
    },
    close() {
      this.dialogVisible = false;
    },
    async onSubmit() {
      this.isLoading = true;
      if (this.active) {
        await this.$refs.active.submit(this.deviceInfo);
      } else {
        await this.$refs.passive.submit(this.deviceInfo);
      }
      this.isLoading = false;
    },
    handleTabClick({ name }) {
      if (name === '1') {
        this.search();
      }
    },
    async search(isForce) {
      const { sn } = this.deviceInfo;
      if (sn === this._lastSearchSn && !isForce) return;
      try {
        this.deviceStatusLoading = true;
        const { data } = await this.apiPost('/device/getDeviceStatus', { sn });
        this.resultData = [data];
        this._lastSearchSn = sn;
      } finally {
        setTimeout(() => {
          this.deviceStatusLoading = false;
        }, 500);
      }
    },
  },
  components: {
    Active,
    Passive,
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .settings-dialog
    .el-dialog__body
      padding-top: 0px
      padding-bottom: 15px
</style>
