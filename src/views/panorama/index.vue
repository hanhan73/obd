<template>
  <div class="bm-wrapper" :class="{ 'full-screen': fullScreen }">
    <baidu-map
      id="panorama"
      class="bm-view"
      ak="N2BOjBfbT8O9AkGAfS2XmaR4URhKi0Q4"
      :center="center"
      scroll-wheel-zoom
      @ready="handleReady">
      <!-- <bm-panorama></bm-panorama> -->
      <i class="fa fz-24 expand" :class="`fa-${fullScreen ? 'compress'  : 'arrows-alt'}`" aria-hidden="true" @click="fullScreen = !fullScreen"></i>
    </baidu-map>
    <div v-show="!hasPanorama" class="no-panorama">
      <h1>当前位置没有街景</h1>
    </div>
  </div>
</template>

<script>
import { BaiduMap } from 'vue-baidu-map';

export default {
  data() {
    return {
      center: '深圳',
      hasPanorama: true,
      fullScreen: false,
      params: {
        lng: null,
        lat: null,
        txt: null,
      },
      isReady: false,
    };
  },
  methods: {
    // eslint-disable-next-line
    handleReady({ BMap, map }) {
      this.BMap = BMap;
      this.convertor = new BMap.Convertor();
      this.panorama = new this.BMap.Panorama('panorama');
      this.panoramaService = new this.BMap.PanoramaService();
      this.isReady = true;
      // this.$nextTick(() => {
      //   this.setPosition(130.31, 31.58);
      // });
      const { lng, lat, txt } = this.params;
      if (lng && lat) {
        this.setPosition(lng, lat, txt);
      }
    },
    setPositionAsync(...args) {
      if (this.isReady) {
        this.setPosition(...args);
      } else {
        this.params.lng = args[0];
        this.params.lat = args[1];
        this.params.txt = args[2];
      }
    },
    setPosition(lng, lat, txt = '') {
      let flash = null;
      if (window.ActiveXObject) {
        flash = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      } else {
        flash = navigator.plugins['Shockwave Flash'];
      }
      if (!flash) {
        this.$alert('您还没有安装flash播放器,请点击这里<a href="https://get.adobe.com/cn/flashplayer/" target="_blank" style="color: #FF5722;text-decoration: underline">安装</a>（Tips:如果您已经安装最新版flash，请设置浏览器允许加载flash插件）', '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
        });
      }
      let point = new this.BMap.Point(lng, lat);
      this.convertor.translate([point], 3, 5, (convertor) => {
        if (convertor.status === 0) {
          point = convertor.points[0];
          this.panoramaService.getPanoramaByLocation(point, (data) => {
            if (data === null) {
              this.hasPanorama = false;
              return;
            }
            this.hasPanorama = true;
            this.panorama.setPosition(point);
            const labelOptions = {
              position: point,
              altitude: 5,
            };// 设置标注点的经纬度位置和高度
            if (this._label) {
              this.panorama.removeOverlay(this._label);
              this._label = null;
            }
            this._label = new this.BMap.PanoramaLabel(txt, labelOptions);
            this.panorama.addOverlay(this._label);// 在全景地图里添加该标注
          });
        }
      });
    },
  },
  components: {
    BaiduMap,
    // BmPanorama,
  },
};
</script>

<style lang="stylus" scoped>
.bm-wrapper
  position: relative;
  &.full-screen
    position: fixed !important;
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height 100% !important;
    width: 100% !important;
    z-index 20000 !important;
  .bm-view
    position: relative;
    height: 100%;
    width: 100%;
    .expand
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 5px;
      z-index: 1500;
      cursor: pointer;
      color: #409EFF;
      background: rgba(255, 255, 255, .95)
      border-radius: 3px;
  .no-panorama
    position absolute
    top: 0
    width: 100%
    height: 100%
    background #ffffff
    h1
      position absolute
      z-index 10000
      top 50%
      width: 100%
      transform translateY(-50%)
      text-align center
      font-size 30px
      font-weight bold
      color: #606266

</style>
