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
      size="small"
      :data="tableData"
      v-loading="tableLoading"
      class="table-padding-none table-tx-c"
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
      <el-table-column
        :formatter="({ detailCount }) => `${detailCount} 次`"
        property="detailCount"
        label="行程数">
      </el-table-column>
      <el-table-column
        :formatter="({ tripObdMil }) => `${tripObdMil/1000} KM`"
        property="tripObdMil"
        label="总里程">
      </el-table-column>
      <el-table-column
        :formatter="({ tripFuelConsum }) => `${tripFuelConsum/1000} L`"
        property="tripFuelConsum"
        label="总耗油">
      </el-table-column>
      <el-table-column
        :formatter="({ tripDurTotal }) => $secondsFormat(tripDurTotal)"
        min-width="120"
        property="tripDurTotal"
        label="车辆行驶时间">
      </el-table-column>
      <el-table-column
        :formatter="({ tripOverspdCount }) => `${tripOverspdCount} 次`"
        property="tripOverspdCount"
        label="超速">
      </el-table-column>
      <el-table-column
        :formatter="({ tripOverspdDur }) => $secondsFormat(tripOverspdDur)"
        property="tripOverspdDur"
        label="超速时长">
      </el-table-column>
      <el-table-column
        :formatter="({ tripSpeedAvg }) => `${tripSpeedAvg} KM/H`"
        property="tripSpeedAvg"
        label="平均速度">
      </el-table-column>
      <el-table-column
        :formatter="({ tripSpeedMax }) => `${tripSpeedMax} KM/H`"
        property="tripSpeedMax"
        label="最大速度">
      </el-table-column>
      <el-table-column
        :formatter="({ tripIdleDur }) => $secondsFormat(tripIdleDur)"
        property="tripIdleDur"
        label="怠速时长">
      </el-table-column>
      <el-table-column
        :formatter="({ tripAccCount }) => `${tripAccCount} 次`"
        property="tripAccCount"
        label="急加速">
      </el-table-column>
      <el-table-column
        :formatter="({ tripDecCount }) => `${tripDecCount} 次`"
        property="tripDecCount"
        label="急减速">
      </el-table-column>
      <el-table-column
        :formatter="({ tripShpturnCount }) => `${tripShpturnCount} 次`"
        property="tripShpturnCount"
        label="急转弯">
      </el-table-column>
      <el-table-column
        width="135"
        property="createTime"
        label="日报时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleQueryDetail(row)">查看详情</el-button>
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  name: escapeName('驾驶行为日报'),
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
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/obd/getObdTripsList';
  },
  methods: {
    init() {
      this.fetchPartners(true);
      this.getAll();
    },
    handleQueryDetail(row) {
      const { tripDetailIds } = row;
      window.$routerPush({
        name: '驾驶日报详情',
        path: '/main/obd/drivingBehaviorDaily/detail',
        props: { tripDetailIds, row },
      });
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/excel/exportObdTrips?${this.transformRequest(
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

<style lang="stylus" rel="stylesheet/stylus">

</style>
