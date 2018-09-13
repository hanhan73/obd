<template>
  <div class="fence-wrapper">
    <section class="left ovf-hd">
      <el-tabs type="border-card" class="body-padding-0 height-100p" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="地理围栏" name="geoFence">
          <fence-list ref="fenceList"
                      @handleAddFence="handleAddFence"
                      @handleBindDevice="(fenceId, desc) => $refs.bindDevice.open(fenceId, 1, desc)"
                      @searchRelationDev="(fenceId, desc) => $refs.bindDevice.open(fenceId, 0, desc)"
                      @handleFenceRowClick="handleFenceRowClick"></fence-list>
        </el-tab-pane>
        <el-tab-pane label="行政区围栏" name="districtFence">
          <city :area-node="areaNode"
                @handleNodeClick="handleNodeClick"
                @handleTreeLoad="handleTreeLoad"
          ></city>
        </el-tab-pane>
        <el-tab-pane label="设备列表">
          <device-list ref="deviceList" @handleDeviceRowClick="handleDeviceRowClick"></device-list>
        </el-tab-pane>
      </el-tabs>
    </section>
    <section class="right">
      <div class="btn-wrapper">
        <el-button size="mini" type="danger" @click.stop="clearAllOverLays">清除</el-button>
        <el-button v-show="saveStatus" size="mini" type="primary" @click.stop="handleSaveFence">保存围栏</el-button>
        <el-button v-show="isNewFence" size="mini" type="primary" @click.stop="closeMouseTool">取消新增</el-button>
      </div>
      <el-amap  vid="regionalFence"
                key="regionalFence"
                :events="events"
                :animateEnable="false"
                :resizeEnable="false"
                :jogEnable="false"
                ref="amap"
                class="ovf-hd"
                @mousedown.stop @mousemove.stop @mouseout.stop @mouseover.stop @mouseup.stop @mousewheel.stop @click.stop @dblclick.stop
                >
        <el-amap-marker v-for="(marker, index) in markers"
                        :vid="`marker${index}`"
                        :key="`marker${index}`"
                        :position="marker.position"
                        animation="AMAP_ANIMATION_DROP"
                        :offset="marker.offset ? marker.offset : [-10,-34]"
                        :contentRender="marker.contentRender"
                        :angle="marker.angle || 0"
                        :zIndex="marker.zIndex"
                        :title="marker.title"
                        :events="marker.events"
                        :extData="marker.extData"
                        :visible="marker.visible">
        </el-amap-marker>
        <!-- <el-amap-info-window v-for="(window, index) in windows"
                              :vid="`${random}${index}`"
                              :key="`${random}${index}`"
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
        </el-amap-info-window> -->
        <el-amap-circle v-for="(circle, index) in circles"
                        ref="circles"
                        :key="index"
                        :editable="circle.editable || false"
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
      </el-amap>
    </section>
    <bind-device ref="bindDevice" @handleBindDevice="(args) => $refs.addFence.open(args)"></bind-device>
    <add-fence ref="addFence" @init="$refs.fenceList.getAll()"></add-fence>
    <partner-list ref="partnerList" :currentArea="currentArea"></partner-list>
  </div>
</template>

<script>
import http from '@/assets/js/http';

import DeviceList from './device-list';
import FenceList from './fence-list';
import BindDevice from './bind-device';
import City from './city';
import AddFence from './add-fence';
import PartnerList from './partner-list';

export default {
  mixins: [http],
  data() {
    return {
      isNewFence: false,
      activeName: 'geoFence',
      saveStatus: false,
      currentArea: {
        provinceName: null,
        cityName: null,
      },
      filterFeature: ['台湾省', '香港特别行政区', '澳门特别行政区'],
      areaNode: [],
      polygons: [],
      circles: [],
      windows: [],
      markers: [],
      events: {
        init: () => {
          this.geocoder = new AMap.Geocoder();
          // 行政区浏览
          AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
            // 启动页面
            this.init(DistrictExplorer);
          });
        },
      },
    };
  },
  computed: {
    $map() {
      return this.$refs.amap.$$getInstance();
    },
  },
  methods: {
    init(DistrictExplorer) {
      const map = this.$map;
      // 创建一个实例
      this.districtExplorer = new DistrictExplorer({
        eventSupport: true, // 打开事件支持
        map, // 关联的地图实例
      });

      const adcode = 100000; // 全国的区划编码

      this.loadAreaNode(adcode);
    },
    handleTabClick({ name }) {
      if (name !== 'districtFence') {
        this.districtExplorer.clearFeaturePolygons();
      }
    },
    handleTreeLoad({ node, resolve }) {
      if (!node.data.adcode) {
        return;
      }
      this.loadAreaNode(node.data.adcode, resolve);
    },
    handleNodeClick(data) {
      this.loadNode(data, data.geometry.coordinates);
    },
    async loadNode(props) {
      // 如果存在子节点
      if (props.childrenNum > 0 && props.level !== 'city') {
        // 切换聚焦区域
        this.currentArea.provinceName = props.name;
        this.loadAreaNode(props.adcode);
      } else {
        this.currentArea.cityName = props.name;
        const [{ G:
                  { path: [coordinates] },
              }] = this.districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
        this.$refs.partnerList.open(coordinates, this.currentArea);
        this.loadAreaNode(props.adcode);
      }
    },
    filterGeoData(features) {
      return R.map(i => ({
        geometry: i.geometry,
        name: i.properties.name,
        adcode: i.properties.adcode,
        level: i.properties.level,
        childrenNum: i.properties.childrenNum,
        isLeaf:
          i.properties.level !== 'province',
        children: [],
      }))(features);
    },
    normalizeAreaNode(areaNode) {
      const geoData = areaNode._data.geoData;
      const parent = geoData.parent.properties;
      const pLevel = geoData.parent.properties.level;
      const features = geoData.sub.features;
      if (pLevel === 'country') {
        // 过滤掉 [台湾省, 香港特别行政区, 澳门特别行政区]
        this.areaNode = R.filter(
          i => R.findIndex(item => item === i.name)(this.filterFeature) === -1,
        )(this.filterGeoData(features));
      } else if (pLevel === 'province') {
        const index = this.areaNode.findIndex(item => item.adcode === parent.adcode);
        if (features.length > 0 && this.areaNode[index].children.length === 0) {
          return this.filterGeoData(features);
        }
      }
      return [];
    },
    async loadAreaNode(adcode, resolve = () => {}) {
      this.isLoading = true;
      const areaNode = await this.fetchAreaNode(adcode);
      this.isLoading = false;
      resolve(this.normalizeAreaNode(areaNode));
      // 保存当前显示的区域
      this.currentAreaNode = areaNode;
      // console.log(areaNode);
      this.districtExplorer.setAreaNodesForLocating([areaNode]);
      if (adcode === 100000) return;
      // 绘制载入的区划节点
      this.renderAreaNode(areaNode);
    },
    fetchAreaNode(adcode) {
      return new Promise((resolve) => {
        this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
          this.isLoading = false;
          if (error) {
            resolve([]);
            return;
          }
          resolve(areaNode);
        });
      });
    },
    renderAreaNode(areaNode) {
      // 清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      // // just some colors
      // const colors = [
      //   '#3366cc',
      //   '#dc3912',
      //   '#ff9900',
      //   '#109618',
      //   '#990099',
      //   '#0099c6',
      //   '#dd4477',
      //   '#66aa00',
      // ];

      // 绘制子级区划
      this.districtExplorer.renderSubFeatures(areaNode, () => {
        const fillColor = '#3366cc';
        const strokeColor = null;

        return {
          // cursor: 'default',
          bubble: true,
          strokeColor, // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线宽
          fillColor, // 填充色
          fillOpacity: 0.35, // 填充透明度
        };
      });

      // // 绘制父级区划，仅用黑色描边
      this.districtExplorer.renderParentFeature(areaNode, {
        // cursor: 'default',
        bubble: true,
        strokeColor: 'black', //  线颜色
        fillColor: null,
        strokeWeight: 1, // 线宽
      });

      // 更新地图视野以适合区划面
      this.$map.setFitView(this.districtExplorer.getAllFeaturePolygons());
    },
    clearAllOverLays() {
      this.markers = [];
      this.clearCirclesAndPolygons();
    },
    clearCirclesAndPolygons() {
      this.saveStatus = false;
      this.circles = [];
      this.polygons = [];
    },
    handleAddFence() {
      const map = this.$map;
      this.clearCirclesAndPolygons();
      if (this._mousetool) {
        this.closeMouseTool();
        return;
      }
      this.isNewFence = true;
      map.setDefaultCursor('crosshair');
      const mousetool = new AMap.MouseTool(map);
      this._mousetool = mousetool;
      mousetool.circle({ map });
      mousetool.on('draw', ({ obj }) => {
        const { Qi: { center: { lng, lat }, radius } } = obj;
        if (radius < 100 || radius > 10000) {
          _g.toastMsg('error', '半径不能小于100米且不能大于10千米');
          this.closeMouseTool();
          this.handleAddFence();
        } else {
          this.$refs.addFence.open({ lng, lat, radius });
          this.$refs.addFence.handleClose = () => {
            this.closeMouseTool();
          };
          this.$refs.addFence.afterAdd = () => {
            this.closeMouseTool();
          };
        }
      });
    },
    async handleSaveFence() {
      try {
        const { Qi: { center: { lng: lon, lat }, radius } } = this.$refs.circles[0].$$getInstance();
        if (radius < 100 || radius > 10000) {
          _g.toastMsg('error', '半径不能小于100米且不能大于10千米');
          return;
        }
        await this.apiPost('/fence/updfence', { fenceId: this._editFenceId, lon, lat, radius });
        _g.toastMsg('success', '保存成功');
        this.$refs.fenceList.getAll();
      } catch (e) {
        //
      }
    },
    closeMouseTool() {
      if (this._mousetool) {
        this.$map.setDefaultCursor('pointer');
        this._mousetool.close(true);
        this._mousetool = null;
        this.isNewFence = false;
      }
    },
    handleFenceRowClick({ fenceId, lon: lng, lat, radius, fenceType }) {
      this.clearCirclesAndPolygons();
      if (fenceType === 0) {
        this.saveStatus = true;
        this._editFenceId = fenceId;
        this.circles = [{
          center: [lng, lat],
          radius,
          editable: true,
        }];
        this.setFitView();
      }
    },
    async handleDeviceRowClick({ sn }) {
      this.markers = [];
      try {
        const { data } = await this.apiPost('/device/qryDeviceData', { sn });
        if (!data.length) throw new Error('data is empty');
        const [{ gpsinfo: { lng, lat } }] = data;
        if (lng === '' || lat === '') throw new Error('gpsinfo is empty');
        this.markers.push({
          position: [lng, lat],
          // eslint-disable-next-line
          contentRender(h) {
            return (
              <img src="/static/images/mark_bs.png" />
            );
          },
        });
        this.setFitView();
      } catch (e) {
        _g.toastMsg('warning', '暂无定位数据');
      }
    },
    setFitView() {
      const map = this.$map;
      this.$nextTick(() => {
        map.setFitView(map.getAllOverlays(['circle', 'marker']));
      });
    },
  },
  components: {
    DeviceList,
    FenceList,
    BindDevice,
    City,
    AddFence,
    PartnerList,
  },
};
</script>

<style>
.tipMarker {
  color:#555;
  background-color:rgba(255,254,239,0.8);
  border:1px solid #7E7E7E;
  padding:2px 6px;
  font-size:12px;
  white-space:nowrap;
  display:inline-block;
}
.tipMarker:before,
.tipMarker:after {
  content:'';
  display:block;
  position:absolute;
  margin:auto;
  width:0;
  height:0;
  border:solid transparent;
  border-width:5px 5px;
}
.tipMarker.top {
  transform:translate(-50%,-110%);
}
.tipMarker.top:before,
.tipMarker.top:after {
  bottom:-9px;
  left:0;
  right:0;
  border-top-color:rgba(255,254,239,0.8);
}
.tipMarker.top:before {
  bottom:-10px;
  border-top-color:#7E7E7E;
}
</style>


<style lang="stylus" scoped>
  .fence-wrapper
    display: flex
    width: 100%
    height: 100%
    .left
      width: 0
      flex: 0 0 550px
    .right
      flex: 1 1 auto
      display: flex
      flex-direction: column
      .btn-wrapper
        padding: 3px
      .map
        flex: 1 1 auto
</style>
