<template>
  <el-dialog
      ref="dialog"
      title="绑定设备详情"
      top="100px"
      custom-class="w-1000"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <div v-if="tableData.length" class="device-wrapper">
        <el-card v-for="(i, index) in tableData" :key="index">
          <el-form label-width="80px">
            <el-form-item label="电话号码:">
              {{i.simphone}}
            </el-form-item>
            <el-form-item label="在线状态:">
              <span v-if="i.isOnline" class="c-green">在线</span>
              <span v-else class="c-gray">离线</span>
            </el-form-item>
            <el-form-item label="账号名称:">
              {{i.partnername}}
            </el-form-item>
            <!-- <el-form-item label="SN:">
              {{i.sn}}
            </el-form-item> -->
            <el-form-item label="ICCID:">
              {{i.iccid}}
            </el-form-item>
            <el-form-item label="IMEI:">
              {{i.imei}}
            </el-form-item>
            <el-form-item label="电量:">
              {{i.voltage || 0}}%
            </el-form-item>
            <el-form-item label="位置:">
              <el-button v-if="!i.gpsinfo.lng || !i.gpsinfo.lat" type="text" size="mini" disabled>无定位数据</el-button>
              <el-button v-else-if="i._address === ''" type="text" size="mini" @click="handleAnalysisLngLat(index)">解析</el-button>
              <span v-else>{{i._address}}</span>
            </el-form-item>
            <el-form-item label="定位:">
              经度: {{i.gpsinfo.lng}}
              <br>
              纬度: {{i.gpsinfo.lat}}
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div v-else class="tx-c">
        没有绑定任何设备
      </div>
  </el-dialog>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      isLoading: false,
    };
  },
  computed: {},
  created() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.$_geocoder = new AMap.Geocoder();
    });
  },
  methods: {
    async open(devicelist) {
      this.dialogVisible = true;
      // this.isLoading = true;
      // const { data } = await this.apiPost('/userDevice/getVehicleDevice', { vehicleid });
      this.tableData = devicelist.map((item) => {
        item._address = '';
        return item;
      });
      this.tableData.forEach((item, index) => this.handleAnalysisLngLat(index));
      // this.isLoading = false;
    },
    getAddress(position) {
      return new Promise((resolve, reject) => {
        this.$_geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    },
    handleAnalysisLngLat(vIndex) {
      const { lng, lat } = this.tableData[vIndex].gpsinfo;
      this.getAddress([lng, lat]).then(({ regeocode: { formattedAddress } }) => {
        this.tableData[vIndex]._address = formattedAddress;
        this.tableData.splice(vIndex, 1, this.tableData[vIndex]);
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .device-wrapper
    display: flex
    overflow-x: auto
    >div
      flex: 0 0 315px
      margin-left: 5px
      &:first-child
        margin-left: 0px
</style>
