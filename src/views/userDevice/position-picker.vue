<template>
  <el-dialog
      ref="dialog"
      title="选择地址"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <div class="map-wrapper">
        <el-amap-search-box class="search-box" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap :vid="'amap-vue'"
                 :center="mapCenter"
                 :events="events"
                 :amap-manager="amapManager"
                 class="map"
                 >
          <el-amap-marker v-for="(marker, index) in markers"
                          :key="index"
                          :position="marker" >
          </el-amap-marker>
          <el-amap-info-window v-for="(window, index) in windows"
                               :key="index"
                               :position="window.position"
                               :content="window.content"
                               :visible="window.visible"
                               :events="window.events"
                               :offset="window.offset">
          </el-amap-info-window>
        </el-amap>
      </div>
      <div class="tx-c m-t-15">
        <el-button type="primary" :disabled="!checkPosition" @click="save">确定</el-button>
        <el-button type="" @click="dialogVisible = false">取消</el-button>
      </div>
  </el-dialog>
</template>

<script>
import VueAMap from 'vue-amap';
import http from '@/assets/js/http';

const amapManager = new VueAMap.AMapManager();

export default {
  mixins: [http],
  data() {
    const _this = this;
    return {
      amapManager,
      dialogVisible: false,
      markers: [],
      windows: [],
      mapCenter: [114.064434, 22.548724],
      position: {
        lng: null,
        lat: null,
        address: null,
      },
      events: {
        /* eslint-disable no-unused-vars */
        init(map) {
          _this.geocoder = new AMap.Geocoder();
        },
        click(mapEvents) {
          const { lnglat: { lng, lat } } = mapEvents;
          _this.setAddress({ lng, lat });
        },
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue === false) {
        this.position = {
          lng: null,
          lat: null,
          address: null,
        };
        this.markers = [];
        this.windows = [];
      }
    },
  },
  computed: {
    checkPosition() {
      const { lng, lat, address } = this.position;
      return lng !== null && lat !== null && address !== null;
    },
  },
  methods: {
    open(addressType) {
      this.addressType = addressType;
      this.dialogVisible = true;
    },
    save() {
      this.dialogVisible = false;
      this.$emit('savePosition', { position: this.position, addressType: this.addressType });
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          const { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
        });
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.setAddress(center);
      }
    },
    setAddress(center) {
      const { lng, lat } = center;
      this.geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const { regeocode: { formattedAddress } } = result;
          this.position = {
            lng,
            lat,
            address: formattedAddress,
          };
          this.markers = [[lng, lat]];
          this.windows = [
            {
              position: [lng, lat],
              offset: [0, 0],
              content: `
                经度: ${lng}
                <br />
                纬度: ${lat}
                <br />
                地址: ${formattedAddress}
              `,
              visible: true,
              events: {
                close() {
                },
              },
            },
          ];
          this.mapCenter = [lng, lat];
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .map-wrapper
    position: relative
    width: 100%
    height: 400px
    border: 1px solid #ccc
    box-sizing: border-box
    overflow: hidden
    .search-box
      position: absolute
      top: 5px
      left: 5px
    .map
      width: 100%
      height: 100%
</style>
