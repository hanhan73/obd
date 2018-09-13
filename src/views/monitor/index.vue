<template>
  <div
    class="wrapper ovf-hd"
    ref="monitor">
    <section class="right">
      <article class="top">
        <div
          class="loading animated"
          v-show="isLoading"
          :class="{ bounceIn: isLoading }">
          <i class="el-icon-loading"></i>
          <span class="text">&nbsp;拼命加载中...</span>
        </div>
        <a class="ranging-tool" :class="{ 'c-blue': isDistance }" @click="onRangingToolClick"><svg-icon icon-class="ranging"></svg-icon> 测距</a>
        <a class="panorama-tool" :class="{ 'c-blue': showPanorama }" @click="onPanoramaToolClick"><svg-icon icon-class="panorama"></svg-icon> 全景</a>
        <el-amap :class="{ crosshair: isCursorCrosshair }"
                 :vid="computedVid"
                 :key="computedVid"
                 :events="events"
                 :plugin="plugin"
                 :animateEnable="false"
                 :resizeEnable="false"
                 :jogEnable="false"
                 ref="amap"
                class="ovf-hd"
                @mousedown.stop @mousemove.stop @mouseout.stop @mouseover.stop @mouseup.stop @mousewheel.stop @click.stop @dblclick.stop
                 >
          <el-amap-marker v-for="(marker, index) in markers"
                          :vid="'marker' + marker.id + random"
                          :bubble="true"
                          :topWhenClick="true"
                          :key="'marker' + marker.id + random"
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
          <el-amap-marker v-for="marker in phoneLocationMarkers"
                          :vid="marker.key"
                          :key="marker.key"
                          :position="marker.position"
                          :content-render="marker.contentRender">
          </el-amap-marker>
          <el-amap-info-window
            :offset="[0, -1]"
            :visible="phoneLocationWindow.visible"
            :position="phoneLocationWindow.position"
            :content-render="phoneLocationWindow.contentRender">
          </el-amap-info-window>
          <el-amap-marker v-for="marker in packDistributionMarkers"
                          :vid="marker.key"
                          :key="marker.key"
                          :zIndex="marker.zIndex"
                          :position="marker.position"
                          :content-render="marker.contentRender">
          </el-amap-marker>
          <el-amap-info-window
            :offset="[6, -1]"
            :visible="packDistributionWindow.visible"
            :position="packDistributionWindow.position"
            :content-render="packDistributionWindow.contentRender">
          </el-amap-info-window>
          <!-- bubble 属性无效, 这插件的bug -->
          <el-amap-info-window v-for="(win, index) in windows"
                               :vid="'win' + win.id + random"
                               :key="'win' + win.id + random"
                               :bubble="true"
                               :size="win.size"
                               :isCustom="win.isCustom"
                               :position="win.position"
                               :content="win.content"
                               :template="win.template"
                               :visible="win.visible"
                               :offset="win.offset || [0, 0]"
                               :autoMove="win.autoMove === undefined ? true : false"
                               :events="win.events || {}">
          </el-amap-info-window>
          <el-amap-circle v-for="(circle, index) in circles"
                          :key="index"
                          :strokeColor="circle.strokeColor || '#1791fc'"
                          :strokeOpacity="0.8"
                          :strokeWeight="2"
                          :fillColor="circle.fillColor || '#1791fc'"
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
                            :strokeStyle="polyline.strokeStyle"
                            :strokeWeight="polyline.strokeWeight"
                            :strokeColor="polyline.strokeColor"
                            :events="polyline.events">
          </el-amap-polyline>
        </el-amap>
        <panorama ref="panorama" v-show="showPanorama" class="panorama"></panorama>
        <div class="fence-wrapper" :class="{ shrink: isShrink }" v-show="isShrink !== null">
          <nav @click="isShrink = !isShrink">电子围栏</nav>
          <el-button @click="handleAddFence" class="add" type="primary" size="mini" :icon="`el-icon-${isCursorCrosshair ? 'close' : 'plus'}`"></el-button>
          <el-table size="mini" max-height="300" :data="fenceData" @row-click="handleFenceRowClick">
            <el-table-column property="desc" label="名称"></el-table-column>
            <el-table-column property="radius" label="半径/米"></el-table-column>
            <el-table-column label="类型" :formatter="row => row.fenceType === 0 ? '圆形围栏' : '区域围栏'"></el-table-column>
            <el-table-column property="" label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click.native.stop="handleFenceDelete(scope.row.fenceId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </article>
      <article class="bottom">
        <div class="shrink-top" @click="monitorBottomShrink = !monitorBottomShrink"><i :class="`el-icon-arrow-${monitorBottomShrink ? 'up' : 'down'}`"></i></div>
        <div class="top-wrapper">
          <el-popover
            popper-class="twoPoints-popper"
            ref="popover"
            placement="top"
            trigger="click">
            <el-button size="mini" @click="triggerTwoPointsStatus" :loading="twoPointsLoading"><i :class="`fa fa-eye${twoPointsStatus ? '-slash' : ''}`" aria-hidden="true"></i> {{twoPointsStatus ? '隐藏' : '显示'}}</el-button>
            <el-button size="mini" @click="handleAddTwoPoint" :disabled="false" type="primary"><i class="fa fa-plus-circle" aria-hidden="true"></i> 新建</el-button>
          </el-popover>
          <el-button size="mini" icon="el-icon-location" @click="showPhoneLocation = !showPhoneLocation">手机定位</el-button>
          <el-button size="mini" class="ve-m" v-popover:popover><svg-icon icon-class="pledge" style="color: #EA8010"></svg-icon> 二押</el-button>
          <el-select size="mini" popper-class="refreshSelectPopper" style="width: 71px" class="ve-m" @change="setRefreshEvent" v-model="refreshInterval" placeholder="请选择">
            <el-option label="10s" :value="10"></el-option>
            <el-option label="20s" :value="20"></el-option>
            <el-option label="30s" :value="30"></el-option>
            <el-option label="60s" :value="60"></el-option>
            <el-option label="关闭" :value="null"></el-option>
          </el-select>
          <el-tag size="mini" class="refreshCountDown" v-show="refreshInterval !== null">{{refreshCountDown}} 秒后刷新</el-tag>
        </div>
        <div v-show="!monitorBottomShrink" id="monitorBottom" :style="{ 'height': monitorBottomShrink ? '0px' : '175px' }">
          <!-- <el-table size="mini" v-if="showMode === 'track' || showMode === 'monitoring'" key="track" height="auto" :data="tableData" class="table-tx-c h-100p w-100p">
            <el-table-column width="170" property="gpstime" label="定位时间"></el-table-column>
            <el-table-column width="100" label="速度" :formatter="({ speed }) => `${speed} km/h`"></el-table-column>
            <el-table-column show-overflow-tooltip property="address" label="位置"></el-table-column>
            <el-table-column width="100" label="状态">
              <template slot-scope="{ row: { status } }">
                <el-tag v-if="status !== '0'" size="mini" type="success">行驶中</el-tag>
                <el-tag v-else size="mini" type="danger">停驶</el-tag>
              </template>
            </el-table-column>
          </el-table> -->

          <el-table size="mini" class="table-tx-c h-100p w-100p" ref="positionTable" key="position" border height="auto" highlight-current-row row-class-name="pointer" :data="vehicleData" @row-click="handleRowClick">
            <el-table-column width="40" label="" class-name="cellTextOverflowClip">
              <template slot-scope="{ row: { color } }">
                <svg-icon class="fz-20 ve-m"
                          :class="`${color}`" icon-class="car" />
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip width="150" prop="devicename" label="设备名称"></el-table-column>
            <el-table-column width="155" property="sn" label="IMEI"> </el-table-column>
            <el-table-column width="170" property="gpstime" label="定位时间"></el-table-column>
            <el-table-column width="90" label="速度" :formatter="({ speed }) => `${speed || 0} km/h`"></el-table-column>
            <el-table-column width="90" label="总里程" :formatter="({ totalMil }) => `${totalMil || 0} km`"></el-table-column>
            <el-table-column show-overflow-tooltip property="address" label="位置"></el-table-column>
            <el-table-column show-overflow-tooltip width="110" :formatter="({ status }) => status === '' ? '设备未激活' : status" label="状态"></el-table-column>
            <el-table-column width="105" :formatter="({ connectedtype, locateMode }) => `${connectedtype === '0' ? '有源' : '无源'}-${locateMode}`" label="类型"></el-table-column>
            <el-table-column width="70" :render-header="handleClearRenderHeader">
              <template slot-scope="{ row: { id }, $index }">
                <el-button type="text" size="mini" @click.stop="handleClearMarker(id, $index)">清除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </article>
    </section>
    <section class="left">
      <div class="shrink-left" @click="monitorLeftShrink = !monitorLeftShrink"><i :class="`el-icon-arrow-${monitorLeftShrink ? 'left' : 'right'}`"></i></div>
      <div id="monitorLeft" :style="{ 'width': monitorLeftShrink ? '0px' : '310px' }">
        <partner v-show="!showPhoneLocation"
                @handleTableSelect="handleTableSelect"
                @handleOpenVehicleData="handleOpenVehicleData"
                @handleSettings="handleSettings"
                @hideCurrentMarker="hideCurrentMarker"
                ref="partner"
                :props="props"
                :mapLoading.sync="isLoading"
                :vehicleData="vehicleData"></partner>
        <phone-location v-show="showPhoneLocation"
                        @close="showPhoneLocation = false"
                        @clearMarkers="clearPhoneLocationMarkers"
                        @showPhoneLocationMarkers="showPhoneLocationMarkers"></phone-location>
      </div>
    </section>
    <add-fence ref="addFence"></add-fence>
    <settings ref="settings" @init="refreshBottomList()"></settings>
    <alarm-list ref="alarmList" @handleTableRowClick="handleAlarmClick"></alarm-list>
    <vehicle-data ref="vehicleData" @init="(vehicleid) => {refreshBottomList(vehicleid);refreshRightList()}"></vehicle-data>
    <the-map ref="theMap"></the-map>
    <pack-distribution
      ref="packDistribution"
      @showMarkers="showPackDistributionMarkers"
      @markerClick="onPackDistributionClick"
      @clearMarkers="clearPackDistributionMarkers">
    </pack-distribution>

    <el-dialog
      title="修改字段"
      :modal-append-to-body="false"
      :visible.sync="schemaDialogVisible">
      <el-checkbox-group v-model="schemaList">
        <el-checkbox label="当日里程"></el-checkbox>
        <el-checkbox label="总里程"></el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery';
import 'static/jq-resizable/jquery-ui.min';
import 'static/jq-resizable/jquery-ui.structure.min.css';
import 'static/jq-draggable/jquery-ui.min';
import 'static/jq-draggable/jquery-ui.structure.min.css';

import http from '@/assets/js/http';
import mapMixin from '@/assets/js/map_com';
import { vehicleColor as colorMap, locationTypeMap } from '@/assets/js/config';
import Panorama from 'views/panorama/index';// 全景地图
import Partner from './partner';// sidebar列表
import AddFence from './add-fence';// 添加围栏
import AlarmList from './alarm-list';// 告警列表
import Settings from './settings/index';// 设备下发指令
import VehicleData from './vehicle-data';// 车辆资料
import PhoneLocation from './phone-location';// 手机定位
import TheMap from '../alarm/deviceAlert/TheMap';// 设备报警详情
import PackDistribution from './pack-distribution';

import fenceMixin from './fence_mixin';
import twoPointsMixin from './twoPoints_mixin';

const locateIcon = { 0: 'baseStation', 1: 'satellite', 2: 'wifi' };
const signalgsmArr = ['无信号', '信号极弱', '信号较弱', '信号良好', '信号强'];

let self = null;

export default {
  name: escapeName('在线监控'),
  props: ['props'],
  mixins: [
    http,
    mapMixin,
    fenceMixin,
    twoPointsMixin,
  ],
  components: {
    Partner,
    AddFence,
    Settings,
    AlarmList,
    VehicleData,
    Panorama,
    TheMap,
    PhoneLocation,
    PackDistribution,
  },
  data() {
    return {
      // showPackDistributionWindow: false,
      packDistributionWindow: {
        position: [0, 0],
        visible: false,
        contentRender: () => (<div></div>),
      },
      phoneLocationWindow: {
        position: [0, 0],
        visible: false,
        contentRender: () => (<div></div>),
      },
      packDistributionMarkers: [],
      phoneLocationMarkers: [],
      showPhoneLocation: false,
      showPanorama: false,
      schemaList: [],
      schemaDialogVisible: false,
      isDistance: false,
      monitorLeftShrink: false,
      monitorBottomShrink: false,
      random: Math.random().toString().replace('.', ''),
      locateMode: 'gpsinfo',
      refreshInterval: 60,
      refreshCountDown: 60,
      markers: [],
      windows: [],
      circles: [],
      polygons: [],
      polyline: {
        path: [],
        editable: false,
        strokeWeight: 1,
        strokeColor: '#409EFF',
        strokeStyle: 'dashed',
        events: {},
      },
      isLoading: false,
      tableData: [],
      vehicleData: [],
      fenceData: [],
      isShrink: null,
      isCursorCrosshair: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const sTime = moment().add(-1, 'day').startOf('day');
              const eTime = moment().add(-1, 'day').endOf('day');
              picker.$emit('pick', [sTime, eTime]);
            },
          },
          {
            text: '今天',
            onClick(picker) {
              const sTime = moment().startOf('day');
              const eTime = moment();
              picker.$emit('pick', [sTime, eTime]);
            },
          },
          {
            text: '最近5小时',
            onClick(picker) {
              const sTime = moment().add(-5, 'hour');
              const eTime = moment();
              picker.$emit('pick', [sTime, eTime]);
            },
          },
          {
            text: '最近1小时',
            onClick(picker) {
              const sTime = moment().add(-1, 'hour');
              const eTime = moment();
              picker.$emit('pick', [sTime, eTime]);
            },
          },
        ],
      },
    };
  },
  computed: {
    $map() {
      return this.$refs.amap.$$getInstance();
    },
    computedVid() {
      return `monitor${this.random}`;
    },
    speed() {
      return this.playerSpeed * 25;
    },
    time: {
      set(val) {
        this.params.sTime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
        this.params.eTime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      get() {
        return [this.params.sTime, this.params.eTime];
      },
    },
  },
  created() {
    self = this;
  },
  mounted() {
    $('#monitorBottom').resizable({
      handles: 'n',
      minHeight: 175,
      helper: 'ui-resizable-helper-top',
      stop: (event, { element, size }) => {
        element[0].style.height = `${size.height}px`;
      },
    });
    $('#monitorLeft').resizable({
      handles: 'w',
      minWidth: 305,
      helper: 'ui-resizable-helper-left',
      stop: (event, { element, size }) => {
        element[0].style.width = `${size.width}px`;
      },
    });
    $('#alarmListDialog>.el-dialog').draggable();
    $('#vehicleDataDialog>.el-dialog').draggable();
    $('#phoneLocationHisDialog>.el-dialog').draggable();
  },
  methods: {
    init() {
      this.clearData();
      this.clearMarkersAndWindows();
      this.$refs.partner.refreshPage(true);
    },
    clearMarkersAndWindows() {
      this.markers = [];
      this.windows = [];
    },
    clearCirclesAndPolygons() {
      this.circles = [];
      this.polygons = [];
    },
    clearCirclesAndPolyline() {
      this.circles = [];
      this.polyline.path = [];
    },
    closeFence() {
      this.isShrink = null;
      this.isCursorCrosshair = false;
    },
    clearData(refresh) {
      this.tableData = []; // 重置表格数据
      // 删除 起点、终点 marker
      this.markers = this.markers.filter(i => ['起点', '终点', 'other'].indexOf(i.name) === -1);
      this.windows = this.windows.filter(i => ['other'].indexOf(i.title) === -1);
      this.clearCirclesAndPolyline();
      this.closeFence();
      if (this._mousetool) this._mousetool.close(true);
      this.clearCirclesAndPolygons();
      this.clearRefreshEvent();
      // console.log(refresh);
      if (refresh !== true) {
        this.clearPackDistributionMarkers();
        this.$refs.packDistribution.dialogVisible = false;
      }
    },
    handleTableSelect(data, sn, refresh, locationType) {
      if (!data || this._isLoadingMarkers) return;
      this._isLoadingMarkers = true;
      this.clearData(refresh);
      this._devices = _.flatten(data.map(i => i.devicelist));
      const ids = this._devices.map(i => i.id);
      this.markers = this.markers.filter(i => ids.indexOf(i.id) === -1);
      this.windows = this.windows.filter(i => ids.indexOf(i.id) === -1);
      this.$nextTick(async () => { // 为了兼容IE所做的, 不然信息窗口会出现显示空白的情况
        await this.showMarkers(data, sn, refresh, locationType);
        this._handleTableSelectData = data;
        // setTimeout(this.setRefreshEvent);// FIXME: 这里有个奇怪的问题，同步执行就没效果，异步执行才有效果
        this._isLoadingMarkers = false;
      });
    },
    async showMarkers(data, sn, refresh, locationType) {
      await this.setMarkers(data, locationType, sn);
      // console.log(JSON.stringify(this.markers));
      if (!this.markers.length) {
        _g.toastMsg('warning', '暂无定位数据');
        return;
      } else if (data.length === 1) {
        // 如果是车辆直接显示车辆
        let curMarker = 0;
        if (sn) {
          const index = this.markers.findIndex(i => i.sn === sn);
          if (index !== -1) {
            curMarker = index;
          } else {
            const devicelist = data[0].devicelist;
            if (data[0].id !== null && devicelist.length > 1) {
              const sns = devicelist.map(i => i.sn);
              curMarker = this.markers.findIndex(i => sns.indexOf(i.sn) !== -1);
              if (curMarker !== -1) {
                _g.toastMsg('warning', '该设备暂无定位数据，将展示车辆另一台设备定位信息');
              }
            } else {
              curMarker = -1;
            }
          }
        } else {
          const sns = data[0].devicelist.map(i => i.sn);
          curMarker = this.markers.findIndex(i => sns.indexOf(i.sn) !== -1);
        }
        if (curMarker !== -1) {
          setTimeout(() => {
            this.handleCurrentMarker(this.markers[curMarker].id, true, refresh)();
          });
        } else {
          this.hideCurrentMarker();
          _g.toastMsg('warning', '暂无定位数据');
        }
        return;
      }
      this.$nextTick(() => {
        const map = this.$map;
        map.setFitView(map.getAllOverlays(['marker', 'circle']));
        // map.setZoom(map.getZoom() - 1);
        // map.setCenter(this.markers[curMarker].position);
      });
    },
    async setMarkers(data, defaultLocationType, defaultSn) {
      await Promise.all(data.map((vehicle, index) => new Promise(async (resolve) => {
        await Promise.all(vehicle.devicelist.map((i, index1) => {
          const { deFenceid, sn } = i;
          if (deFenceid === '') return null;
          return new Promise(async (resolve1) => {
            try {
              const { data: [{ lon, lat, radius }] } = await this.apiPost('/fence/searchFence', { sn, fenceid: deFenceid });
              data[index].devicelist[index1].fenceInfo = {
                lng: lon,
                lat,
                radius,
              };
              resolve1();
            } catch (e) {
              data[index].devicelist[index1].fenceInfo = {};
              resolve1();
            }
          });
        }));
        resolve();
      })));
      data.forEach((vehicle) => {
        const {
          carNumber,
          userName,
          userPhone,
          id: vehicleid,
          partnerName,
        } = vehicle;
        vehicle.devicelist.forEach((value) => {
          const {
              id,
              sn,
              imei,
              isObd,
              dateMil, // 日里程
              totalMil, // 总里程
              devicename,
              communicationTime,
              connectedtype,
              isonline,
              signalgsm,
              voltage,
              deFenceid,
              // connect,
              objectState,
              alertInMin,
              vehicleState: status,
              fenceInfo,
              partnerid,
              otherGpsInfo,
          } = value;
          let {
            gpsinfo: { locationType, lng, lat, speed, gpstime },
          } = value;
          const otherGpsInfoLocationType = otherGpsInfo.map(i => i.locationType);
          if (sn === defaultSn && defaultLocationType && locationType !== defaultLocationType) {
            const item = otherGpsInfo.find(i => i.locationType === defaultLocationType);
            locationType = item.locationType;
            lng = item.lng;
            lat = item.lat;
            speed = item.speed;
            gpstime = item.gpstime;
          }
          let hasLocatorData = true;
          if (lng === '' || lat === '') {
            const item = otherGpsInfo.find(i => i.lng && i.lat);
            if (item) {
              locationType = item.locationType;
              lng = item.lng;
              lat = item.lat;
              speed = item.speed;
              gpstime = item.gpstime;
            } else {
              hasLocatorData = false;
            }
          }
          let locationTypeOptions = '';
          for (const i in locationTypeMap) {
            if (locationTypeMap[i] && otherGpsInfoLocationType.indexOf(i) !== -1) {
              locationTypeOptions += `<option value="${i}" ${i === locationType ? 'selected' : ''}>${locationTypeMap[i]}</option>`;
            }
          }
          const locateMode = locationType === '' ? '无定位' : locationTypeMap[locationType];
          const color = objectState === '' ? 'black' : colorMap[objectState];
          const position = [lng, lat];
          const deviceData = {
            devicename,
            position,
            userName,
            userPhone,
            id,
            sn,
            totalMil,
            isonline,
            carNumber,
            gpstime,
            speed,
            status,
            connectedtype,
            locateMode,
            hasLocatorData,
            objectState,
            color,
            address: hasLocatorData ? '正在解析地址中...' : '无定位信息',
          };
          const isExist = this.vehicleData.findIndex(i => i.sn === sn);
          if (isExist !== -1) {
            this.vehicleData.splice(isExist, 1, deviceData);
            // const index = this.markers.findIndex(i => i.sn === sn);
            // this.markers.splice(index, 1);
            // this.windows.splice(index, 1);
          } else {
            this.vehicleData.push(deviceData);
          }
          if (!hasLocatorData) return;
          this.getAddress([lng, lat]).then(({ regeocode: { formattedAddress } }) => {
            const index = this.vehicleData.findIndex(i => i.sn === sn);
            if (index !== -1) {
              this.vehicleData[index].address = formattedAddress;
            }
          });
          const isPassive = connectedtype === '1';
          const iconColor = color === 'c-sliver' ? color : 'c-green';
          let deviceFlag;
          if (isObd === '1') deviceFlag = 'M';
          else if (isPassive) deviceFlag = 'T';
          else deviceFlag = 'V';
          // 设置窗口
          this.windows.push({
            id,
            sn,
            autoMove: false,
            position,
            offset: [0, 0],
            isCustom: false,
            size: new AMap.Size(326, 230),
            visible: false,
            template: `
              <section class="info-windows">
                <h1 class="monitor ${color}"><a><span class="excircle">${deviceFlag}</span><span title="${devicename}">${devicename}</span> <i>${status}</i> ${deFenceid ? '<i class="c-red f-w-b">已设防</i>' : ''}</a>
                  <a>${isPassive ?
                      `<svg-icon class="${iconColor} ve-m fz-20 battery" icon-class="battery${voltage}" title="电量剩余: ${voltage || 0}%"/>` :
                      `<img src="/static/images/storageBattery${iconColor === 'c-sliver' ? '' : voltage}.png" title="电量剩余: ${voltage || 0}%"/>`
                  }
                  <svg-icon class="${iconColor} ve-m fz-20" icon-class="${locateIcon[locationType]}" title="${locateMode}"/>
                  <svg-icon class="${iconColor} ve-m fz-20" icon-class="signal${signalgsm === '' ? 0 : signalgsm}" title="${signalgsmArr[signalgsm - 0]}"/>
                  </a>
                </h1>
                <p><a>IMEI:</a> <a>${imei}</a></p>
                <p><a>账号名称:</a> <a>${partnerName}</a> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;${alertInMin ? `<a>警情：<span class="monitor ${color}">${alertInMin}</span></a>` : ''}</p>
                <p><a>定位方式:</a> <a>
                  <select @change="(val) => handleLocationTypeChange(${vehicleid}, '${sn}', val)">
                    ${locationTypeOptions}
                  </select>
                 &nbsp;&nbsp;&nbsp;${carNumber ? `<span class="f-w-b">车牌号:</span> <span class="carnumberspan"  title="${carNumber}">${carNumber}</span>` : ''}</a></p>
                <p><a>定位时间:</a> <a>${gpstime}</a> &nbsp;&nbsp;${isPassive ? '' : `<span class="f-w-b fz-12">日里程:</span>&nbsp; ${dateMil || 0} km`}</p>
                <p><a>信号时间:</a> <a>${communicationTime}</a> &nbsp;&nbsp;${isPassive ? '' : `<span class="f-w-b fz-12">总里程:</span>&nbsp; ${totalMil || 0} km`}</p>
                <p style="height: 30px"><a>位置:</a> <a id="window_${this.random}_${id}">正在解析地址中...</a></p>
                <p class="btn-wrapper ${this.$isIE ? 'ie' : ''}">
                  <button class="button bg-blue" @click="findTrack('${sn}', '${carNumber}', '${gpstime}', ${!isPassive}, '${devicename}', ${dateMil || null}, ${totalMil || null})">
                    <i class="fa fa-car" aria-hidden="true"></i>
                    轨迹
                  </button>
                  <button class="button bg-blue" @click="handleRealTimeMonitoring('${sn}')"><i class="fa fa-video-camera" aria-hidden="true"></i> 监控</button>
                  <button class="button bg-blue" @click="handleOpenAlarmList('${sn}', '${devicename}')"><i class="fa fa-bell-o" aria-hidden="true"></i> 报警</button>
                  <button class="button bg-blue" @click="handleOpenVehicleData(${id}, ${vehicleid}, '${sn}', ${partnerid})"><i class="fa fa-file-text-o" aria-hidden="true"></i> 资料</button>
                  <button class="button bg-blue" @click="handleSettings(${!isPassive}, '${sn}', '${lng}', '${lat}', '${isonline}', ${id})"><i class="fa fa-cog" aria-hidden="true"></i> 设置</button>
                  <el-popover
                    ref="popover"
                    placement="right"
                    width="70"
                    popper-class="bubbleWindowPopper"
                    trigger="hover">
                    <el-button type="primary" size="mini" onclick="findFence('${sn}')"><svg-icon icon-class="rail"></svg-icon> 电子围栏</el-button>
                    <el-button type="primary" size="mini" @click="handleOpenPackDistribution('${sn}')" class="m-l-0 m-t-5"><svg-icon icon-class="distribution"></svg-icon> 停车分布</el-button>
                  </el-popover>
                  <button v-popover:popover class="button bg-blue reference">
                    <i class="fa fa-cog" aria-hidden="true"></i>
                    更多
                  </button>
                </p>
              </section>
            `,
                    // <div class="popout-menu">
                    //   <ul>
                    //     <li onclick="findFence('${sn}')">电子围栏</li>
                    //     <li @click="handleOpenPackDistribution('${sn}')">停车分布</li>
                    //   </ul>
                    // </div>
            events: {
              close: this.handleWindowClose(id),
            },
          });
            // 设置点坐标
          this.markers.push({
            id,
            carNumber,
            imei,
            sn,
            vId: vehicleid,
            devicename,
            fenceInfo,
            position,
            title: carNumber,
            angle: 0,
            offset: [-10, -15],
            template: `
              <svg-icon class="bg-wh bor-ra-50p fz-24 ve-m ${color} mapCarIcon" icon-class="car" />
            `,
            animation: 'AMAP_ANIMATION_DROP',
            events: {
              click: this.handleCurrentMarker(id),
            },
          });
        });
      });
    },
    handleLocationTypeChange(vehicleid, sn, { target: { value } }) {
      // console.log(vehicleid, sn, value);
      self.refreshBottomList(vehicleid, sn, value);
    },
    handleClearRenderHeader() {
      return (
        <span>
          <el-button type="text" size="mini" on-click={this.handleClearAllMarkers}>清除</el-button>
          &nbsp;&nbsp;
          <i class="el-icon-edit pointer" on-click={this.handleEditSchemaConfig}></i>
        </span>
      );
    },
    handleEditSchemaConfig() {
      this.schemaDialogVisible = true;
    },
    handleClearAllMarkers() {
      this.$confirm('确定清除所有设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        this._currentMarkerId = null;
        this.vehicleData = [];
        this.clearMarkersAndWindows();
        this.clearCirclesAndPolyline();
        this.clearRefreshEvent();
      });
    },
    handleClearMarker(id, $index) {
      this.vehicleData.splice($index, 1);
      const index = this.markers.findIndex(i => i.id === id);
      const wIndex = this.windows.findIndex(i => i.id === id);
      if (index !== -1) {
        this.markers.splice(index, 1);
      }
      if (wIndex !== -1) {
        this.windows.splice(index, 1);
      }
      if (id === this._currentMarkerId) {
        this.clearCirclesAndPolyline();
        this._currentMarkerId = null;
      }
    },
    handleWindowClose(id) {
      return () => {
        const index = this.windows.findIndex(i => i.id === id);
        if (index === -1) return;
        this.windows[index].visible = false;
      };
    },
    handleCurrentMarker(id, fixScroll = true, refresh = false) {
      return () => {
        this.clearData(refresh);
        this.phoneLocationWindow.visible = false;
        this.packDistributionWindow.visible = false;
        this.windows.forEach((win) => {
          win.visible = false;
        });

        this.markers.forEach((marker) => {
          marker.angle = 0;
        });

        this.$nextTick(() => { // 别说了, 为了兼容IE
          const index = this.windows.findIndex(i => i.id === id);
          const mIndex = this.markers.findIndex(i => i.id === id);

          const curMarker = this.markers[mIndex];
          const position = curMarker.position;

          this._currentMarkerId = id;
          this._currentMarkerSN = curMarker.sn;
          this._currentMarkerVId = curMarker.vId || '';

          this.$map.setCenter(position);
          if (!refresh) this.$map.setZoom(16);
          this.windows[index].visible = true;

          this.getAddress(position).then(({ regeocode: { formattedAddress } }) => {
            const el = document.querySelector(`#window_${this.random}_${id}`);
            if (el) {
              el.innerHTML = formattedAddress;
            }
          });
          // 高亮下方表格相应行
          if (this.$refs.positionTable) {
            this.$refs.positionTable.setCurrentRow(
              this.vehicleData[this.vehicleData.findIndex(i => i.id === id)],
            );
            if (fixScroll) {
              this.$nextTick(() => {
                const wrapper = this.$refs.positionTable.$el.querySelector('.el-table__body-wrapper');
                const currentRow = wrapper.querySelector('.current-row');
                if (wrapper && currentRow) wrapper.scrollTop = currentRow.offsetTop;
              });
            }
          }
          const { fenceInfo } = curMarker;
          curMarker.visible = true;
          if (fenceInfo) {
            const { lng, lat, radius } = fenceInfo;
            if (!lng || !lat) return;
            this.circles = [{
              center: [lng, lat],
              radius,
              strokeColor: '#DEBFAF',
              fillColor: '#DEBFAF',
            }];
            this.polyline.path.push(position, [lng, lat]);
          }
          if (this.twoPointsStatus) this.showTwoPoints(position);
          if (this.showPanorama) this.setPanoramaPoint(curMarker);

          this.setRefreshEvent();// 设置定时刷新任务
        });
      };
    },
    handleRowClick({ id, hasLocatorData }) {
      if (!hasLocatorData) {
        _g.toastMsg('warning', '暂无定位数据');
        this.hideCurrentMarker();
        return;
      }
      this.handleCurrentMarker(id, false)();
    },
    hideCurrentMarker() {
      const index = this.windows.findIndex(i => i.id === this._currentMarkerId);
      if (index !== -1) {
        this.windows[index].visible = false;
        this.clearCirclesAndPolyline();
      }
    },
    clearRefreshEvent() {
      clearTimeout(this._refreshEvent);
      this._refreshEvent = null;
    },
    setRefreshEvent() {
      this.clearRefreshEvent();
      if (!this.refreshInterval) return;
      this.refreshCountDown = this.refreshInterval;
      try {
        const refresh = () => {
          this.refreshCountDown -= 1;
          if (this.refreshCountDown === 0) {
            this.refreshCountDown = this.refreshInterval;
            if (this.$refs.partner &&
                this.$refs.monitor.offsetWidth !== 0 &&
                !this.phoneLocationWindow.visible &&
                !this.packDistributionWindow.visible) {
              this.refreshRightList();
              this.refreshBottomList(this._currentMarkerVId, this._currentMarkerSN);
              this.clearRefreshEvent();
            }
          }
          this._refreshEvent = window.setTimeout(refresh, 1000);
        };
        refresh();
      } catch (e) {
        // console.log(e);
      }
    },
    refreshRightList() {
      this.$refs.partner.handleNodeClick(this.$refs.partner._node);
    },
    refreshBottomList(vehicleid = '', sn = '', locationType = null) {
      this.$refs.partner.fetchDeviceByVehicleid(vehicleid, sn, true, locationType);
    },
    handleLocateModeChange() {
      this.handleTableSelect(this._handleTableSelectData);
    },
    handleOpenVehicleData(...args) {
      self.$refs.vehicleData.open(...args);
    },
    handleSettings(...args) {
      self.$refs.settings.open(...args);
    },
    handleOpenPackDistribution(...args) {
      self.$refs.packDistribution.open(...args);
    },
    handleOpenAlarmList(sn, carNumber) {
      self.$refs.alarmList.open(sn, carNumber);
    },
    findTrack(sn, carNumber, gpstime, isPassive, devicename, dateMil, totalMil) {
      self._sn = sn;
      window.open(`/#/trackReplay?sn=${sn}&gpstime=${gpstime}&devicename=${devicename}&carnumber=${carNumber}&isPassive=${isPassive ? 1 : 0}&dateMil=${dateMil}&totalMil=${totalMil}`, '_blank');
    },
    handleRealTimeMonitoring(sn) {
      const index = self.markers.findIndex(i => i.sn === sn);
      const { position, carNumber: carnumber, devicename } = self.markers[index];
      window.open(
        `/#/onlineMonitoring?sn=${sn}&carnumber=${carnumber || devicename}&position=${position.join(',')}`,
        '_blank',
      );
    },
    onRangingToolClick() {
      // AMap.event.removeListener(this._rulerListener);
      if (this._ruler) this._ruler.turnOff();
      const map = this.$map;
      this._ruler = new AMap.RangingTool(map);
      AMap.event.addListenerOnce(this._ruler, 'end', () => {
        this._ruler.turnOff();
        this.isDistance = false;
      });
      this._ruler.turnOn();
      this.isDistance = true;
    },
    onPanoramaToolClick() {
      this.showPanorama = !this.showPanorama;
      const index = this.markers.findIndex(i => i.id === this._currentMarkerId);
      if (index !== -1) {
        this.setPanoramaPoint(this.markers[index]);
      }
    },
    setPanoramaPoint(marker) {
      const { position, devicename } = marker;
      this.$refs.panorama.setPosition(...position, devicename);
    },
    async handleAlarmClick(row) {
      this.$refs.theMap.open(row);
    },
    clearPhoneLocationMarkers() {
      this.phoneLocationMarkers = [];
      this.phoneLocationWindow.visible = false;
    },
    showPhoneLocationMarkers({ lat, lng, location }) {
      this.hideCurrentMarker();
      this.clearPhoneLocationMarkers();
      const position = [lng, lat];
      this.phoneLocationMarkers.push({
        key: Math.random().toString().substring(2),
        position,
        contentRender: () => (
            <div>
              <img src="/static/images/mark_bs.png"/>
              <p class="point-desc blue">当前地点</p>
            </div>
        ),
      });
      this.phoneLocationWindow = {
        visible: true,
        position,
        contentRender: () => (
          <div class="fz-14">
            <p>经度: {lng}</p>
            <p>纬度: {lat}</p>
            <p>地址: {location}</p>
          </div>
        ),
      };
      this.$map.setCenter(position);
      this.$map.setZoom(16);
    },
    showPackDistributionMarkers(data) {
      this.clearPackDistributionMarkers();
      data.forEach(({ startLon, startLat, minuteSpan, startTime, stopTime }, index) => {
        this.packDistributionMarkers.push({
          minuteSpan,
          startTime,
          stopTime,
          key: `packDistribution${Math.random().toString().substring(2)}`,
          position: [startLon, startLat],
          zIndex: 0,
          contentRender: () => (
            <div class="locate-wrapper">
              <svg-icon icon-class="locate"></svg-icon>
              <span class="number">{index + 1}</span>
            </div>
          ),
        });
      });
    },
    onPackDistributionClick(index) {
      this.hideCurrentMarker();
      this.packDistributionMarkers.forEach((i, _index) => {
        if (_index === index) {
          i.contentRender = () => (
            <div class="locate-wrapper c-red">
              <svg-icon icon-class="locate"></svg-icon>
              <span class="number">{_index + 1}</span>
            </div>
          );
          i.zIndex = 1;
          this.$map.setCenter(i.position);
          this.$map.setZoom(16);
          const minuteSpan = this.$secondsFormat(i.minuteSpan / 1000);
          // console.log(minuteSpan, i);
          this.packDistributionWindow = {
            visible: true,
            position: i.position,
            contentRender: () => (
              <div class="fz-14">
                <p class="f-w-b">停留时长: {minuteSpan}</p>
                <p>开始时间: {i.startTime}</p>
                <p>结束时间: {i.stopTime}</p>
              </div>
            ),
          };
          // this.showPackDistributionWindow = true;
        } else {
          i.contentRender = () => (
            <div class="locate-wrapper">
              <svg-icon icon-class="locate"></svg-icon>
              <span class="number">{_index + 1}</span>
            </div>
          );
          i.zIndex = 0;
        }
      });
    },
    clearPackDistributionMarkers() {
      this.packDistributionMarkers = [];
      this.packDistributionWindow.visible = false;
    },
  },
  beforeDestroy() {
    this.clearData();
  },
  deactivated() {
    this.clearRefreshEvent();
  },
};

</script>

<style>
.twoPoints-popper {
  min-width: 130px;
}
.bubbleWindowPopper {
  min-width: 96px;
}
</style>


<style lang="stylus">
.point-desc
  width: 56px;
  margin-left: -25px;
  background: #fff;
  border: 1px solid red;
  padding: 5px 5px;
  font-size: 14px;
  &.blue
    border-color: blue;

.button
  margin-top: 2px
  border: none
  padding: 3px 0px 0px
  text-align: center
  text-decoration: none
  display: inline-block
  font-size: 14px
  cursor: pointer
  border-radius: 3px
  transition-duration: 0.4s
  &.bg-blue
    border: 1px solid #008CBA
    background-color: #008CBA
    color: white
    &:hover
      background-color: white !important
      color: black

.crosshair
  cursor: crosshair
  .navipoint-canvas,.amap-vectors
    cursor: crosshair

.refreshSelectPopper
  .popper__arrow
    left: 75px !important

.info-windows
  .battery
    display: inline-block
    height: 20px
    margin-top: -16px
    font-size: 36px !important
  .excircle
    display: inline-block
    margin-right: 3px
    margin-bottom: 2px
    height: 16px
    width: 16px
    line-height: 16px
    border: 1px solid #DCDFE6
    border-radius: 50%
    color: #409EFF
    font-size: 12px
    font-weight: bold
    text-align: center
  .carnumberspan
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    width: 108px
    height: 12px
    display: inline-block

.mapCarIcon
  display: inline-block
  width: 24px
  height: 24px

.cellTextOverflowClip
  >.cell
    text-overflow: clip

.two-pledge
  .icon-wrapper
    display: inline-block
    background: #fff
    border-radius: 50%
    font-size: 24px
  .txt
    background: rgba(64,158,255,1)
    color: #fff

.amap-info-content
  overflow visible

.reference
  position relative
.popout-menu
  position absolute
  display none
  visibility hidden
  left 102%
  top 0px
.reference:hover
  >.popout-menu
    display block
    visibility visible
    ul
      li
        width 60px
        border 1px solid #ccc
        background #fff
        padding 3px 15px
        &:hover
          background #F1F5F7

.locate-wrapper
  position relative
  font-size 30px
  color #3475DC
  .number
    position absolute
    top 5px
    left 50%
    transform translateX(-50%)
    z-index 1
    font-size 14px
    color #fff
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
  display flex
  height 100%
  overflow hidden
  >.left
    position relative
    z-index 151
    flex 0 0 auto
    background #F1F2F7
    box-sizing border-box
    border-left 1px solid #ccc
    #monitorLeft
      height 100%
      left 0px !important
  >.right
    display flex
    flex-direction column
    flex 1 1 auto
    width 1px
    >.top
      position relative
      flex 1 1 auto
      height 100%
      border-bottom 1px solid #ccc
      box-sizing border-box
      .panorama
        position absolute;
        z-index 200;
        right 10px;
        top 160px;
        width 350px;
        height 350px;
        border 1px solid #DCDFE6;
      .ranging-tool,
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
        &.panorama-tool
          top 127px
      .loading
        position absolute
        z-index 200
        top 30px
        left 50%
        padding 5px 0px
        margin-left -100px
        width 150px
        height 30px
        line-height 30px
        border-radius 7px
        border 1px solid #ddd
        background rgba(255, 255, 255, .9)
        text-align center
        color #20A0FF
        .text
          font-size 14px
      .fence-wrapper
        position absolute
        z-index 150
        top 100px
        right 0
        width 380px
        background white
        transition .5s all
        &.shrink
          right -380px
        nav
          position absolute
          top 29px
          left -33px
          width 30px
          padding 4px 1px
          color white
          background #20A0FF
          text-align center
          border-radius 3px
          cursor pointer
        .add
          padding 7px 9px
          position absolute
          top 0
          left -33px

    >.bottom
      position relative
      flex 0 0 auto
      width 100%
      .top-wrapper
        position absolute
        right 0
        top -29px
        >.el-button+.el-button
          margin-left 0px
        .refreshCountDown
          position absolute
          top -21px
          right 0
      #monitorBottom
        top 0px !important
        width 100% !important
</style>
