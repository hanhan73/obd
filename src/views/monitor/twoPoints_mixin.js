import http from '@/assets/js/http';
import Vue from 'vue';

const stationTypeMap = {
  3: '二手车市场',
  4: '担保公司',
  5: '二押公司',
  6: '二押仓库',
  7: '拆机点',
  8: '其他',
};
window.st = function () {
  const name = window.han.addTwoPointForm.name;
  const type = window.han.addTwoPointForm.type;
  const remark0 = window.han.addTwoPointForm.remark;
  const lng0 = window.han.addTwoPointForm.lng;
  const lat0 = window.han.addTwoPointForm.lat;
  if (name == null) {
    _g.toastMsg('warning', '二押点名称不能为空');
    return;
  }
  if (type == null) {
    _g.toastMsg('warning', '类型不能为空');
    return;
  }
  const { data } = window.han.apiPost('/twoStation/saveTwoStation', { stationName: name, stationType: type, remark: remark0, lon: lng0, lat: lat0 });
  console.log(data);
  if (data === undefined) {
    _g.toastMsg('success', '新建成功');
    window.han.clear();
  }
};
export default {
  data() {
    return {
      twoPointsStatus: false,
      twoPointsLoading: false,
    };
  },
  methods: {
    getRandom() {
      return Math.random().toString().replace('.', '');
    },
    async handleAddTwoPoint() {
      // this.clearAllData();
      const map = this.$map;
      const { lng, lat } = map.getCenter();
      const position = [lng, lat];
      let address = '';
      try {
        const { regeocode: { formattedAddress } } = await this.getAddress(position);
        address = formattedAddress;
      } catch (e) {
        address = '';
      }
      this._twopoint = this.markers.push({
        id: this.getRandom(),
        name: 'other',
        position,
        template: `
          <img src="/static/images/newTwoPoint.png"/>
        `,
        draggable: true,
        events: {
          dragging: (event) => {
            const { target: { Qi } } = event;
            this.windows[this._addTwoPointIndex].position = [Qi.position.lng, Qi.position.lat];
          },
          dragend: (event) => {
            const { lnglat } = event;
            const ob = [];
            this.getAddress([lnglat.lng, lnglat.lat]).then(
              ({ regeocode: { formattedAddress } }) => {
                ob.ad = formattedAddress;
                ob.po = [lnglat.lng, lnglat.lat];
                this.$bus.emit('dragend', ob);
              },
            );
          },
        },
      });
      this._addTwoPointIndex = this.windows.push({
        id: this.getRandom(),
        position,
        autoMove: false,
        title: 'other',
        visible: true,
        offset: [7, -15],
        template: '',
        content: new Vue({
          mixins: [http],
          data() {
            return {
              addTwoPointForm: {
                address,
                lng,
                lat,
                name: null,
                type: null,
                remark: null,
              },
            };
          },
          created() {
            this.$bus.on('dragend', (addr) => {
              this.addTwoPointForm.address = addr.ad;
              this.addTwoPointForm.lng = addr.po[0];
              this.addTwoPointForm.lat = addr.po[1];
            });
            window.han = this;
          },
          render() {
            const options = Object.keys(stationTypeMap)
                                  .map(
            i => <el-option key={i} label={stationTypeMap[i]} value={i} />);
            return <section class="info-windows">
                <h1 class="c-blue f-w-b m-b-15">共享标注点设置</h1>
                <el-form size="mini" label-width="50px" >
                  <el-form-item label="名称:">
                    <el-input v-model={this.addTwoPointForm.name} placeholder="格式: 路名(地标)" />
                  </el-form-item>
                  <el-form-item label="类型:">
                    <el-select v-model={this.addTwoPointForm.type} placeholder="请选择二押类型">
                      {options}
                    </el-select>
                  </el-form-item>
                  <el-form-item label="地址:">
                    <el-input v-model={this.addTwoPointForm.address}
          readonly type="textarea" autosize={{ minRows: 2, maxRows: 4 }} />
                  </el-form-item>
                  <el-form-item label="备注:">
                    <el-input v-model={this.addTwoPointForm.remark} />
                  </el-form-item>
                  <el-form-item label="">
                    <el-button onclick="st()" size="small" type="primary" >
                      保存
                    </el-button>
                  </el-form-item>
                </el-form>
              </section>;
          },
        }).$mount(document.createElement('div')).$el,
        events: {
          close: () => {
            this.clearData();
          },
        },
      });
      this._addTwoPointIndex -= 1;
    },
    async triggerTwoPointsStatus() {
      this.twoPointsStatus = !this.twoPointsStatus;
      if (this.twoPointsStatus) {
        this.twoPointsLoading = true;
        const { data } = await this.apiPost('/twoStation/getTwoStationList', { pageSize: 100000 });
        this.twoPointsLoading = false;
        this._twoStationList = data;
        this.showTwoPoints();
      } else {
        this.windows = this.windows.filter(i => !i.extData || i.extData._type !== 'twoBet');
        this.markers = this.markers.filter(i => !i.extData || i.extData._type !== 'twoBet');
      }
    },
    showTwoPoints(pos) {
      if (!pos) {
        if (!this._currentMarkerId) return;
        const index = this.markers.findIndex(i => i.id === this._currentMarkerId);
        if (index === -1) return;
        pos = this.markers[index].position;
      }
      const distance = 5000; // 距离当前显示的设备五公里以内的二押点显示出来
      const lnglat = new AMap.LngLat(...pos);
      const twoStationList = this._twoStationList.filter(i =>
        lnglat.distance([i.lon, i.lat]) < distance,
      );
      twoStationList.forEach((item) => {
        const position = [item.lon, item.lat];
        this.markers.push({
          id: this.getRandom(),
          name: 'other',
          extData: {
            _type: 'twoBet',
            ...item,
          },
          template: `
              <div class="pos-rel two-pledge">
                <i class="icon-wrapper">
                  <svg-icon icon-class="pledge" style="color: #EA8010"></svg-icon>
                </i>
                <el-tag class="txt" size="mini" style="position: absolute;top: 0; left: 25px">${item.stationName}</el-tag>
              </div>
            `,
          position,
          events: {
            click: (e) => {
              this.windows = this.windows.filter(i => !i.extData || i.extData._type !== 'twoBet');
              const {
                target: { Qi: { extData: { stationName, stationType, location, remark } } },
              } = e;
              const vNode = new Vue({
                // data() {
                //   return {
                //     searchDistance: 0,
                //   };
                // },
                render() {
                  return <section class="info-windows info-windows-pledge">
                      <p>
                        <a>名称:</a> <a>{stationName}</a>
                      </p>
                      <p>
                        <a>类型:</a> <a>
                          {stationTypeMap[stationType]}
                        </a>
                      </p>
                      <p>
                        <a>地址:</a>
                        <a>{location}</a>
                      </p>
                      <p>
                        <a>备注:</a> <a>{remark}</a>
                      </p>
                      {/* <el-slider v-model="searchDistance">
                        </el-slider> */}
                    </section>;
                },
              });
              const dom = document.createElement('div');
              const el = vNode.$mount(dom).$el;
              this.windows.push({
                id: this.getRandom(),
                title: 'other',
                position,
                visible: true,
                isCustom: false,
                size: new AMap.Size(320, 143),
                offset: [3, -20],
                extData: {
                  _type: 'twoBet',
                },
                content: el,
                template: '',
              });
            },
          },
        });
      });
      // if (twoStationList.length) {
      //   this.$nextTick(() => {
      //     const map = this.$map;
      //     map.setFitView(map.getAllOverlays('marker'));
      //   });
      // }
    },
  },
};
