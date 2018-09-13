<template>
  <div class="">
    <!-- <div class="m-b-20 ovf-hd fz-14 search-bar">
      <el-select v-model="params.partner" class="w-200" placeholder="请选择账号名称">
        <el-option
          v-for="item in []"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="params.imei" class="w-200" placeholder="请输入IMEI"></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        align="right"
        placeholder="选择日期范围"
        :picker-options="pickerOptions">
      </el-date-picker>
      <div class="btn-wrapper inline">
        <el-button type="primary" icon="search" @click="getAll">搜索</el-button>
      </div>
    </div> -->
    <el-table
      stripe
      size="mini"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column width="50px" label="操作">
        <template slot-scope="{ row: { vehicleid } }">
          <el-button size="mini" type="text" @click="$routerPush({name: '在线监控', path: '/main/monitor', props: { vehicleId: vehicleid }})">
            跟踪
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        property="carnumber"
        label="车牌号">
      </el-table-column>
      <el-table-column
        property="username"
        label="车主姓名">
      </el-table-column>
      <el-table-column
        property="mobileno"
        label="车主手机">
      </el-table-column>
      <el-table-column
        property="alertcount"
        label="告警设备数">
      </el-table-column>
      <el-table-column
        property="typename"
        label="告警类型">
      </el-table-column>
      <el-table-column
        width="135"
        property="alerttime"
        label="触发时间">
      </el-table-column>
      <el-table-column
        property="address"
        label="触发地点">
      </el-table-column>
      <el-table-column
        property="partnername"
        label="账号名称名称">
      </el-table-column>
      <el-table-column
        property="groupname"
        label="分组名称">
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
        <template slot-scope="{ row: { batchnum, status, vehicleid } }">
          <el-button-group>
            <el-button type="normal" size="mini" @click="$refs.detail.open(batchnum)">查看详情</el-button>
            <el-button v-if="status !== 3" key="handle" type="primary" size="mini" @click="$refs.handle.open(batchnum)">处理</el-button>
            <handle-detail v-if="status === 3" :batchnum="batchnum"></handle-detail>
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
    <detail ref="detail"></detail>
    <handle ref="handle" @init="getAll"></handle>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import Detail from '../deviceAlert/detail-table';
import Handle from '../deviceAlert/handle';
import HandleDetail from '../deviceAlert/handle-detail';

export default {
  name: escapeName('进出围栏报警'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      params: {
        typeids: [102004, 102005],
      },
    };
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
  },
  beforeCreate() {
    this.name = '/deviceAlert/queryAlertList';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    Detail,
    Handle,
    HandleDetail,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
