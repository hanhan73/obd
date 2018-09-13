<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-select v-model="params.partnerid"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择账号名称">
        <el-option
          v-for="item in partners"
          :key="item.id"
          :label="item.partnername"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="params.groupid"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择分组">
        <el-option
          v-for="item in groups"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="params.reporttype"
                 size="mini"
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择报表类型">
        <el-option
          v-for="item in reportTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input size="mini" v-model="params.carNumber" class="w-200" placeholder="请输入车牌号"></el-input>
      <el-input size="mini" v-model="params.vinNumber" class="w-200" placeholder="请输入车架号"></el-input>
      <el-date-picker
        size="mini"
        v-model="time"
        type="daterange"
        align="right"
        placeholder="选择日期范围"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
        <el-button size="mini" type="normal" @click="handleExport">
          <i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>
          导出
        </el-button>
        <el-button size="mini" type="normal" @click="showChart = !showChart">
          <i class="fa fa-bar-chart" aria-hidden="true"></i>
          查看报表
        </el-button>
      </div>
    </div>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated flipInX"
      leave-active-class="animated flipOutX"
    >
      <el-alert
        v-if="showChart"
        class="m-b-5 bg-333"
        title="图形报表"
        type="info"
        @close="showChart = false">
        <slot name="description">
          <chart :options="bar" :theme="'dark'" style="width: 100%; height: 300px"></chart>
        </slot>
      </el-alert>
    </transition>
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
        property="vinnumber"
        label="车架号">
      </el-table-column>
      <el-table-column
        property="imei"
        label="IMEI">
      </el-table-column>
      <el-table-column
        property="position"
        label="设备安装位置">
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
        :formatter="(row) => `${row.province}-${row.cityname}`"
        label="设备正常地址">
      </el-table-column>
      <el-table-column
        property="address"
        label="异常地址">
      </el-table-column>
      <el-table-column
        property="systime"
        label="告警时间">
      </el-table-column>
      <el-table-column
        property="systime"
        label="告警时间">
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
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/theme/dark';

export default {
  name: escapeName('车辆异地报警'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      showChart: false,
      reportTypeOptions: [
        { label: '日统计', value: 1 },
        { label: '月统计', value: 2 },
        { label: '年统计', value: 3 },
      ],
      params: {
        partnerid: null,
        groupid: null,
        reporttype: 1,
        carnumber: null,
        vinnumber: null,
        begintime: null,
        endtime: null,
      },
      bar: {
        title: {
          // text: '异步数据加载示例',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['异常设备'],
        },
        xAxis: {
          data: [],
        },
        yAxis: {
          axisLabel: { show: true },
        },
        series: [
          {
            name: '异常设备',
            type: 'bar',
            data: [],
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: 'rgba(127, 128, 225, 0.7)',
                    },
                    {
                      offset: 0.9,
                      color: 'rgba(72, 73, 181, 0.7)',
                    },
                    {
                      offset: 0.31,
                      color: 'rgba(0, 208, 208, 0.7)',
                    },
                    {
                      offset: 0.15,
                      color: 'rgba(0, 208, 208, 0.7)',
                    },
                    {
                      offset: 0,
                      color: 'rgba(104, 253, 255, 0.7)',
                    },
                  ],
                  false,
                ),
              },
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}',
              },
            },
          },
        ],
      },
      getAllConfig: {
        dataPath: ['data', 'cuList'],
      },
    };
  },
  computed: {
    time: {
      set(val) {
        this.params.begintime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
        this.params.endtime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      get() {
        return [this.params.begintime, this.params.endtime];
      },
    },
    ...mapGetters(['partners', 'groups']),
  },
  beforeCreate() {
    this.name = '/deviceAlert/queryUnusual';
  },
  methods: {
    init() {
      this.fetchPartners();
      this.fetchGroups();
      this.getAll();
    },
    afterGetAll(data) {
      const reportData = data.data.reportList;
      this.bar.xAxis.data = reportData.map(item => item.name);
      this.bar.series[0].data = reportData.map(item => item.value);
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/deviceAlert/exportUnusual?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions([
      'fetchPartners',
      'fetchGroups',
    ]),
  },
  components: {
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
