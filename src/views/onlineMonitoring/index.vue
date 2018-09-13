<template>
  <div class="onlineMonitoring-wrapper ovf-hd">
    <div class="map">
      <a class="panorama-tool" :class="{ 'c-blue': showPanorama }" @click="onPanoramaToolClick"><svg-icon icon-class="panorama"></svg-icon> 全景</a>
      <el-amap  vid="onlineMonitoring"
                :events="events"
                :plugin="plugin"
                :animateEnable="false"
                :resizeEnable="false"
                :jogEnable="false"
                ref="amap"
                class="ovf-hd"
                >
        <el-amap-marker v-for="(marker, index) in markers"
                        :key="'marker' + index"
                        :position="marker.position"
                        :animation="marker.animation"
                        :icon="marker.icon"
                        :template="marker.template || ''"
                        :offset="marker.offset ? marker.offset : [-10,-34]"
                        :angle="marker.angle"
                        :title="marker.title"
                        :events="marker.events"
                        :extData="marker.extData"
                        :visible="marker.visible"
                        :draggable="marker.draggable">
        </el-amap-marker>
        <el-amap-info-window v-for="(window, index) in windows"
                              :key="'window' + index"
                              :bubble="false"
                              :size="window.size"
                              :isCustom="window.isCustom"
                              :position="window.position"
                              :content="window.content"
                              :template="window.template"
                              :visible="window.visible"
                              :offset="window.offset || [0, 0]"
                              :autoMove="window.autoMove || false"
                              :events="window.events || {}">
        </el-amap-info-window>
        <el-amap-circle v-for="(circle, index) in circles"
                        :key="index"
                        :strokeColor="'#1791fc'"
                        :strokeOpacity="0.8"
                        :strokeWeight="2"
                        :fillColor="'#1791fc'"
                        :fillOpacity="0.35"
                        :center="circle.center"
                        :radius="circle.radius">
        </el-amap-circle>
        <el-amap-polygon v-for="(polygon, index) in polygons"
                          :key="index"
                          :vid="index"
                          :path="polygon.path"
                          :strokeColor="'#1791fc'"
                          :strokeOpacity="0.8"
                          :strokeWeight="2"
                          :fillColor="'#1791fc'"
                          :fillOpacity="0.35">
        </el-amap-polygon>
        <el-amap-polyline :editable="polyline.editable"
                          :path="polyline.path"
                          :events="polyline.events">
        </el-amap-polyline>
      </el-amap>
    </div>
    <div class="table">
      <div class="shrink-top" @click="monitorBottomShrink = !monitorBottomShrink"><i :class="`el-icon-arrow-${monitorBottomShrink ? 'up' : 'down'}`"></i></div>
      <div id="trackBottom" :style="{ 'height': monitorBottomShrink ? '0px' : '150px' }">
        <el-table size="mini" class="w-100p h-100p" height="auto" :data="tableData" ref="table" highlight-current-row>
          <el-table-column width="150" property="devicename" label="设备名称"></el-table-column>
          <el-table-column width="130" property="imei" label="IMEI"></el-table-column>
          <el-table-column width="85" :formatter="({ locationType }) => locationTypeMap[locationType]" label="定位方式"></el-table-column>
          <el-table-column width="170" property="gpstime" label="定位时间"></el-table-column>
          <el-table-column width="100" label="速度" :formatter="({ speed }) => `${speed} km/h`"></el-table-column>
          <el-table-column show-overflow-tooltip property="address" label="位置"></el-table-column>
          <el-table-column width="100" label="状态">
            <template slot-scope="{ row: { status } }">
              <el-tag v-if="status !== '0'" size="mini" type="success">行驶中</el-tag>
              <el-tag v-else size="mini" type="danger">停驶</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <panorama v-show="showPanorama" ref="panorama" class="panorama"></panorama>
  </div>
</template>

<script>
// import Vue from 'vue';
import $ from 'jquery';
import 'static/jq-resizable/jquery-ui.min';
import 'static/jq-resizable/jquery-ui.structure.min.css';
import Panorama from 'views/panorama/index';// 全景地图

import { locationTypeMap } from '@/assets/js/config';
import http from '@/assets/js/http';

export default {
  mixins: [http],
  components: {
    Panorama,
  },
  data() {
    return {
      locationTypeMap,
      showPanorama: false,
      monitorBottomShrink: false,
      tableData: [],
      polyline: {
        path: [],
        editable: false,
        events: {},
      },
      polygons: [],
      circles: [],
      windows: [],
      markers: [],
      monitoringInfo: {
        carnumber: null,
        imei: null,
      },
      events: {
        init: () => {
          this.geocoder = new AMap.Geocoder();
          this.init();
        },
      },
      plugin: [
        'ToolBar',
        'RangingTool',
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init() {
              //
            },
          },
        },
      ],
    };
  },
  computed: {
    $map() {
      return this.$refs.amap.$$getInstance();
    },
  },
  mounted() {
    $('#trackBottom').resizable({
      handles: 'n',
      minHeight: 150,
      helper: 'ui-resizable-helper-top',
      stop: (event, { element, size }) => {
        element[0].style.height = `${size.height}px`;
      },
    });
  },
  methods: {
    init() {
      const { position: pos, carnumber, sn } = this.$route.query;
      const position = pos.split(',');
      this.markers.push(
        ...[
          {
            position,
            name: '起点',
            angle: 0,
            offset: [-18, -48],
            template: '<img src="/static/images/point_start.png"/>',
            animation: 'AMAP_ANIMATION_DROP',
          },
          {
            sn,
            position,
            name: 'other',
            angle: 90,
            template: '<img src="/static/images/car_navig.png"/>',
            animation: 'AMAP_ANIMATION_NONE',
          },
        ],
      );
      this.polyline.path.push(position); // 设置轨迹折线
      this.windows.push({
        title: 'other',
        position,
        visible: true,
        size: new AMap.Size(170, 65),
        template: `
          <section class="info-windows mini">
            <h1 class="txt-ovf-ellipsis">
              <a title="${carnumber}">${carnumber}</a><a></a>
            </h1>
            <p>
              <a>IMEI:</a> <a>${sn}</a>
            </p>
          </section>`,
      });
      this.$map.setCenter(position);
      this.handleRealTimeMonitoring(sn);
    },
    calcAngle(start, end) {
      const map = this.$map;
      const pStart = map.lngLatToContainer(start);
      const pEnd = map.lngLatToContainer(end);
      const diffX = pEnd.x - pStart.x;
      const diffY = pEnd.y - pStart.y;
      // eslint-disable-next-line
      return 360 * Math.atan2(diffY, diffX) / (2 * Math.PI) + 90;
    },
    handleRealTimeMonitoring(sn) {
      const params = { sn };
      const func = async () => {
        const { data: [data] } = await this.apiPost('/device/qryDeviceData', params);
        const { devicename, imei, gpsinfo: { lng, lat, speed, gpstime, locationType } } = data;
        this._lastPoint = {
          lng,
          lat,
        };
        if (!lng || !lat) return;
        const length = this.polyline.path.length;
        if (length) {
          const lastPoint = this.polyline.path[length - 1];
          if (lastPoint[0] === lng && lastPoint[1] === lat) return;
        }
        // const index = this.markers.findIndex(i => i.sn === sn);
        // if (index !== -1) {
        if (typeof data.gpsinfo === 'object') {
          this.markers[1].position = [lng, lat];
          if (length > 1) {
            this.markers[1].angle = this.calcAngle(
              this.polyline.path[length - 1],
              [lng, lat],
            );
          }
          this.polyline.path.push([lng, lat]);
          const tIndex = this.tableData.unshift({
            devicename,
            imei,
            locationType,
            speed,
            gpstime,
            address: '正在解析地址中...',
            status: speed,
          });
          if (this.showPanorama) {
            this.$refs
                .panorama
                .setPositionAsync(lng, lat, this.$route.query.carnumber);
          }
          this.getAddress([lng, lat])
            .then((result) => {
              this.tableData[this.tableData.length - tIndex].address =
                result.regeocode.formattedAddress;
            })
            .catch(() => {});
        } else {
          this.tableData.push({ address: '暂无数据' });
        }
        // }
      };
      func();
      this.clearTimer();
      this._realTimeMonitoringTimer = setInterval(func, 10000);
    },
    clearTimer() {
      window.clearInterval(this._realTimeMonitoringTimer);
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
    onPanoramaToolClick() {
      this.showPanorama = !this.showPanorama;
      const { lng, lat } = this._lastPoint;
      if (this.showPanorama) {
        this.$refs.panorama.setPositionAsync(lng, lat, this.$route.query.carnumber);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.onlineMonitoring-wrapper
  display: flex
  flex-direction: column
  width: 100%
  height: 100%
  position: relative
  .panorama-tool
    position absolute
    z-index 200
    top 100px
    right 12px
    width 60px
    padding 5px 0px
    background #fff
    border 1px solid #ccc
    text-align center
    font-size 12px
    cursor pointer
    user-select none
  .panorama
    position absolute;
    z-index 200;
    right 10px;
    top 160px;
    width 350px;
    height 350px;
    box-sizing border-box;
    border 4px solid #666;
  .map
    height: 0
    width: 100%
    flex: 1 1 auto
  .table
    position: relative
    flex: 0 0 auto
    width: 100%
    #trackBottom
      top: 0px !important
  .camera
    position: absolute
    top: 20px
    right: 20px
    z-index: 200

.player-wrapper
  display: flex
  padding: 5px
  border-radius: 5px
  background: rgba(255, 255, 255, 0.85)
  line-height: 36px
  align-items: center
  flex-wrap: wrap
  >button.player-btn
    width: 30px
    height: 30px
    padding: 8px 9px
    border-radius: 50%
    .fa-play
      margin-left: 2px
  .slider
    flex: 1 1 auto
    padding: 0px 15px 0px 15px
  .progress
    flex: 1 1 100%
    padding: 10px 0px 5px
  .locationRatio
    flex: 1 1 auto
    text-align: center
    >.el-radio+.el-radio
      margin-left: 10px
      >.el-radio__label
        padding-left: 5px
</style>
