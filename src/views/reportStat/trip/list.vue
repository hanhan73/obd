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
      <el-select v-model="params.deviceTypeId"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择设备类型"
                 @change="getAll">
        <el-option
          v-for="item in deviceTypes"
          :key="item.id"
          :label="item.typeCode"
          :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker
        size="mini"
        type="date"
        v-model="params.stime"
        value-format="yyyy-MM-dd"
        placeholder="选择开始日期"
        @change="handleConfirmDate">
      </el-date-picker>
      <el-date-picker
        size="mini"
        type="date"
        v-model="params.etime"
        value-format="yyyy-MM-dd"
        placeholder="选择结束日期"
        @change="handleConfirmDate">
      </el-date-picker>
      <!-- <el-date-picker
        size="mini"
        v-model="time"
        type="daterange"
        align="right"
        placeholder="选择日期范围"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="handleConfirmDate">
      </el-date-picker> -->
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
        <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      </div>
    </div>
    <el-table
      stripe
      ref="table"
      size="small"
      :data="computedTableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="60px">
      </el-table-column>
      <el-table-column
        width="155"
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="180"
        property="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        property="carnumber"
        label="车牌号 ">
      </el-table-column>
      <el-table-column
        :formatter="({ totalMiles }) => totalMiles ? `${totalMiles} KM` : ''"
        label="总里程">
      </el-table-column>
      <el-table-column
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        v-for="(i, index) in dateList"
        :key="index"
        min-width="83"
        :label="i">
        <template slot-scope="{ row }">
          <span v-if="row[i] === -1" class="c-gra">离线</span>
          <span v-else>{{row[i]}} KM</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        min-width="140"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="danger" size="small">删除</el-button>
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

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      deviceTypes: [],
      partnerid: [],
      dateList: [],
      vehicles: [],
      params: {
        query: null,
        partnerid: null,
        deviceTypeId: null,
        vinnumber: null,
        vehicleid: null,
        peroil: null,
        stime: null,
        etime: null,
      },
    };
  },
  computed: {
    computedTableData() {
      return this.tableData.map((i) => {
        const datas = {};
        if (i.datas) {
          i.datas.forEach((item) => {
            datas[item.reportDate] = item.reportData;
          });
        }
        this.dateList.forEach((item) => {
          i[item] = datas[item] !== -1 && datas[item] !== undefined ?
                    datas[item] :
                     -1;
        });
        return i;
      });
    },
    // time: {
    //   set(val) {
    //     this.params.stime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
    //     this.params.etime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
    //   },
    //   get() {
    //     return [this.params.stime, this.params.etime];
    //   },
    // },
    ...mapGetters(['partnersTree']),
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
  beforeCreate() {
    this.name = '/trip/queryTripList';
  },
  methods: {
    async init() {
      // const { data } = await this.apiPost('/vehicle/getVehicles', { pageSize: 10000 });
      // this.vehicles = data;
      this.setDateList();
      this.fetchDeviceTypes();
      this.fetchPartners(true);
      this.getAll();
    },
    setDateList(endDate = moment(), days = 9) {
      const dateList = [];
      for (let i = 0; i <= days; i += 1) {
        dateList.push(moment(endDate).add(-i, 'day').format('YYYY-MM-DD'));
      }
      this.dateList = dateList;
    },
    async fetchDeviceTypes() {
      const { data } = await this.apiPost('/devicetype/qryDevicetype', { pageSize: 10000 });
      this.deviceTypes = data;
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/excel/exportDeviceTripList?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    handleConfirmDate() {
      const val = [this.params.stime, this.params.etime];
      if (val === null) return;
      const days = moment(val[1]).diff(moment(val[0]), 'days');
      if (days > 10) {
        _g.toastMsg('warning', '日期间隔不能大于10天');
        this.time = null;
      } else {
        this.setDateList(val[1], days);
        // this.$refs.table.doLayout();
        this.getAll();
      }
    },
    ...mapActions(['fetchPartners']),
  },
  components: {},
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
