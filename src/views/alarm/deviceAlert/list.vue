<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-popover
        v-if="params.typeid === null"
        placement="bottom"
        width="700"
        style="margin: 2px 5px 0 0;"
        trigger="click">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group class="m-t-15 typeids-group" v-model="params.typeids" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in AlarmTypesOptions"
                       :label="item.value"
                       :key="item.value"
                       class="dis-blo">
                       {{item.text}}
          </el-checkbox>
        </el-checkbox-group>
        <el-button slot="reference" size="mini">{{params.typeids.length ? `${params.typeids.length}个报警类型被选择` : '请选择告警类型'}}</el-button>
      </el-popover>
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
      <!-- <el-input clearable size="mini" v-model="params.carnumber" class="w-200" placeholder="请输入车牌号" @change="getAll"></el-input>
      <el-input clearable size="mini" v-model="params.devicename" class="w-200" placeholder="请输入设备名称" @change="getAll"></el-input> -->
      <el-select clearable @change="getAll" size="mini" v-model="params.timeType" placeholder="请选择日期">
        <el-option
          v-for="item in periodOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <!-- <el-date-picker
        size="mini"
        type="date"
        v-model="params.begintime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始日期">
      </el-date-picker>
      <el-date-picker
        size="mini"
        type="date"
        v-model="params.endtime"
        value-format="yyyy-MM-dd 23:59:59"
        placeholder="选择结束日期">
      </el-date-picker> -->
      <el-radio-group v-model="params.status" @change="getAll" size="mini">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button :label="3">已处理</el-radio-button>
        <el-radio-button :label="1">未处理</el-radio-button>
      </el-radio-group>
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button type="primary" size="mini">
          移动到...<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="read">已读报警</el-dropdown-item>
          <el-dropdown-item command="unread">未读报警</el-dropdown-item>
          <el-dropdown-item command="delete">垃圾报警</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
        <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
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
        class="m-b-5 bg-333 w-100p"
        title="图形报表"
        type="info"
        @close="showChart = false">
        <slot name="description">
          <chart :options="bar" :theme="'dark'" style="width: 100%; height: 300px"></chart>
        </slot>
      </el-alert>
    </transition>
    <el-container>
      <el-aside width="150px">
        <el-menu
          class="el-menu-vertical-demo"
          default-active="0"
          @select="handleSelect">
          <el-menu-item index="0">
            <svg-icon icon-class="unread"/>
            <span slot="title">未读报警({{alertCount.unreadNum}})</span>
          </el-menu-item>
          <el-menu-item index="1">
            <svg-icon icon-class="read"/>
            <span slot="title">已读报警({{alertCount.readNum}})</span>
          </el-menu-item>
          <el-menu-item index="-1">
            <svg-icon icon-class="star"/>
            <span slot="title">星标报警({{alertCount.fllowNum}})</span>
          </el-menu-item>
          <el-menu-item index="2">
            <svg-icon icon-class="delete"/>
            <span slot="title">垃圾报警({{alertCount.deleteNum}})</span>
          </el-menu-item>
          <el-menu-item index="3">
            <svg-icon icon-class="ignore"/>
            <span slot="title">忽略报警({{alertCount.igonreNum}})</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0px 0px 0px 5px">
        <el-table
          stripe
          border
          size="mini"
          class="device-alert-table"
          :data="tableData"
          v-loading="tableLoading"
          highlight-current-row
          @row-click="handleTableRowClick"
          @selection-change="val => this.selection = val">
          <el-table-column
            width="35px"
            type="selection">
          </el-table-column>
          <!-- <el-table-column
            width="35px">
            <template slot-scope="{ row: { isfllow } }">
            </template>
          </el-table-column> -->
          <el-table-column
            width="30px"
            type="index">
          </el-table-column>
          <el-table-column width="260px" label="操作">
            <template slot-scope="{ row: { id, sn, vehicleid, isfllow, alertstatus, status }, row, $index }">
              <el-button-group>
                <el-button v-if="status !== 3" key="handle" type="primary" size="mini" @click.stop="$refs.handle.open(id)">处理</el-button>
                <handle-detail v-if="status === 3" :id="id"></handle-detail>
                <el-button size="mini" type="info" @click.stop="$routerPush({name: '在线监控', path: '/main/monitor', props: { vehicleId: vehicleid, sn }})">
                  跟踪
                </el-button>
                <el-button size="mini" @click.stop="handleIgnoreAlert(row)" icon="el-icon-remove-outline" :class="{ 'c-red': alertstatus === '3' }">
                </el-button>
                <el-button size="mini" @click.stop="handleFollowAlarm(id, isfllow, $index)" :icon="`el-icon-star-${isfllow === '0' ? 'on' : 'off'}`">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
            width="135"
            label="设备名称">
            <template slot-scope="{ row: { devicename, deviceid } }">
              <el-button @click.stop="$refs.editDevice.open(deviceid)" type="text" size="mini">{{devicename}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="85"
            label="车牌号">
            <template slot-scope="{ row: { carnumber, vehicleid } }">
              <el-button @click.stop="$refs.editVehicle.open(vehicleid)" type="text" size="mini">{{carnumber}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            property="typename"
            label="告警类型">
          </el-table-column>
          <el-table-column
            min-width="320"
            property="description"
            label="告警内容">
          </el-table-column>
          <el-table-column
            width="120px"
            property="partnername"
            label="账号名称名称">
          </el-table-column>
          <el-table-column
            width="130"
            property="alerttime"
            label="告警时间">
          </el-table-column>
          <!-- <el-table-column
            width="130"
            property="createtime"
            label="记录时间">
          </el-table-column> -->
          <el-table-column
            min-width="150"
            property="address"
            label="位置">
          </el-table-column>
          <!-- <el-table-column
            width="160"
            label="操作">
            <template slot-scope="{ row: { batchnum, status, vehicleid } }">
              <el-button-group>
                <el-button type="normal" size="mini" @click.stop="$refs.detail.open(batchnum)">查看详情</el-button>
                <el-button v-if="status !== 3" key="handle" type="primary" size="mini" @click.stop="$refs.handle.open(batchnum)">处理</el-button>
                <handle-detail v-if="status === 3" :batchnum="batchnum"></handle-detail>
              </el-button-group>
            </template>
          </el-table-column> -->
        </el-table>
      </el-main>
    </el-container>
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
    <the-map ref="theMap"></the-map>
    <handle ref="handle" @init="getAll"></handle>
    <edit-vehicle ref="editVehicle"></edit-vehicle>
    <edit-device ref="editDevice"></edit-device>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/theme/dark';

import Detail from './detail-table';
import TheMap from './TheMap';
import Handle from './handle';
import HandleDetail from './handle-detail';
import EditVehicle from '../../vehicle/edit';
import EditDevice from '../../device/edit';

export default {
  name: escapeName('断电报警'),
  props: ['props'],
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      partnerid: [],
      isIndeterminate: true,
      checkAll: true,
      AlarmTypesOptions: [],
      showChart: false,
      selection: [],
      periodOptions: [
        { label: '今天', value: 1 },
        { label: '昨天', value: 2 },
        { label: '本周', value: 3 },
        { label: '上周', value: 4 },
        { label: '本月', value: 5 },
        { label: '上月', value: 6 },
      ],
      params: {
        partnerid: null,
        typeid: null,
        typeids: [],
        groupId: null,
        query: null,
        status: null,
        isfllow: null,
        alertstatus: '0',
        timeType: this.props.timeType || null,
      },
      alertCount: {
        deleteNum: '0',
        fllowNum: '0',
        readNum: '0',
        unreadNum: '0',
        igonreNum: '0',
      },
      bar: {
        title: {
          // text: '异步数据加载示例',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['报警数'],
        },
        xAxis: {
          data: [],
        },
        yAxis: {
          axisLabel: { show: true },
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: '30px',
          containLabel: true,
        },
        series: [
          {
            name: '报警数',
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
    };
  },
  computed: {
    // time: {
    //   set(val) {
    //     this.params.begintime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
    //     this.params.endtime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
    //   },
    //   get() {
    //     return [this.params.begintime, this.params.endtime];
    //   },
    // },
    isAlarmOverview() {
      return this.props.typeid === '-1';
    },
    ...mapGetters(['partnersTree', 'types']),
  },
  beforeCreate() {
    this.name = '/deviceAlert/getDeviceAlertList';
  },
  watch: {
    props() {
      this.init();
    },
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerid = newValue[newValue.length - 1];
      } else {
        this.params.partnerid = null;
        this.params.groupId = null;
      }
      this.getAll();
    },
  },
  methods: {
    async init() {
      // const id = this.props.typeid.split(',');
      // if (id[0]) {
      //   this.params.typeids = id.map(i => i - 0);
      // }
      // if (id[0] === '-1') {
      //   this.params.typeid = null;
      //   const { data } = await this.apiPost('/deviceAlert/queryTypes', {});
      //   this.params.typeids = data.map(i => i.id).filter(this.$filterAlertTypes);
      // }
      // this.fetchPartners(true);
      // this.fetchGroups();
      // this.fetchAlertTypes();
      // this.getAlertCount();
      // this.getAll();
    },
    async getAlertCount() {
      try {
        const params = {
          typeids: this.params.typeids,
        };
        const { data } = await this.apiPost('/deviceAlert/getAlertCountByStatus', params);
        this.alertCount = data;
      } catch (e) {
        //
      }
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
      if (params.typeid !== null) {
        params.typeids = [];
      }
      try {
        const data = await this.apiPost(this.name, params);
        this.tableLoading = false;
        if (paging) {
          // 是否包含报表数据
          this.tableData = R.path(dataPath)(data);
          this.pagination.dataCount = data.page.counts;
        } else {
          this.tableData = data.data;
        }
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        this.tableLoading = false;
      }
    },
    async afterGetAll() {
      const { data } = await this.apiPost('/deviceAlert/queryAlertListRport', this.params);
      this.bar.xAxis.data = data.map(item => item.name);
      this.bar.series[0].data = data.map(item => item.value);
    },
    async fetchAlertTypes() {
      // const { data } = await this.apiPost('/deviceAlert/api/queryTypes', {});
      // this.AlarmTypesOptions = data.map(({ id, name }) => ({ text: name, value: id }));
    },
    async handleCommand(command) {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请勾选需要移动的报警');
        return;
      }
      let status;
      switch (command) {
        case 'read':
          status = 1;
          break;
        case 'unread':
          status = 0;
          break;
        case 'delete':
          status = 2;
          break;
        default:
      }
      try {
        await this.apiPost('/deviceAlert/updateAlertStatus', { ids: this.selection.map(i => i.id), status });
        _g.toastMsg('success', '移动成功');
        this.getAlertCount();
        this.getAll();
      } catch (e) {
        //
      }
    },
    handleSelect(index) {
      this.params.isfllow = null;
      this.params.alertstatus = null;
      if (index === '-1') {
        this.params.isfllow = 0;
      } else {
        this.params.alertstatus = index;
      }
      this.getAll();
    },
    async handleFollowAlarm(id, isFllow, $index) {
      const status = isFllow === '0' ? '1' : '0';
      try {
        await this.apiPost('/deviceAlert/updateAlertFllow', { ids: [id], status });
        this.tableData[$index].isfllow = status;
      } catch (e) {
        //
      }
    },
    handleTableRowClick(row) {
      this.$refs.theMap.open(row);
      if (this.params.alertstatus !== '0') return;
      this.apiPost('/deviceAlert/updateAlertStatus', { ids: [row.id], status: 1 });
      this.getAlertCount();
      this.getAll();
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/deviceAlert/exportDeviceAlert?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    handleCheckAllChange(val) {
      this.params.typeids = val ? this.AlarmTypesOptions.map(i => i.value) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.AlarmTypesOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.AlarmTypesOptions.length;
    },
    handleIgnoreAlert({ sn, typeid, alertstatus, devicename, typename }) {
      const isIgnore = alertstatus === '3';
      this.$confirm(`确认${isIgnore ? '恢复' : '忽略'} <span class="c-red">${devicename}</span> 的 <span class="c-red">${typename}</span> 的所有报警吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }).then(async () => {
        try {
          await this.apiPost('/deviceAlert/addOrDeleteIgnore', { sn, typeid, eventType: isIgnore ? 1 : 0 });
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
          this.getAll();
        } catch (e) {
          //
        }
      }).catch(() => {
        //
      });
    },
    ...mapActions([
      'fetchPartners',
      'fetchGroups',
    ]),
  },
  components: {
    Detail,
    Handle,
    TheMap,
    HandleDetail,
    EditVehicle,
    EditDevice,
  },
};
</script>

<style lang="stylus">
  .typeids-group
    column-count: 4
    .el-checkbox
      margin-left: 15px

  .device-alert-table
    td:not(.el-table-column--selection)
      .cell
        padding: 0px 5px;

</style>

