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
        <!-- <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button> -->
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
        width="140"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="125"
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="105"
        :formatter="({ dailyMil }) => `${dailyMil/1000} KM`"
        label="日均里程">
      </el-table-column>
      <el-table-column
        width="125"
        :formatter="({ totalMil }) => `${totalMil/1000} KM`"
        label="总里程">
      </el-table-column>
      <el-table-column
        width="105"
        :formatter="({ dailyOil }) => `${dailyOil/1000} L`"
        label="日均油耗">
      </el-table-column>
      <el-table-column
        width="115"
        :formatter="({ totalOil }) => `${totalOil/1000} L`"
        label="总油耗">
      </el-table-column>
      <el-table-column
        width="105"
        :formatter="({ surplusOil }) => `${surplusOil} %`"
        label="剩余油量">
      </el-table-column>
      <el-table-column
        width="80"
        prop="activeDate"
        label="激活天数">
      </el-table-column>
      <el-table-column
        prop="activeTime"
        label="激活时间">
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: escapeName('车辆油耗统计'),
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
        imei: null,
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
    this.name = '/obd/getObdMilOil';
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
        location.href = `${HOST}/excel/exportObdMilOil?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
  components: {
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
