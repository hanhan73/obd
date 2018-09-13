<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-cascader
        size="mini"
        style="margin: 2px 5px 0 0"
        placeholder="请选择账号名称"
        v-model="partnerid"
        :options="partnersTree"
        :props="{label: 'partnername', value: 'id', children: '_children'}"
        filterable
        clearable
        change-on-select
      ></el-cascader>
      <el-input size="mini" v-model="params.query" class="w-200" placeholder="请输入车牌号/车主姓名"></el-input>
      <el-select size="mini" v-model="params.queryOnline" clearable placeholder="请选择状态">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select size="mini" v-model="params.queryAlert" clearable placeholder="请选择报警状态">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-input size="mini" v-model="params.imei" class="w-200" placeholder="请输入IMEI"></el-input>
      <el-input size="mini" v-model="params.sn" class="w-200" placeholder="请输入SN"></el-input>
      <el-input size="mini" v-model="params.mobileno" class="w-200" placeholder="请输入联系电话"></el-input> -->
      <!-- <el-radio-group size="mini" v-model="params.activestatus" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group> -->
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
        <el-button size="mini" type="normal" @click="handleReset">
          <i class="fa fa-undo" aria-hidden="true"></i>
          重置
        </el-button>
        <el-popover
          placement="bottom"
          v-model="headerEditerVisible">
          <el-checkbox-group v-model="checkHeaderList">
            <el-checkbox v-for="(i, index) in headerList" :key="index" :label="i.headid">{{i.name}}</el-checkbox>
            <!-- <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
            <el-checkbox label="禁用" disabled></el-checkbox>
            <el-checkbox label="选中且禁用" disabled></el-checkbox> -->
          </el-checkbox-group>
          <div style="text-align: right; margin: 20px 0 0 0">
            <!-- <el-button size="mini" type="text" @click="headerEditerVisible = false">取消</el-button> -->
            <el-button type="primary" size="mini" @click="setTableHead">确定</el-button>
          </div>
          <el-button slot="reference" size="mini" type="normal" icon="el-icon-edit"></el-button>
        </el-popover>

        <!-- <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button> -->
        <!-- <el-button size="mini" type="normal" icon="plus" @click="$refs.add.open()">新增用户设备绑定</el-button> -->
      </div>
    </div>
    <el-table
      border
      size="mini"
      :data="tableData"
      :span-method="objectSpanMethod"
      v-loading="tableLoading"
      highlight-current-row>
      <!-- <el-table-column
        type="index"
        width="45px">
      </el-table-column> -->
      <el-table-column
        v-if="checkHeaderList.indexOf(1) !== -1"
        width="85"
        property="carNumber"
        label="车牌号">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(2) !== -1"
        width="80"
        property="userName"
        label="车主">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(3) !== -1"
        width="100"
        property="deviceinfo.devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(4) !== -1"
        width="100"
        property="partnerName"
        label="账号名称">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(5) !== -1"
        width="130px"
        property="deviceinfo.sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(6) !== -1"
        width="70px"
        property="deviceinfo.typecode"
        label="设备类型">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(7) !== -1"
        width="140px"
        property="deviceinfo.activetime"
        label="安装时间">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(8) !== -1"
        width="90px"
        property="deviceinfo.vehicleState"
        label="状态">
      </el-table-column>
      <!-- <el-table-column
        v-if="checkHeaderList.indexOf(1) !== -1"
        width="70"
        label="在线状态">
        <template slot-scope="{ row: { isOnline } }">
          <span v-if="isOnline" class="c-green">在线</span>
          <span v-else class="c-gray">离线</span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="checkHeaderList.indexOf(9) !== -1"
        width="70"
        label="报警">
        <template slot-scope="{ row: { deviceinfo } }">
          <span v-if="deviceinfo.alertName !== ''" class="c-red">{{deviceinfo.alertName}}</span>
          <span v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(10) !== -1"
        width="50px"
        property="deviceinfo.voltage"
        label="电量">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(11) !== -1"
        width="70px"
        property="deviceinfo.dateMil"
        label="当日里程">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(12) !== -1"
        width="70px"
        property="deviceinfo.totalMil"
        label="总里程">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(13) !== -1"
        align="center"
        width="140px"
        property="deviceinfo.gpsinfo.gpstime"
        label="定位时间">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(14) !== -1"
        :formatter="row => row.deviceinfo.gpsinfo.locationType=== '' ? '无定位' : locationTypeMap[row.deviceinfo.gpsinfo.locationType]"
        label="定位方式">
      </el-table-column>
      <el-table-column
        v-if="checkHeaderList.indexOf(15) !== -1"
        width="220px"
        prop="_address"
        label="位置">
        <!-- <template slot-scope="{ row: { lastLat, lastLng, _address }, $index }">
          <el-button v-if="!lastLat || !lastLng" type="text" size="mini" disabled>无定位数据</el-button>
          <el-button v-else-if="!_address" type="text" size="mini" @click="handleAnalysisLngLat($index)">解析</el-button>
          <span v-else>{{_address}}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column
        width="95"
        property="userPhone"
        label="联系电话">
      </el-table-column> -->
      <el-table-column
        min-width="240"
        label="操作">
        <template slot-scope="{ row: { userId, id, activestatus, deviceinfo} }">
          <el-button-group>
            <el-button type="primary" size="mini" @click="$refs.edit.open(id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeBinding(userId, id)">解除绑定</el-button>
            <!-- <el-button type="normal" size="mini" @click="$refs.detail.open(devicelist)">绑定详情</el-button> -->
            <el-button size="mini" type="normal" @click="$routerPush({name: '在线监控', path: '/main/monitor', props: { sn: deviceinfo.sn }})">
            跟踪
            </el-button>
            <!-- <router-link :to="{ name: '/monitor', params: { devicelist: devicelist }}">监控</router-link> -->
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 p-b-20 pages-footer">
      <div class="stat">
        <!-- <span class="title">汇总</span>
        <div style="display: inline" v-html="stat">
        </div> -->
      </div>
      <div class="block pages">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[15, 30, 60, 100]"
          :page-size="pagination.pageSize"
          :current-page="pagination.curPage"
          :total="pagination.dataCount">
        </el-pagination>
      </div>
    </div>
    <detail-table ref="detail"></detail-table>
    <!-- <add ref="add" @init="getAll"></add> -->
    <edit ref="edit" @init="getAll"></edit>
    <user-info ref="userInfo"></user-info>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import { locationTypeMap } from '@/assets/js/config';

import { mapGetters, mapActions } from 'vuex';

// import Add from './add';
import Edit from './edit';
import UserInfo from './user-info';
import DetailTable from './detail-table';

export default {
  name: escapeName('车辆安装及绑定'),
  mixins: [
    http,
    listMixin,
  ],
  filters: {
    activestatusFilter(activestatus) {
      return activestatus === 1 ? '未激活' : '已激活';
    },
  },
  computed: {
    // computedTableData() {
    //   const data = [];
    //   this.tableData.forEach((i) => {
    //     if (i.devicelist instanceof Array) {
    //       i.devicelist.forEach((item) => {
    //         const tmp = Object.assign({ deviceinfo: item }, i);
    //         data.push(tmp);
    //       });
    //     }
    //   });
    //   console.log(data);
    //   return data;
    // },
    userid() {
      return Number(Lockr.get('securId'));
    },
    ...mapGetters(['partnersTree']),
  },
  data() {
    const partnerid = parseInt(Lockr.get('partnerid'), 10) || null;
    return {
      // statusOptions: [
      //   { label: '未激活', value: 1 },
      //   { label: '已激活', value: 2 },
      // ],
      // deviceTypeList: [],
      options1: [{
        value: '0',
        label: '正常',
      }, {
        value: '1',
        label: '报警',
      }],
      options2: [{
        value: '0',
        label: '在线',
      }, {
        value: '1',
        label: '离线',
      }],
      headerList: [],
      checkHeaderList: [],
      headerEditerVisible: false,
      locationTypeMap,
      partnerid: [partnerid],
      params: {
        partnerId: null,
        query: null,
        carNumber: null,
        imei: null,
        sn: null,
        mobileno: null,
        activestatus: null,
        isOnlinevIds: 5,
        queryOnline: null,
        queryAlert: null,
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerId = newValue[newValue.length - 1];
      } else {
        this.params.partnerId = null;
      }
      this.getAll();
    },
  },
  beforeCreate() {
    this.name = '/vehicle/getNewVehicleStatusList';
  },
  created() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.$_geocoder = new AMap.Geocoder();
    });
    this.getHeader().then((response) => {
      this.headerList = response.data;
    });
    this.getHeader(this.userid).then((response) => {
      this.checkHeaderList = response.data.map(i => i.headid);
    });
  },
  methods: {
    getHeader(userid = null) {
      return new Promise((resolve) => {
        this.apiPost('/table/getTableHead', { userid }).then((response) => {
          resolve(response);
        });
      });
    },
    async init() {
      // const { data } = await this.apiPost('/devicetype/qryDevicetype', { pageSize: 10000 });
      // data.forEach((i) => {
      //   this.deviceTypeList[i.id] = i;
      // });
      this.fetchPartners(true);
      this.getAll();
    },
    async getAll() {
      const { paging } = this.getAllConfig;
      this.tableLoading = true;
      let params = {};
      if (paging) {
        // _.merge 会修改第一个参数原对象, 所以这里使用空对象 {}
        params = _.merge({}, this.params, this.pagination);
      } else {
        params = this.params;
      }
      try {
        const data = await this.apiPost(this.name, params);
        this.tableLoading = false;
        // this.tableData = data.data.map((item) => {
        //   item._address = '';
        //   return item;
        // });
        const arr = [];
        data.data.forEach((i) => {
          if (i.devicelist instanceof Array) {
            i.devicelist.forEach((item) => {
              const tmp = Object.assign({ deviceinfo: item, _address: null }, i);
              arr.push(tmp);
            });
          }
        });
        console.log(arr);
        this.tableData = arr;
        this.tableData.forEach((item, index) => this.handleAnalysisLngLat(index));
        this.pagination.dataCount = data.page.counts;
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        console.log(e);
        this.tableLoading = false;
      }
    },
    handleReset() {
      for (const i in this.params) {
        if (Object.prototype.hasOwnProperty.call(this.params, i)) {
          this.params[i] = null;
        }
      }
      this.getAll();
    },
    removeBinding(userId, vehicleid) {
      let loading;
      this.$confirm('确认将该设备解除绑定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      })
      .then(async () => {
        loading = _g.toastMsg('normal', '正在解除绑定中...');
        try {
          await this.apiPost('/userDevice/unbindUserVehicleDevice', { userId, vehicleid });
          setTimeout(() => {
            loading.close();
            this.getAll();
            _g.toastMsg('success', '解除绑定成功!');
          }, 1000);
        } catch (e) {
          loading.close();
        }
      })
      .catch(() => {
        // catch error
      });
    },
    forbiddenDevice(userdeviceid, activestatus) {
      activestatus = activestatus === 1 ? 2 : 1;
      const str = activestatus === 1 ? '禁用' : '激活';
      let loading;
      this.$confirm(`确认${str}该设备?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      })
      .then(async () => {
        loading = _g.toastMsg('normal', `正在${str}设备中...`);
        try {
          await this.apiPost('/userDevice/activeUserDevice', { userdeviceid, activestatus });
          setTimeout(() => {
            loading.close();
            this.getAll();
            _g.toastMsg('success', `${str}设备成功!`);
          }, 1000);
        } catch (e) {
          loading.close();
        }
      })
      .catch(() => {
        // catch error
      });
    },
    getAddress(position) {
      return new Promise((resolve, reject) => {
        this.$_geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    },
    handleAnalysisLngLat(vIndex) {
      if (!this.tableData[vIndex].deviceinfo.gpsinfo) return;
      const { lng, lat } = this.tableData[vIndex].deviceinfo.gpsinfo;
      // if (!lastLng || !lastLat) return;
      this.getAddress([lng, lat]).then(({ regeocode: { formattedAddress } }) => {
        this.tableData[vIndex]._address = formattedAddress;
      });
    },
    setTableHead() {
      this.apiPost('/table/setTableHead', { userid: this.userid, headids: this.checkHeaderList }).then(() => {
        this.$message.success('保存成功');
        this.headerEditerVisible = false;
      });
    },
    // eslint-disable-next-line
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //  console.log(row, column);
      if (columnIndex === 0 || columnIndex === 1) {
        let index = rowIndex;
        let rowspan = 0;
        let colspan = 1;
        const current = this.tableData[rowIndex].id;
        let next;
        const prev = this.tableData[rowIndex - 1] ? this.tableData[rowIndex - 1].id : null;
        if (prev === current) {
          colspan = 0;
        }
        do {
          next = this.tableData[index + 1] ? this.tableData[index + 1].id : null;
          index += 1;
          rowspan += 1;
        } while (next !== null && current === next);
        // if (rowIndex % 2 === 0) {
        //   return {
        //     rowspan: 2,
        //     colspan: 1,
        //   };
        // }
        if (rowspan > 1) {
          return {
            rowspan,
            colspan: 1,
          };
        }
        return {
          rowspan: 1,
          colspan,
        };
      }
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/trip/exportTrip?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions(['fetchPartners']),
  },
  components: {
    // Add,
    Edit,
    UserInfo,
    DetailTable,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .el-checkbox-group
    column-count 3
    .el-checkbox
      display block
      margin-left 0px
      margin-right 15px
</style>
