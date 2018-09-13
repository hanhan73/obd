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
      <el-select v-model="offlinetime"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择停留时长">
        <el-option label="1小时内" :value="3600"></el-option>
        <el-option label="24小时内" :value="86400"></el-option>
        <el-option label="1-3天" :value="259200"></el-option>
        <el-option label="3天以上" :value="999999"></el-option>
      </el-select>
      <el-radio-group v-model="params.devicetype" size="mini" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button label="ZY-V">ZY-V</el-radio-button>
        <el-radio-button label="ZY-T">ZY-T</el-radio-button>
        <el-radio-button label="ZY-M">ZY-M</el-radio-button>
      </el-radio-group>
      <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      <!-- <div class="m-l-10">
        剩余电量:
        <el-input-number size="mini" :step="10" :min="0" :max="100" v-model="params.voltage" @change="getAll"></el-input-number>
        以下
      </div> -->
      <!-- <el-input size="mini" clearable v-model.trim="params.query" class="w-200" placeholder="请输入IMEI、车牌号、设备名称" @change="getAll"></el-input> -->
      <!-- <el-date-picker
        size="mini"
        type="date"
        v-model="params.stime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始日期"
        @change="getAll">
      </el-date-picker>
      <el-date-picker
        size="mini"
        type="date"
        v-model="params.etime"
        value-format="yyyy-MM-dd 23:59:59"
        placeholder="选择结束日期"
        @change="getAll">
      </el-date-picker> -->
    </div>
    <el-table
      stripe
      size="small"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column
        width="180"
        property="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        width="160"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="130"
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="80"
        property="devicetype"
        label="设备类型">
      </el-table-column>
      <!-- <el-table-column
        property="name"
        label="车主姓名">
      </el-table-column>
      <el-table-column
        property="phone"
        label="车主手机">
      </el-table-column> -->
      <el-table-column
        width="100"
        property="vehicleState"
        label="设备状态">
      </el-table-column>
      <el-table-column
        width="135px"
        prop="communicationTime"
        label="信号时间">
      </el-table-column>
      <el-table-column
        property="offlineAddress"
        label="离线地址">
      </el-table-column>
      <!-- <el-table-column
        prop="createtime"
        label="入库时间">
      </el-table-column> -->
      <!-- <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="primary" size="small">删除</el-button>
        </template>
      </el-table-column> -->
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import { lazyAMapApiLoaderInstance } from 'vue-amap';

import { mapGetters, mapActions } from 'vuex';

export default {
  // name: escapeName(''),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      offlinetime: null,
      partnerid: [],
      params: {
        isOnlinevIds: 1,
        queryType: 1,
        partnerid: null,
        userid: null,
        devicetype: null,
        offlinetimeMin: null,
        offlinetimeMax: null,
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerid = newValue[newValue.length - 1];
      } else {
        this.params.partnerid = null;
      }
      this.getAll();
    },
    offlinetime(val) {
      if (val !== '') {
        let min = null;
        let max = null;
        if (val < 259200) {
          min = 0;
          max = val;
        } else if (val === 259200) {
          min = 86400;
          max = val;
        } else {
          min = 259200;
        }
        this.params.offlinetimeMin = min;
        this.params.offlinetimeMax = max === null ? null : max;
      } else {
        this.params.offlinetimeMin = null;
        this.params.offlinetimeMax = null;
      }
      this.getAll();
    },
  },
  computed: {
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/device/qryDeviceData';
  },
  created() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.$_geocoder = new AMap.Geocoder();
    });
  },
  methods: {
    init() {
      this.fetchPartners(true);
      this.getAll();
    },
    async getAll() {
      const { paging, dataPath } = this.getAllConfig;
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
        this.tableData = R.path(dataPath)(data).map((i) => {
          i.offlineAddress = null;
          if (i.gpsinfo.lng && i.gpsinfo.lat) {
            this.getAddress([i.gpsinfo.lng, i.gpsinfo.lat])
                .then(({ regeocode: { formattedAddress } }) => {
                  i.offlineAddress = formattedAddress;
                });
          }
          return i;
        });
        this.pagination.dataCount = data.page.counts;
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        this.tableLoading = false;
      }
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
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        if (this.params == null) {
          // console.log(Lockr.get('partnerid'));
          this.params = Lockr.get('partnerid');
        }
        location.href = `${HOST}/excel/exportOffline?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
