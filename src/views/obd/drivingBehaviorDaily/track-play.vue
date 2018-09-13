<template>
  <div class="map-wrapper">
    <el-amap class="map"
             vid="drivingBehaviorDaily"
             :events="events"
             :amap-manager="amapManager"
             >
      <el-amap-marker v-for="(marker, index) in markers"
                      :key="index"
                      :position="marker.position"
                      :animation="marker.animation"
                      :template="marker.template"
                      :offset="marker.offset ? marker.offset : [-10,-34]"
                      :angle="marker.angle"
                      :title="marker.title"
                      :events="marker.events"
                      :visible="marker.visible"
                      :draggable="marker.draggable">
      </el-amap-marker>
      <el-amap-info-window v-for="(window, index) in windows"
                           :key="index"
                           :position="window.position"
                           :content="window.content"
                           :visible="window.visible"
                           :autoMove="false">
      </el-amap-info-window>
    </el-amap>
    <div class="player-wrapper"
         v-show="showPlayer">
      <!-- <el-date-picker
        v-model="time"
        type="daterange"
        placeholder="选择日期范围"
        :picker-options="pickerOptions">
      </el-date-picker> -->
      <!-- <el-radio-group v-model="params.locationType" class="locationRatio">
        <el-radio :label="0">LBS</el-radio>
        <el-radio :label="1">GPS</el-radio>
      </el-radio-group> -->
      <!-- <el-button type="primary"
                  size="small"
                  :icon="isLoading ? 'loading' : 'search'"
                  :disabled="isLoading"
                  @click="showTrack">
      </el-button> -->
      <el-progress class="progress"
                    status="success"
                    :stroke-width="3"
                    :show-text="false"
                    :percentage="percent"
                    >
      </el-progress>
      <el-button :disabled="navig === null" class="player-btn" type="infor" size="small" @click="handlePlayOrPause">
        <i class="fa"
            :class="`fa-${isPlaying ? 'pause' : 'play'}`"
            aria-hidden="true">
        </i>
      </el-button>
      <el-button :disabled="navig === null" class="player-btn" type="infor" size="small" @click="handleStop">
        <i class="fa fa-stop" aria-hidden="true"></i>
      </el-button>
      <el-slider v-model="playerSpeed"
                  :disabled="navig === null"
                  class="slider"
                  :format-tooltip="formatTooltip"
                  @change="handleChangeOfSlider"
                  >
      </el-slider>
      <el-button type="danger"
                  size="mini"
                  @click="handleEscapeReplay">
                  退出回放
      </el-button>
    </div>
  </div>
</template>

<script>
import VueAMap from 'vue-amap';
import mapMixin from '@/assets/js/map_com';

const amapManager = new VueAMap.AMapManager();

export default {
  mixins: [
    mapMixin,
  ],
  data() {
    return {
      windows: [],
      markers: [],
      showPlayer: false,
      amapManager,
    };
  },
  methods: {
    play(data, [{ carnumber, sn }]) {
      this.showPlayer = true;
      this.clearAllData();
      const path = data.map(({ gpsinfo: { lng, lat } }) => [lng, lat]);
      this.path = [{
        name: '轨迹',
        path,
      }];
      this._currentTrackInfoWindowIndex = this.windows.push({
        title: 'other',
        position: path[0],
        visible: true,
        content: `
          <section class="info-windows">
            <h1><a>${carnumber}</a> <a></a></h1>
            <p><a>IMEI:</a> <a>${sn}</a></p>
          </section>
        `,
      });
      this._currentTrackInfoWindowIndex -= 1;
      this.start();
    },
    afterHandleStop() {
      this.windows[this._currentTrackInfoWindowIndex].position = this.path[0].path[0];
    },
    handleEscapeReplay() {
      this.showPlayer = false;
      this.clearAllData();
    },
    clearAllData() {
      this.markers = [];
      this.windows = [];
      this.destroyNavig();
      this.pathSimplifierIns.setData([]);
    },
    formatTooltip() {
      return `速度: ${this.speed} KM/H`;
    },
    handleChangeOfSlider() {
      if (this.navig) {
        this.navig.setSpeed(this.speed);
      }
    },
    onNavigatorMove() {
      const position = this.navig.getPosition();
      this.windows[this._currentTrackInfoWindowIndex].position = [position.lng, position.lat];
    },
  },
};
</script>

<style scope lang="stylus">
  .map-wrapper
    position: relative
    height: 600px
    .map
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
    .player-wrapper
      display: flex
      position: absolute
      z-index: 200
      top:5px
      right: 5px
      width: 300px
      padding: 5px 20px 5px 15px
      border: 1px solid #ccc
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

</style>

