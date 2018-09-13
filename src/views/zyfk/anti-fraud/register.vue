<template>
  <el-dialog
      ref="dialog"
      title="位置登记"
      width="70%"
      top="5vh"
      custom-class="register-dialog"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <!-- <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section> -->
    <section>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <span class="forecast">预测</span>
        <el-form-item label="住址" prop="rolename">
          <a v-if="homeForecast" @click="showAddress(1)" class="address">{{homeForecast}}</a>
          <span v-else>N/A</span>
          <!-- <el-input v-model.trim="form.rolename" readonly ></el-input> -->
        </el-form-item>
        <el-form-item label="单位" prop="">
          <a v-if="companyForecast" @click="showAddress(2)" class="address">{{companyForecast}}</a>
          <span v-else>N/A</span>
          <!-- <el-input v-model.trim="form.roledesc" readonly ></el-input> -->
        </el-form-item>
        <span class="register">登记</span>
        <el-form-item label="住址" prop="homeRegister">
          <el-input class="w-300" v-model.trim="form.homeRegister" @click.native="showAddress(3)" readonly></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="companyRegister">
          <el-input class="w-300" v-model.trim="form.companyRegister" @click.native="showAddress(4)" readonly></el-input>
          <el-button class="m-l-10" size="small" type="primary" @click="onSubmit">登记</el-button>
        </el-form-item>
        <el-form-item label="" prop="">
        </el-form-item>
      </el-form>
      <div class="map-wrapper">
        <el-amap-search-box class="search-box" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap
          ref="map"
          vid="registerAmap"
          style="width: 100%; height: 100%"
          :events="events">
          <el-amap-marker v-for="(marker, index) in markers"
                          :key="'markers' + index"
                          :vid="index"
                          :position="marker" >
          </el-amap-marker>
          <el-amap-marker v-for="(marker, index) in stopMarkers"
                          :key="'stopMarkers' + index"
                          :vid="index"
                          :position="marker.position"
                          :title="marker.title"
                          :offset="[-10, -15]"
                          :events="marker.events"
                          :extData="marker.extData"
                          :contentRender="marker.contentRender" >
          </el-amap-marker>
          <el-amap-info-window v-for="(window, index) in windows"
                                :key="'windows' + index"
                                :vid="index"
                                :position="window.position"
                                :contentRender="window.contentRender"
                                :visible="window.visible"
                                :events="window.events"
                                :offset="window.offset">
          </el-amap-info-window>
        </el-amap>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      companyForecast: '',
      homeForecast: '',
      dialogVisible: false,
      markers: [],
      stopMarkers: [],
      windows: [],
      events: {
        /* eslint-disable no-unused-vars */
        init: (map) => {
          this.geocoder = new AMap.Geocoder();
        },
        click: (mapEvents) => {
          const { lnglat: { lng, lat } } = mapEvents;
          this.setAddress({ lng, lat });
        },
      },
      typeOptions: [],
      form: {
        id: null,
        vehicleid: null,
        homeRegister: null,
        companyRegister: null,
        latHomeRegister: null,
        lngHomeRegister: null,
        latCompanyRegister: null,
        lngCompanyRegister: null,
      },
      rules: {
        homeRegister: [{ required: true, message: '请选择登记住址' }],
        companyRegister: [{ required: true, message: '请选择登记单位' }],
        // roledesc: [{ required: true, message: '请输入描述' }],
      },
    };
  },
  computed: {
    $map() {
      return this.$refs.map.$$getInstance();
    },
  },
  methods: {
    clear() {
      for (const i in this.form) {
        if (this.form[i]) {
          this.form[i] = null;
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.stopMarkers = [];
      this.windows = [];
      this.markers = [];
    },
    async open(params) {
      const { vehicleid,
              companyForecast,
              homeForecast,
              id,
              homeRegister,
              companyRegister,
              } = params;
      this._params = params;
      this.dialogVisible = true;
      this.clear();
      if (id) this.form.id = id;
      this.form.vehicleid = vehicleid;
      this.form.homeRegister = homeRegister;
      this.form.companyRegister = companyRegister;
      this.companyForecast = companyForecast;
      this.homeForecast = homeForecast;
      this.getStopPoint();
      // this.preLoading = true;
      // await this.getById();
      // this.preLoading = false;
    },
    async getStopPoint() {
      const { data } = await this.apiPost('/vehicle/getDeviceStopDataThreeMonths', { vehicleid: this.form.vehicleid });
      data.forEach((i) => {
        const { lng, lat, adress, stoptime } = i;
        this.stopMarkers.push({
          events: {
            click: this.handlePointClick,
          },
          extData: i,
          position: [lng, lat],
          title: `${adress}, 停留时长: ${this.$secondsFormat(stoptime / 1000, false)}`,
          contentRender: () => (
              <svg-icon icon-class="pack" class="packIcon"></svg-icon>
            ),
        });
      });
      this.$nextTick(() => {
        this.$map.setFitView();
      });
      // this.stopMarkers = data.map(({ lng, lat }) => [lng, lat]);
    },
    showAddress(type) {
      this.windows = [];
      let lng = null;
      let lat = null;
      let name = '';
      let address = '';
      const {
              lngCompanyForecast,
              latCompanyForecast,
              lngHomeForecast,
              latHomeForecast,
              lngCompanyRegister,
              latCompanyRegister,
              lngHomeRegister,
              latHomeRegister,
              companyForecast,
              homeForecast,
              companyRegister,
              homeRegister,
            } = this._params;
      if (type === 1) {
        name = '预测住址';
        address = homeForecast;
        lng = lngHomeForecast;
        lat = latHomeForecast;
      } else if (type === 2) {
        name = '预测单位';
        address = companyForecast;
        lng = lngCompanyForecast;
        lat = latCompanyForecast;
      } else if (type === 3) {
        name = '登记住址';
        address = this.form.homeRegister || homeRegister;
        lng = this.lngHomeRegister || lngHomeRegister;
        lat = this.latHomeRegister || latHomeRegister;
      } else {
        name = '登记单位';
        address = this.companyRegister || companyRegister;
        lng = this.lngCompanyRegister || lngCompanyRegister;
        lat = this.latCompanyRegister || latCompanyRegister;
      }
      if (!lng || !lat) return;
      this.$nextTick(() => {
        this.windows = [
          {
            position: [lng, lat],
            offset: [0, 0],
            contentRender: () => (
                <div>
                  <p class="f-w-b fz-18">{name}:</p>
                  <p>{address}</p>
                </div>
              ),
            content: `

            `,
            visible: true,
            events: {
              close() {
              },
            },
          },
        ];
      });
    },
    handlePointClick(event) {
      this.windows = [];
      const { target: { G: { extData:
        { starttime, endtime, adress, lng, lat } } } } = event;
      this.$nextTick(() => {
        this.windows = [
          {
            position: [lng, lat],
            offset: [0, 0],
            contentRender: () => (
                <div>
                  停留开始时间: {starttime}
                  <br />
                  停留结束时间: {endtime}
                  <br />
                  地址: {adress}
                </div>
              ),
            content: `

            `,
            visible: true,
            events: {
              close() {
              },
            },
          },
        ];
      });
    },
    onSubmit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          try {
            await this.apiPost('/vehicle/updateAntiFraudVehicle', this.form);
            this.$message({
              message: '登记成功',
              type: 'success',
            });
            this.dialogVisible = false;
            this.$emit('init');
          } finally {
            //
          }
        }
      });
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
    setRegisterAddress(type) {
      if (type === 0) {
        this.form.homeRegister = this.position.address;
        this.form.latHomeRegister = this.position.lat;
        this.form.lngHomeRegister = this.position.lng;
      } else {
        this.form.companyRegister = this.position.address;
        this.form.latCompanyRegister = this.position.lat;
        this.form.lngCompanyRegister = this.position.lng;
      }
    },
    setAddress(center) {
      this.markers = [];
      this.windows = [];
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
              contentRender: () => (
                  <div>
                    经度: {lng}
                    <br />
                    纬度: {lat}
                    <br />
                    地址: {formattedAddress}
                    <br />
                    <el-button type="primary" size="mini" onClick={() => this.setRegisterAddress(0)}>设为登记住址</el-button>
                    <el-button type="primary" size="mini" onClick={() => this.setRegisterAddress(1)}>设为登记单位</el-button>
                  </div>
                ),
              content: `

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

<style lang="stylus">
.register-dialog
  .el-dialog__body
    padding: 30px 0px 0px

.packIcon
  background #fff
  border-radius 50%
  font-size 20px
  color #409EFF
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .address
    cursor pointer
    &:hover
      text-decoration underline

  .map-wrapper
    position: relative
    width: 100%
    height: 450px
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

  .check-group
    margin-left: -30px;
  .el-form-item
    position relative
    &:last-child
      &:before
        display none
    &:before
      content ''
      position absolute
      left 60px
      top 50%
      width 20px
      height 1px
      background #ccc

  .forecast,
  .register
    position absolute
    left 26px
    top 105px
    padding 18px 5px 27px 0px
    border-right 1px solid #ccc
    &.register
      top 228px
</style>
