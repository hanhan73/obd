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
      <el-input size="mini" clearable v-model.trim="params.query" class="w-200" placeholder="请输入IMEI、车牌号、设备名称" @change="getAll"></el-input>
      <span class="label">离线时长:</span>
      <el-radio-group v-model="params.time" size="mini" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button :label="1800000">半小时</el-radio-button>
        <el-radio-button :label="3600000">1小时</el-radio-button>
        <el-radio-button :label="86400000">24小时</el-radio-button>
        <el-radio-button :label="259200000">3天</el-radio-button>
      </el-radio-group>
      <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      <!-- <el-date-picker
        size="mini"
        v-model="time"
        type="daterange"
        align="right"
        placeholder="选择日期范围"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker> -->
      <!-- <div class="btn-wrapper inline">
        <el-button type="primary" icon="search" @click="getAll">搜索</el-button>
      </div> -->
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
        width="150"
        property="deviceName"
        label="设备名称">
      </el-table-column>
      <el-table-column
        width="135"
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="90"
        property="deviceType"
        label="设备类型">
      </el-table-column>
      <el-table-column
        width="90"
        property="carnumber"
        label="车牌号">
      </el-table-column>
      <el-table-column
        width="110"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="135"
        property="onlinetime"
        label="上线时间">
      </el-table-column>
      <el-table-column
        width="135"
        property="offlinetime"
        label="离线时间">
      </el-table-column>
      <el-table-column
        width="150"
        :formatter="({ time }) => $secondsFormat((time - 0) / 1000)"
        label="离线时长">
      </el-table-column>
      <el-table-column
        property="offlineadress"
        label="离线地址">
      </el-table-column>
      <el-table-column
        property="onlineadress"
        label="上线地址">
      </el-table-column>
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
  name: escapeName('离线超时表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      partnerid: [],
      params: {
        query: null,
        carnumber: null,
        deviceName: null,
        sn: null,
        beginTime: null,
        endTime: null,
        partnerid: null,
        time: null,
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
  },
  computed: {
    time: {
      set(val) {
        this.params.beginTime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
        this.params.endTime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      get() {
        return [this.params.beginTime, this.params.endTime];
      },
    },
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/device/getOffLineList';
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
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/excel/exportOfflineOvertime?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    handleSearchTextChange(val) {
      this.params[this.searchType] = val;
    },
    handleSearchTypeChange(val) {
      this.searchOptions.forEach((i) => {
        if (i.value !== this.searchType) {
          this.params[i.value] = null;
        } else {
          this.params[val] = this.searchText;
        }
      });
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
          if (i.offlinelng && i.offlinelat) {
            this.getAddress([i.offlinelng, i.offlinelat])
                .then(({ regeocode: { formattedAddress } }) => {
                  i.offlineadress = formattedAddress;
                });
          }
          if (i.onlinelng && i.onlinelat) {
            this.getAddress([i.onlinelng, i.onlinelat])
                .then(({ regeocode: { formattedAddress } }) => {
                  i.onlineadress = formattedAddress;
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
    ...mapActions(['fetchPartners']),
  },
  components: {
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
