<template>
  <div class="device-list-wrapper">
    <div class="search-bar m-t-5 m-b-5 m-l-5 m-r-5">
      <el-select size="mini" v-model="params.type" class="w-100">
        <el-option :value="0" label="设备名称"></el-option>
        <el-option :value="1" label="IMEI"></el-option>
      </el-select>
      <el-input size="mini" v-model="params.devicename" placeholder="请输入" class="w-200"></el-input>
      <el-button size="mini" type="primary" @click="getAll">查询</el-button>
    </div>
    <el-table
      class="table"
      :data="tableData"
      stripe
      height="auto"
      size="mini"
      style="width: 100%"
      @row-click="(row) => this.$emit('handleDeviceRowClick', row)">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="partnername"
        label="所属账号">
      </el-table-column>
      <el-table-column
        prop="fenceNum"
        label="关联">
        <template slot-scope="{ row: { fenceNum, sn } }">
          <el-button size="mini" type="primary" :disabled="fenceNum === '0'" @click.stop="$refs.deviceDetail.open(sn)" round>{{fenceNum}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="tx-c pagination"
      small
      layout="prev, pager, next"
      :total="pagination.dataCount"
      :page-size="pagination.pageSize"
      :current-page.sync="pagination.curPage"
      @current-change="handleCurrentChange">
    </el-pagination>
    <device-detail ref="deviceDetail"></device-detail>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import DeviceDetail from './device-detail';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        partnerid: Lockr.get('partnerid') || null,
        devicename: '',
        type: 0,
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/getDeviceFenceNum';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    DeviceDetail,
  },
};
</script>

<style lang="stylus" scoped>
  .device-list-wrapper
    height: 100%
    display: flex
    flex-direction: column
    .search-bar,
    .pagination
      flex: 0 0 auto
    .table
      flex: 1 1 auto
</style>
