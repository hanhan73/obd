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
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
      </div>
    </div>
    <el-table
      border
      stripe
      size="small"
      class="custom-table"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column
        property="username"
        label="姓名">
      </el-table-column>
      <el-table-column
        min-width="200"
        property="vinnumber"
        label="车架号">
      </el-table-column>
      <el-table-column
        width="200"
        property="sn"
        label="主设备">
      </el-table-column>
      <el-table-column
        min-width="170"
        :formatter="({ obdSpeedMlieages: { accOffTime } }) => accOffTime"
        label="数据最新时间">
      </el-table-column>
      <el-table-column
        min-width="100"
        :formatter="({ obdSpeedMlieages: { totalMil } }) => totalMil ? `${totalMil/1000} KM` : ''"
        label="总里程">
      </el-table-column>
      <el-table-column
        property=""
        label="日均里程">
      </el-table-column>
      <el-table-column label="车速段里程" label-class-name="tx-c">
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { sppeedOne } }) => sppeedOne ? `${sppeedOne/1000} km` : ''"
          label-class-name="tx-c p-0"
          label="0-20">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedTwo } }) => speedTwo ? `${speedTwo/1000}  km` : ''"
          label-class-name="tx-c p-0"
          prop="city"
          label="20-40">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedThree } }) => speedThree ? `${speedThree/1000} km` : ''"
          label-class-name="tx-c p-0"
          prop="address"
          label="40-60">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedFour } }) => speedFour ? `${speedFour/1000} km` : ''"
          label-class-name="tx-c p-0"
          prop="zip"
          label="60-80">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedFive } }) => speedFive ? `${speedFive/1000} km` : ''"
          label-class-name="tx-c p-0"
          prop="zip"
          label="80-100">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedSix } }) => speedSix ? `${speedSix/1000} km` : ''"
          label-class-name="tx-c p-0"
          prop="zip"
          label="100-120">
        </el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :formatter="({ obdSpeedMlieages: { speedSeven } }) => speedSeven"
          label-class-name="tx-c p-0"
          prop="zip"
          label=">120">
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 p-b-20 pages-footer">
      <div class="stat">
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
  name: escapeName('里程统计'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      partnerid: [],
      params: {
        partnerid: null,
        imei: null,
        query: null,
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
    this.name = '/obd/getVehicleMilList';
  },
  methods: {
    init() {
      this.fetchPartners(true);
      this.getAll();
    },
    renderHeader(h, { column, $index }) {
      const color = ['#FF9966', '#FFCC00', '#99CC00', '#3DBB00', '#17C1D5', '#FF6868', '#FF0000'];
      return (
        <div style={{ background: color[$index] }}>{column.label}</div>
      );
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
  components: {
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
