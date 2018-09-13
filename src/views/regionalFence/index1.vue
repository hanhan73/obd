<template>
  <div class="wrapper">
    <section class="right">
      <div class="loading animated"
           v-show="isLoading"
           :class="{ bounceIn: isLoading }">
        <i class="el-icon-loading"></i>
        <span class="text">&nbsp;拼命加载中...</span>
      </div>
      <el-amap :vid="'regionalFence'"
               :events="events"
               :amap-manager="amapManager"
               >
      </el-amap>
    </section>
    <section class="left">
      <city :area-node="areaNode"
            @handleNodeClick="handleNodeClick"
            @handleTreeLoad="handleTreeLoad"
      ></city>
    </section>
    <partner-list ref="partnerList" :currentArea="currentArea"></partner-list>
  </div>
</template>

<script>
import VueAMap from 'vue-amap';

import http from '@/assets/js/http';
import City from './city';
import PartnerList from './partner-list';

const amapManager = new VueAMap.AMapManager();

export default {
  name: escapeName('区域围栏'),
  mixins: [http],
  data() {
    const _this = this;
    return {
      currentArea: {
        provinceName: null,
        cityName: null,
      },
      filterFeature: ['台湾省', '香港特别行政区', '澳门特别行政区'],
      isLoading: false,
      areaNode: [],
      amapManager,
      events: {
        /* eslint-disable no-unused-vars */
        init(map) {
          _this.geocoder = new AMap.Geocoder();
          // 行政区浏览
          AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer =>
            // 启动页面
            _this.start(DistrictExplorer),
          );
        },
      },
    };
  },
  computed: {},
  created() {
    this._areaNode = [];
  },
  methods: {
    init() {
      // TODO
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
    loadNode(props, coordinates) {
      // 如果存在子节点
      if (props.childrenNum > 0 && props.level !== 'city') {
        // 切换聚焦区域
        this.currentArea.provinceName = props.name;
        this.loadAreaNode(props.adcode);
      } else {
        this.currentArea.cityName = props.name;
        this.$refs.partnerList.open(coordinates);
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
    start(DistrictExplorer) {
      const map = amapManager.getMap();
      // 创建一个实例
      this.districtExplorer = new DistrictExplorer({
        eventSupport: true, // 打开事件支持
        map, // 关联的地图实例
      });

      // 当前聚焦的区域
      const currentAreaNode = null;

      // 鼠标hover提示内容
      const $tipMarkerContent = document.createElement('div');
      $tipMarkerContent.className = 'tipMarker top';

      const tipMarker = new AMap.Marker({
        content: $tipMarkerContent,
        offset: new AMap.Pixel(0, 0),
        bubble: true,
      });

      const _this = this;
      // 根据Hover状态设置相关样式
      function toggleHoverFeature(feature, isHover, position) {
        tipMarker.setMap(isHover ? map : null);

        if (!feature) {
          return;
        }

        const props = feature.properties;

        if (isHover) {
          // 更新提示内容
          $tipMarkerContent.innerHTML = `${props.adcode}: ${props.name}`;
          // 更新位置
          tipMarker.setPosition(position || props.center);
        }

        // $('#area-tree')
        //   .find('h2[data-adcode="' + props.adcode + '"]')
        //   .toggleClass('hover', isHover);

        // 更新相关多边形的样式
        const polys = _this.districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
        for (let i = 0, len = polys.length; i < len; i += 1) {
          polys[i].setOptions({
            fillOpacity: isHover ? 0.5 : 0.2,
          });
        }
      }

      // 监听feature的hover事件
      this.districtExplorer.on('featureMouseout featureMouseover', (e, feature) => {
        toggleHoverFeature(
          feature,
          e.type === 'featureMouseover',
          e.originalEvent ? e.originalEvent.lnglat : null,
        );
      });

      // 监听鼠标在feature上滑动
      this.districtExplorer.on('featureMousemove', (e, feature) => {
        // 更新提示位置
        tipMarker.setPosition(e.originalEvent.lnglat);
      });

      // feature被点击
      this.districtExplorer.on('featureClick', (e, feature) => {
        const props = feature.properties;
        if (this.filterFeature.indexOf(props.name) !== -1) {
          return;
        }
        this.loadNode(props, feature.geometry.coordinates);
      });

      // 外部区域被点击
      this.districtExplorer.on('outsideClick', e =>
        this.districtExplorer.locatePosition(
          e.originalEvent.lnglat,
          (error, routeFeatures) => {
            if (routeFeatures && routeFeatures.length > 1) {
              // 切换到省级区域
              this.loadAreaNode(routeFeatures[1].properties.adcode);
            } else {
              // 切换到全国
              this.loadAreaNode(100000);
            }
          },
          {
            levelLimit: 2,
          },
        ),
      );

      const adcode = 100000; // 全国的区划编码

      this.loadAreaNode(adcode);
    },
    loadAreaNode(adcode, resolve = () => {}) {
      this.isLoading = true;
      this.districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
        this.isLoading = false;
        if (error) {
          resolve([]);
          // console.error(error);
          return;
        }
        resolve(this.normalizeAreaNode(areaNode));
        // 保存当前显示的区域
        this.currentAreaNode = areaNode;
        // console.log(areaNode);
        this.districtExplorer.setAreaNodesForLocating([areaNode]);
        // 绘制载入的区划节点
        this.renderAreaNode(areaNode);
      });
    },
    renderAreaNode(areaNode) {
      // 清除已有的绘制内容
      this.districtExplorer.clearFeaturePolygons();

      // just some colors
      const colors = [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
      ];

      // 绘制子级区划
      this.districtExplorer.renderSubFeatures(areaNode, (feature, i) => {
        const fillColor = colors[i % colors.length];
        const strokeColor = colors[(colors.length - 1 - i) % colors.length];

        return {
          cursor: 'default',
          bubble: true,
          strokeColor, // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线宽
          fillColor, // 填充色
          fillOpacity: 0.35, // 填充透明度
        };
      });

      // 绘制父级区划，仅用黑色描边
      this.districtExplorer.renderParentFeature(areaNode, {
        cursor: 'default',
        bubble: true,
        strokeColor: 'black', //  线颜色
        fillColor: null,
        strokeWeight: 3, // 线宽
      });

      // 更新地图视野以适合区划面
      amapManager.getMap().setFitView(this.districtExplorer.getAllFeaturePolygons());
    },
  },
  components: {
    City,
    PartnerList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .wrapper
    display: flex
    height: 100%
    >.left
      flex: 0 0 200px
      padding: 2px
      box-sizing: border-box
      border-right: 1px solid #ccc
    >.right
      position: relative
      display: flex
      flex-direction: column
      flex: 1 1 auto
      width: 1px
      .loading
        position: absolute
        z-index: 1
        top: 30px
        left: 50%
        padding: 5px 0px
        margin-left: -100px
        width: 150px
        height: 30px
        line-height: 30px
        border-radius: 7px
        border: 1px solid #ddd
        background: rgba(255, 255, 255, .9)
        text-align: center
        color: #20A0FF
        .text
          font-size: 14px
</style>

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
