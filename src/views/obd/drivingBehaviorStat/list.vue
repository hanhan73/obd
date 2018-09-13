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
      border
      stripe
      size="mini"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column
        property="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column label="总次数" label-class-name="tx-c">
        <el-table-column
          :formatter="({ accTotalCount }) => accTotalCount ? `${accTotalCount} 次` : ''"
          label="急加速">
        </el-table-column>
        <el-table-column
          :formatter="({ dccTotalCount }) => dccTotalCount ? `${dccTotalCount} 次` : ''"
          label="急减速">
        </el-table-column>
        <el-table-column
          :formatter="({ shpturnTotalCount }) => shpturnTotalCount ? `${shpturnTotalCount} 次` : ''"
          label="急转弯">
        </el-table-column>
      </el-table-column>
      <el-table-column
        :formatter="({ overspdTotalDur }) => overspdTotalDur !== undefined && overspdTotalDur !== '' ? `${$secondsFormat(overspdTotalDur - 0)}` : ''"
        label="超速累计总时长">
      </el-table-column>
      <el-table-column
        width="150"
        :formatter="({ idlespdTotalDur }) => idlespdTotalDur !== undefined && idlespdTotalDur !== '' ? `${$secondsFormat((idlespdTotalDur/1000).toFixed(0))}` : ''"
        label="怠速总时长">
      </el-table-column>
      <el-table-column
        width="135"
        property="accOnTime"
        label="最新点火时间">
      </el-table-column>
      <el-table-column
        width="135"
        property="accOffTime"
        label="最新熄火时间">
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
  name: escapeName('驾驶行为统计'),
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
    this.name = '/obd/getObdTotalTripsList';
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
        location.href = `${HOST}/excel/exportTotalTrips?${this.transformRequest(
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
