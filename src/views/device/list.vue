<template>
  <div class="wrapper">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <!-- <el-select v-model="params.partnerid"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择账号名称"
                 @change="getAll">
        <el-option
          v-for="item in partners"
          :key="item.id"
          :label="item.partnername"
          :value="item.id">
        </el-option>
      </el-select> -->
      <el-cascader
        size="mini"
        style="margin: 2px 5px 0 0"
        placeholder="请选择账号名称"
        v-model="backUserId"
        :options="partnersTree"
        :props="{label: 'username', value: 'id', children: '_children'}"
        filterable
        clearable
        change-on-select
      ></el-cascader>
      <el-input size="mini" clearable class="w-300" placeholder="请输入内容(ICCID,IMEI,设备名称)" v-model.trim="params.query" @change="handleSearchTextChange" @keyup.native.enter="getAll">
        <!-- <template slot="prepend">
          <el-select v-model="params.query" class="w-100" @change="handleSearchTypeChange">
            <el-option v-for="(i, index) in searchOptions" :key="index" :value="i.value" :label="i.label"></el-option>
          </el-select>
        </template> -->
      </el-input>
      <el-select v-model="params.isActive"
                 size="mini"
                 placeholder="请选择设备状态"
                 clearable
                 @change="getAll">
        <!-- <el-option :value="null" label="全部"></el-option> -->
        <el-option :value="1" label="未激活"></el-option>
        <el-option :value="0" label="已激活"></el-option>
      </el-select>
       <el-select size="mini" v-model="params.typeid" clearable placeholder="请选择设备类型">
        <el-option
          v-for="item in options3"
          :key="item.value"
          :label="item.typecode"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="m-l-5 p-r-5" style="border-left: 1px solid #ccc"></div>
      <div class="m-l-5 p-r-5" style="border-left: 1px solid #ccc"></div>
      <el-popover
        ref="batchSearch"
        placement="bottom"
        width="384"
        trigger="click"
        v-model="batchSearchVisible">
        <el-tabs tab-position="left" style="height: 220px;">
          <el-tab-pane label="无序查询">
            <el-radio-group v-model="batchSearch.type" size="mini">
              <el-radio-button v-for="(i, index) in searchTypeOptions" :key="index" :label="i.label">{{i.text}}</el-radio-button>
            </el-radio-group>
            <el-input
              class="m-t-20"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 7}"
              placeholder="请输入号码, 以换行隔开"
              v-model="batchSearch.text">
            </el-input>
          </el-tab-pane>
        </el-tabs>
        <el-button size="mini" type="primary" class="fr" @click="handleBatchSearch">查询</el-button>
        <el-button size="mini" class="fr m-r-5" @click="batchSearchVisible = false">取消</el-button>
      </el-popover>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
      <!-- <el-button size="mini" icon="el-icon-search" type="primary" plain v-popover:batchSearch>批量搜索</el-button>
      <el-button size="mini" plain @click="handleAllotDevice"><svg-icon icon-class="allot"/>&nbsp;&nbsp;一键分配</el-button> -->
      <el-button size="mini" @click="handleReset">
        <i class="fa fa-undo" aria-hidden="true"></i>
        重置
      </el-button>
      <!-- <el-button size="mini" icon="el-icon-download" @click="handleExport">导出设备</el-button> -->
      <!-- <el-button size="mini" icon="el-icon-download" @click="handleExportUnallocated">导出未分配设备</el-button> -->
    </div>

    <el-table
      stripe
      border
      height="auto"
      size="mini"
      class="ovf-vis"
      @sort-change="activetimeSort"
      :default-sort="{prop: 'activetime', order: 'descending'}"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row
      @selection-change="val => selection = val">
      <el-table-column
        width="35px"
        type="selection"
        :selectable="item => item.status === 1">
      </el-table-column>
      <el-table-column
        type="index"
        width="35px">
      </el-table-column>
      <!-- <el-table-column width="50px" label="操作">
        <template slot-scope="{ row: { sn } }">
          <el-button size="mini" type="text" @click="$routerPush({name: '在线监控', path: '/main/monitor', props: { sn }})">
            跟踪
          </el-button>
        </template>
      </el-table-column> -->
      <el-table-column
        width="180"
        prop="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        width="130"
        prop="imei"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="150"
        prop="backUserName"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="70"
        align="center"
        prop="typeName"
        label="设备类型">
      </el-table-column>
      <!-- <el-table-column
        prop="sn"
        label="SN">
      </el-table-column> -->
      <el-table-column
        width="125"
        prop="simphone"
        label="电话号码">
      </el-table-column>
      <el-table-column
        width="165px"
        prop="iccid"
        label="ICCID">
      </el-table-column>
      <el-table-column
        width="50px"
        label="状态">
        <template slot-scope="{ row: { isOnline } }">
          <span v-if="isOnline === '0'" class="c-green">在线</span>
          <span v-else-if="isOnline === '1'" class="c-gray">离线</span>
          <span v-else class="c-blue">休眠</span>
        </template>
      </el-table-column>
      <el-table-column
        icon="el-icon-d-caret"
        width="140px"
        sortable="custom"
        :formatter="({ activetime }) => activetime === '' ? '未激活' : activetime"
        label="激活时间">
      </el-table-column>
      <el-table-column
        width="140px"
        prop="createtime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        min-width="260px"
        label="操作">
        <template slot-scope="scope">
          <div class="pos-rel p-l-30">
            <!-- <vue-star animate="animated bounceIn" style="top: -130%; left: -40px">
              <i slot="icon" :class="`el-icon-star-${isFllow === '0' ? 'on' : 'off'} fz-18 ve-m`" @click="handleFocusDevice(id, sn, isFllow, $index)"></i>
            </vue-star> -->
            <el-button-group>
              <!-- <el-button v-if="status !== 1" class="bindDetailButton" type="normal" size="mini" @click="$refs.detail.open(vehicleid)">{{carnumber}}</el-button> -->
              <!-- <el-button v-else class="bindDetailButton" type="primary" plain size="mini" @click="$refs.bindVehicle.open(null, [row])">绑定车辆</el-button> -->
              <el-button type="primary" size="mini" @click="$refs.vehicleData.open(scope.row)">编辑</el-button>
              <el-button v-if="isAdmin" type="danger" size="mini" @click="confirmDelete(scope.id)">删除</el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-10 p-b-10 pages-footer">
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
          :current-page="pagination.pageNumber"
          :total="pagination.dataCount * multiple">
        </el-pagination>
      </div>
    </div>
    <edit ref="edit" @init="getAll"></edit>
    <allot ref="allot" @init="getAll"></allot>
    <!-- <add ref="add" @init="getAll"></add>
    <import ref="import" @init="getAll"></import> -->
    <detail-table ref="detail"></detail-table>
    <bind-vehicle ref="bindVehicle"></bind-vehicle>
    <vehicle-data ref="vehicleData" @init="getAll"></vehicle-data>
  </div>
</template>

<script>
import VueStar from 'vue-star';
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';
import BindVehicle from 'views/userDevice/add';
// import Add from './add';
import Edit from './edit';
import Allot from './allot';
// import Import from './import';
import DetailTable from './detail-table';
import VehicleData from '../monitor/vehicle-data';

export default {
  name: escapeName('设备列表'),
  mixins: [http, listMixin],
  filters: {
    statusFilter(status) {
      return status === 1 ? '未绑定' : '已绑定';
    },
  },
  data() {
    const backUserId = parseInt(Lockr.get('partnerid'), 10) || null;
    return {
      backUserId: [backUserId],
      selection: [],
      searchType: 'imei',
      searchText: '',
      searchOptions: [
        // { label: 'SN', value: 'sn' },
        { label: 'IMEI', value: 'imei' },
        { label: 'ICCID', value: 'iccid' },
        { label: '电话号码', value: 'simphone' },
        { label: '设备名称', value: 'devicename' },
      ],
      options3: null,
      batchSearchVisible: false,
      batchSearchTips: [
        '说明：此方法适用于正序数列，从开始号码递增查询出输入数量',
        '说明：此方法适用于连续数列，在开始号码和结束号码间查询',
      ],
      batchSearch: {
        type: 0,
        text: null,
        startText: null,
        endText: null,
        sequenceType: 0,
      },
      searchTypeOptions: [
        // { label: 0, text: 'SN', attr: 'sn' },
        { label: 0, text: 'IMEI', attr: 'imei' },
        { label: 1, text: '电话号码', attr: 'simphone' },
        // { label: 2, text: '设备名称' },
        // { label: 3, text: '车牌号' },
      ],
      params: {
        backUserId,
        iccid: null,
        sn: null,
        isFllow: null,
        simphone: null,
        isActive: null,
        query: null,
        queryType: null,
        orderBy: 'activetime desc',
        typeid: null,
      },
    };
  },
  beforeCreate() {
    this.zh_name = '设备';
    this.name = '/device/findAll';
    this.delUrl = '/device/delDevice';
    this.getdevicetype = '/device/findAllDeviceType';
  },
  watch: {
    backUserId(newValue) {
      if (newValue.length) {
        this.params.backUserId = newValue[newValue.length - 1];
      } else {
        this.params.backUserId = null;
      }
      this.getAll();
    },
  },
  computed: {
    multiple() {
      return Lockr.get('securId') === 2 ? 1 : 1;
    },
    isAdmin() {
      return Lockr.get('securId') === 1;
    },
    computedTxet() {
      return this.searchTypeOptions[this.batchSearch.type].text;
    },
    ...mapGetters(['partnersTree']),
  },
  methods: {
    async init() {
      const { data } = await this.apiPost('/device/findAllDeviceType', {});
      this.options3 = data;
      this.fetchPartners(true);
      this.getAll();
    },
    handleBatchSearch() {
      this.clearScreeningCondition();
      const text = this.batchSearch.text.split('\n');
      const type = this.batchSearch.type;
      this.params.queryType = type + 1;
      this.params[this.searchTypeOptions[type].attr] = text.join('/br');
      this.getAll();
    },
    handleAllotDevice() {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请勾选需要分配的设备');
        return;
      }
      this.$refs.allot.open(this.selection.map(i => i.id));
    },
    handleSearchTypeChange(val) {
      this.searchOptions.forEach((i) => {
        if (i.value !== this.searchType) {
          this.params[i.value] = null;
        } else {
          this.params[val] = this.searchText;
        }
      });
    },
    handleSearchTextChange(val) {
      this.params[this.searchType] = val;
    },
    clearScreeningCondition() {
      for (const i in this.params) {
        if (Object.prototype.hasOwnProperty.call(this.params, i)) {
          this.params[i] = null;
        }
      }
    },
    handleReset() {
      this.clearScreeningCondition();
      this.getAll();
    },
    async handleFocusDevice(id, sn, isFllow, index) {
      try {
        const type = isFllow === '0' ? '1' : '0';
        await this.apiPost('/device/fllowDevice', { id, sn, type });
        _g.toastMsg('success', `${isFllow === '0' ? '取消关注' : '关注'}成功`);
        this.tableData[index].isFllow = type;
        // this.getAll();
      } finally {
        //
      }
    },
    handleExport() {
      this.$confirm('是否导出设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        const params = { ...this.params };
        if (params.sn !== null) {
          params.sn = params.sn.replace(/\/br/g, ',');
        }
        location.href = `${HOST}/excel/exportDeviceList?${this.transformRequest(params)}`;
      })
      .catch(e => console.log(e));
    },
    handleExportUnallocated() {
      this.$confirm('是否导出未分配设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        const params = {
          partnerid: Lockr.get('partnerid'),
        };
        location.href = `${HOST}/device/exportNoPartnerDevice?${this.transformRequest(params)}`;
      })
      .catch(() => {
      });
    },
    activetimeSort(ob) {
      if (ob.order === 'ascending') {
        this.params.orderBy = 'activetime';
      } else if (ob.order === 'descending') {
        this.params.orderBy = 'activetime desc';
      }
      this.getAll();
    },
    ...mapActions(['fetchPartners']),
  },
  components: {
    // Add,
    // Import,
    Allot,
    Edit,
    DetailTable,
    VueStar,
    BindVehicle,
    VehicleData,
  },
};
</script>

<style lang="stylus" scoped>
.wrapper
  height 100%
  display flex
  flex-direction column
  .el-table
    flex 1 1 auto
</style>


<style lang="stylus" rel="stylesheet/stylus">
  .el-table.ovf-vis
    .cell
      overflow: visible
    .el-table__body-wrapper
      .el-table__body
        tbody
          tr:last-child
            td:last-child
              overflow: hidden

  .bindDetailButton
     position: relative
     z-index: 1
     width: 86px
     overflow: hidden
     text-overflow: ellipsis
</style>
