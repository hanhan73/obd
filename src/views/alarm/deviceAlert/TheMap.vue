<template>
  <el-dialog
      ref="dialog"
      custom-class="alarm-map-dialog"
      :title="`告警详情---${typename}`"
      width="60%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <el-row class="msg-list">
      <el-col :span="12">
        <p><b>设备名称:</b> {{data.devicename}}</p>
        <p><b>告警时间:</b> {{data.alerttime}}</p>
        <p><b>告警经度:</b> {{data.alertLng}}</p>
        <p><b>告警纬度:</b> {{data.alertLat}}</p>
        <p><b>告警位置:</b> {{data.address}}</p>
      </el-col>
      <el-col :span="12">
        <p><b>IMEI:</b> {{data.sn}}</p>
        <p><b>最后通讯时间:</b> {{data.communicationTime}}</p>
        <p><b>当前经度:</b> {{data.newLng}}</p>
        <p><b>当前纬度:</b> {{data.newLat}}</p>
        <p>
          <b>当前位置:</b>
          <el-button v-if="!data.$_newAddress" @click.stop="handleAnalysisAddress" size="mini" type="text">解析</el-button>
          <span v-else>{{data.$_newAddress}}</span>
        </p>
      </el-col>
    </el-row>
    <el-amap ref="amap" class="amap-box" :events="events" :vid="computedVid" v-loading="isLoading">
      <el-amap-marker
        v-for="(marker, index) in markers"
        :position="marker.position"
        :contentRender="marker.contentRender"
        :events="marker.events || {}"
        :visible="marker.visible"
        animation="AMAP_ANIMATION_DROP"
        :vid="index"
        :key="index">
      </el-amap-marker>
    </el-amap>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      typename: null,
      data: {
        sn: null,
        devicename: null,
        alerttime: null,
        communicationTime: null,
        newLat: null,
        newLng: null,
        alertLat: null,
        alertLng: null,
        address: null,
        $_newAddress: null,
      },
      events: {
        init: () => {
          this.geocoder = new AMap.Geocoder();
        },
      },
      markers: [],
      dialogVisible: false,
      tableData: [],
      isLoading: false,
    };
  },
  computed: {
    $map() {
      return this.$refs.amap.$$getInstance();
    },
    computedVid() {
      return Math.random().toString().substring(2);
    },
  },
  methods: {
    async open({ id, typename }) {
      this.clear();
      this.dialogVisible = true;
      this.isLoading = true;

      this.typename = typename;
      try {
        const { data: {
          alertLng,
          alertLat,
          newLng,
          newLat,
        }, data: $data } = await this.apiPost('/deviceAlert/getDeviceAlertDetailById', { id });
        // this.data = $data;
        for (const i in this.data) {
          if (this.data[i] !== undefined) {
            this.data[i] = $data[i];
          }
        }
        this.markers.push({
          position: [newLng, newLat],
          // zIndex: 10,
          contentRender: () => (
              <div>
                <img src="/static/images/mark_bs.png"/>
                <p class="point-desc blue" >当前地点</p>
              </div>
          ),
          visible: true,
        }, {
          position: [alertLng, alertLat],
          // zIndex: 50,
          contentRender: () => (
              <div>
                <img src="/static/images/mark_bs.png"/>
                <p class="point-desc">告警地点</p>
              </div>
          ),
          visible: true,
        });
        this.$nextTick(() => {
          const map = this.$map;
          map.setFitView(map.getAllOverlays(['marker']));
        });
      } catch (e) {
        // console.log(e);
      } finally {
        this.isLoading = false;
      }
      // this.tableData = data;
    },
    handleAnalysisAddress() {
      const { newLng, newLat } = this.data;
      this.getAddress([newLng, newLat]).then(({ regeocode: { formattedAddress } }) => {
        this.data.$_newAddress = formattedAddress;
      });
    },
    getAddress(position) {
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    },
    clear() {
      this.markers = [];
    },
  },
};
</script>

<style>
  .alarm-map-dialog .el-dialog__body {
    padding: 0px;
  }
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .amap-box
    width: 100%;
    height: 500px;

  .msg-list
    padding: 5px 20px;
    b
      font-weight: bold;

  .point-desc
    width: 56px;
    background: #fff;
    border: 1px solid red;
    padding: 0px 5px;
    &.blue
      border-color: blue;
</style>
