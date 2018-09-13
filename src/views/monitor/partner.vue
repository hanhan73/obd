<template>
  <div class="partner-wrapper h-100p">
    <el-collapse
      v-model="activeNames"
      @change="handleCollapseChange"
      class="padding-none">
      <el-collapse-item name="1">
        <template slot="title">
          &nbsp;&nbsp;&nbsp;&nbsp;<i @click.stop="refreshSidebar" :class="{ 'fa-spin': treeLoading }" class="fa fa-refresh" aria-hidden="true" title="重新加载列表(注: 选中项都会被重置)"></i>
          &nbsp;&nbsp;<span>{{username}}</span>
        </template>
        <div style="height: 250px; overflow-y: auto">
          <el-tree v-loading="treeLoading"
                  highlight-current
                  class="background-none border-none partner-tree"
                  node-key="partnerid"
                  :data="data"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :render-content="renderContent"
                  :default-expanded-keys="defaultExpandedKeys"
                  @node-click="handleNodeClick"
                  ref="tree">
          </el-tree>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-input placeholder="请输入设备名称或IMEI" v-model="params.devicename" clearable size="small" @change="handleNodeClick(_node)"></el-input>
    <el-radio-group v-model="params.devicetype" size="mini" class="alarm-date-wrapper" @change="handleNodeClick(_node)">
      <el-radio-button :label="null">全部</el-radio-button>
      <el-radio-button label="ZY-V">ZY-V</el-radio-button>
      <el-radio-button label="ZY-T">ZY-T</el-radio-button>
      <el-radio-button label="ZY-M">ZY-M</el-radio-button>
    </el-radio-group>
    <el-radio-group @change="handleVehicleStatusChange" v-model="vehicleStatus" class="vehicle-status-wrapper">
      <el-radio-button :label="0">在线<span v-show="vehicleStatus === 0">({{deviceNum}})</span></el-radio-button>
      <el-radio-button :label="1">离线<span v-show="vehicleStatus === 1">({{deviceNum}})</span></el-radio-button>
      <el-radio-button :label="2">报警<span v-show="vehicleStatus === 2">({{deviceNum}})</span></el-radio-button>
      <el-radio-button :label="3">关注<span v-show="vehicleStatus === 3">({{deviceNum}})</span></el-radio-button>
      <el-radio-button :label="5">所有<span v-show="vehicleStatus === 5">({{deviceNum}})</span></el-radio-button>
    </el-radio-group>
    <el-radio-group v-show="vehicleStatus === 2" v-model="params.queryType" size="mini" class="alarm-date-wrapper" @change="handleNodeClick(_node)">
      <el-radio-button :label="1">今日</el-radio-button>
      <el-radio-button :label="3">本周</el-radio-button>
      <el-radio-button :label="5">本月</el-radio-button>
    </el-radio-group>
    <el-table
      size="mini"
      height="auto"
      ref="table"
      v-loading="isLoading"
      class="w-100p table-padding-none table-tx-c partner-table"
      row-class-name="pointer"
      highlight-current-row
      :data="deviceData"
      @select="handleTableSelect"
      @select-all="handleTableSelectAll"
      @row-click="handleRowClick">
      <el-table-column
        type="selection"
        width="25">
      </el-table-column>
      <el-table-column
        width="52">
        <template slot-scope="{ row: { id, sn, color, connectedtype, isObd }, $index }">
          <span class="excircle">
            {{isObd === '1' ? 'M' : (connectedtype === '1' ? 'T' : 'V')}}
          </span>
          <svg-icon class="fz-20 ve-m" :class="color" icon-class="car" />
        </template>
      </el-table-column>
      <el-table-column
        prop="devicename"
        sortable
        show-overflow-tooltip
        label="名称">
      </el-table-column>
      <el-table-column
        sortable
        sort-by="vehicleState"
        show-overflow-tooltip
        label="状态">
        <template slot-scope="{ row: { isFllow, vehicleState, color, id, vId, sn, connectedtype, partnerid, gpsinfo: { lng, lat, isonline } }, $index }">
          <span :class="vehicleStatus === 2 ? 'c-red' : color">{{vehicleState}}</span>
          <div class="float-menu">
            <el-button-group>
              <el-button round size="mini" @click.stop="$emit('handleOpenVehicleData', id, vId, sn, partnerid)"><i class="fa fa-file-text-o" aria-hidden="true"></i> 资料</el-button>
              <el-button round size="mini" @click.stop="$emit('handleSettings', connectedtype !== '1', sn, lng, lat, isonline, id)"><i class="fa fa-cog" aria-hidden="true"></i> 设置</el-button>
              <el-button round v-if="isFllow === '0'" plain key="fllow" size="mini" @click.stop="handleFocusDevice(id, sn, isFllow, $index)"><i class="el-icon-star-on"></i> 取消关注</el-button>
              <el-button round v-else key="cancelFllow" plain size="mini" @click.stop="handleFocusDevice(id, sn, isFllow, $index)"><i class="el-icon-star-off"></i> 关注</el-button>
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination bg-wh">
      <el-pagination
        class="tx-c"
        small
        layout="prev, pager, next"
        :total="pagination.counts"
        :page-size="pagination.pageSize"
        :current-page.sync="pagination.curPage"
        @current-change="handleCurrentPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import PartnerMixin from '@/assets/js/partner_com';
import { vehicleColor } from '@/assets/js/config';

export default {
  props: {
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    mapLoading: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [http, PartnerMixin],
  data() {
    const vehicleStatus = 0;
    return {
      deviceNum: 0,
      // filterText: '',
      tabsActiveName: 'first',
      activeNames: Lockr.get('collapse_activeNames') ? Lockr.get('collapse_activeNames') : [],
      treeLoading: false,
      deviceData: [],
      data: [],
      isLoading: false,
      vehicleStatus,
      params: {
        devicetype: null,
        queryType: 1,
        devicename: '',
        isOnlinevIds: vehicleStatus,
        pageSize: 10000,
      },
      pagination: {
        counts: 0,
        curPage: 1,
        pageSize: 20,
      },
    };
  },
  watch: {
    props() {
      this.refreshPage();
    },
  },
  computed: {
    multiple() {
      return Lockr.get('securId') === 2 ? 1 : 1;
    },
    defaultExpandedKeys() {
      return [Lockr.get('partnerid') - 0];
    },
    username() {
      return Lockr.get('seusername');
    },
  },
  methods: {
    refreshPage(isFirstLoad) {
      if (!this.props) return;
      const { vehicleId, sn } = this.props;
      if (vehicleId || sn) {
        this.fetchDeviceByVehicleid(vehicleId, sn);
      }
      this.refreshSidebar(isFirstLoad);
    },
    async refreshSidebar(isFirstLoad = true) {
      if (isFirstLoad) await this.fetchPartner();
      this.$nextTick(() => {
        try {
          const el = this.$refs.tree.$el.querySelector('.el-tree-node');
          if (el) {
            el.click();
          }
        } catch (e) {
          //
        }
      });
    },
    // async fetchPartner() {
    //   try {
    //     this.treeLoading = true;
    //     let { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
    //     data = this.normalizePartner(data, true);
    //     const tree = [{
    //       name: this.username,
    //       id: Lockr.get('partnerid') - 0,
    //       userid: Lockr.get('securId'),
    //       icon: 'home',
    //       total: _.sumBy(data, 'total'),
    //       online: _.sumBy(data, 'online'),
    //       children: data,
    //     }];
    //     this.data = tree;
    //     this.treeLoading = false;
    //   } finally {
    //     this.treeLoading = false;
    //   }
    // },
    renderContent(h, { node, data }) {
      return (
        <span
          class={{
            'el-tree-node__label': true,
          }}
        >
          <i class={`c-blue fa fa-${data.icon}`} aria-hidden="true" />
          &nbsp;
          {node.label}
          &nbsp;
          <i>
            (<i class="c-green f-w-b">{data.onlineNum * this.multiple}</i>/{data.totalNum * this.multiple})
          </i>
        </span>
      );
    },
    async fetchPartner() {
      try {
        this.treeLoading = true;
        const { data } = await this.apiPost('/partner/getPartnerDeviceTree', {});
        const treeData = this.normalizePartner(data);
        const userid = Lockr.get('securId') - 0;
        let totalNum = _.sumBy(treeData, 'totalNum');
        let onlineNum = _.sumBy(treeData, 'onlineNum');
        if (userid !== 1 && userid !== 2) {
          const {
                  totalNum: total,
                  onlineNum: online,
                } = data[data.findIndex(i => i.userid === userid)];
          totalNum += total;
          onlineNum = online;
        }
        const tree = [{
          name: this.username,
          partnerid: Lockr.get('partnerid') - 0,
          icon: 'home',
          userid,
          totalNum,
          onlineNum,
          children: treeData,
        }];
        this.data = tree;
        this.treeLoading = false;
      } finally {
        this.treeLoading = false;
      }
    },
    normalizePartner(list) {
      const listToTree = (partnerid, data) => {
        const children = [];
        data.forEach((item) => {
          if (item.parentid === partnerid) {
            item.children = listToTree(item.partnerid, data);
            let totalNum = item.totalNum;
            // let onlineNum = item.onlineNum;
            item.children.forEach((i) => {
              totalNum += i.totalNum;
              // onlineNum += i.onlineNum;
            });
            item.icon = 'home';
            item.totalNum = totalNum;
            // item.onlineNum = onlineNum;
            item.name = item.partnername;
            children.push(item);
          }
        });
        return children;
      };
      return listToTree(parseInt(Lockr.get('partnerid'), 10), list);
    },
    handleVehicleStatusChange(status) {
      this.pagination.curPage = 1;
      this.params.isOnlinevIds = status;
      this.handleNodeClick(this._node);
    },
    handleCurrentPageChange(page) {
      this.pagination.curPage = page;
      this.handleNodeClick(this._node);
    },
    async handleNodeClick(node) {
      // this.$emit('handleNodeClick', data);
      if (!node) return;
      const { partnerid, userid } = node;
      if (this._node && partnerid !== this._node.partnerid) this.pagination.curPage = 1;
      this._node = node;
      this.isLoading = true;
      let params = _.cloneDeep(this.params);
      params.partnerid = partnerid;
      params.userid = userid;
      try {
        params = _.merge(params, this.pagination);
        const { data, page: { curPage, counts } } = await this.apiPost('/device/qryDeviceData', params);
        this._lastTreeParams = _.cloneDeep(params);
        this.pagination.curPage = curPage;
        this.pagination.counts = counts;
        this.deviceNum = counts * this.multiple;
        this.deviceData = data === '' ? [] : data.map((i) => {
          i.color = i.objectState === '' ? '' : vehicleColor[i.objectState];
          return i;
        });
      } finally {
        this.isLoading = false;
      }
    },
    handleRowClick(row, event) {
      const { vId, sn } = row;
      if (event.target.nodeName === 'INPUT' || event.target.className === 'el-checkbox__inner') return;
      this.fetchDeviceByVehicleid(vId, sn);
    },
    handleTableSelect(selection, { sn, vId }) {
      if (selection.findIndex(i => i.sn === sn) === -1) return;// 取消勾选就不处理
      this.fetchDeviceByVehicleid(vId, sn);
    },
    handleTableSelectAll(selection) {
      if (!selection.length) return;
      this.fetchDeviceByVehicleid('', '');
    },
    async fetchDeviceByVehicleid(vIds, sn, refresh = false, locationType) {
      if (this.mapLoading) return;
      if (refresh && vIds === '') {
        vIds = this.__vIds;
        sn = this.__sn;
      }
      let data = [];
      try {
        this.$emit('update:mapLoading', true);
        if (vIds) {
          const { data: vehicle } = await this.apiPost('/vehicle/getVehicles', { vIds, isOnlinevIds: 5 });
          data = vehicle === '' ? [] : vehicle;
        } else {
          const { data: devicelist } = await this.apiPost('/device/qryDeviceData', sn ? { sn } : this._lastTreeParams);
          devicelist.forEach((i) => {
            data.push({
              carNumber: '',
              userName: '',
              userPhone: '',
              partnerName: i.partnername,
              id: null,
              devicelist: [i],
            });
          });
        }
      } finally {
        if (!data.length) {
          this.$emit('hideCurrentMarker');
          _g.toastMsg('warning', '暂无数据');
        } else {
          this.__vIds = vIds;
          this.__sn = sn;
          this.$emit('handleTableSelect', data, sn, refresh, locationType);
        }
        this.$emit('update:mapLoading', false);
      }
    },
    handleCollapseChange() {
      Lockr.set('collapse_activeNames', this.activeNames);
    },
    async handleFocusDevice(id, sn, isFllow, index) {
      try {
        const type = isFllow === '0' ? '1' : '0';
        await this.apiPost('/device/fllowDevice', { id, sn, type });
        _g.toastMsg('success', `${isFllow === '0' ? '取消关注' : '关注'}成功`);
        this.deviceData[index].isFllow = type;
        // this.getAll();
      } finally {
        //
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

.partner-wrapper
  display: flex
  flex-direction: column
  >.el-table
    flex: 1 1 auto

.partner-tree
  .el-tree-node__expand-icon
    border-width: 8px
    border-left-width: 10px
    border-right-width: 0px

.partner-table
  .el-table__body
    tr
      .excircle
        display: inline-block
        margin-right: 3px
        height: 16px
        width: 16px
        line-height: 16px
        border: 1px solid #DCDFE6
        border-radius: 50%
        color: #409EFF
        font-size: 12px
        font-weight: bold
      .float-menu
        display: none
        position: absolute
        right: 5px
        top 35px
        width 235px
        .el-button
          margin-left: 0px
          i
            padding 0px
      &.current-row
        >td
          padding-bottom 35px
          .float-menu
            display: block

.leftTabs
  .el-tabs__header
    margin-bottom: 0px
    .el-tabs__nav
      width: 100%
      .el-tabs__item
        width: 25%
.vehicle-status-wrapper
  width: 100%
  display: flex
  >.el-radio-button
    flex: 1 1 auto
    >.el-radio-button__inner
      width: 100%
      padding: 10px 0px
      box-shadow: none
      border: none
      background: transparent
    &:nth-child(1)
      >.el-radio-button__inner
        color: #13ce66
      &.is-active
        >.el-radio-button__inner
          color: #fff
          background-color: #009900
    &:nth-child(3)
      >.el-radio-button__inner
        color: #ff4949
      &.is-active
        >.el-radio-button__inner
          color: #fff
          background-color: #aa0000
    &:nth-child(4), &:nth-child(5)
      >.el-radio-button__inner
      &.is-active
        >.el-radio-button__inner
          background-color: #20A0FF
    &:nth-child(2)
      >.el-radio-button__inner
        color: #999
      &.is-active
        >.el-radio-button__inner
          color: #fff
          background-color: #999

.alarm-date-wrapper
  // margin: 0px 0px 3px;
  width: 100%
  display: flex
  >.el-radio-button
    flex: 1 1 auto
    >.el-radio-button__inner
      width: 100%
      padding: 10px 0px
</style>
