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
      <div class="btn-wrapper inline">
        <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      </div>
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
        width="180"
        property="sn"
        label="IMEI">
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
        property="stopNum"
        label="停留次数">
      </el-table-column>
      <el-table-column
        width="180"
        :formatter="({ totalStopTime }) => $secondsFormat(totalStopTime/1000)"
        label="总停留时长">
      </el-table-column>
      <el-table-column
        :formatter="({ avgStopTime }) => $secondsFormat(avgStopTime/1000)"
        label="平均停留时长">
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

import { mapGetters, mapActions } from 'vuex';

export default {
  name: escapeName('停留汇总表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      partnerid: [],
      params: {
        partnerid: null,
        query: null,
        queryType: 7,
        sTime: null,
        eTime: null,
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
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/vehicle/queryTotalStopList';
  },
  methods: {
    init() {
      this.fetchPartners(true);
      this.getAll();
    },
    ...mapActions([
      'fetchPartners',
    ]),
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/excel/exportTotalStopList?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
