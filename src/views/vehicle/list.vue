<template>
  <el-container class="ovf-hd h-100p">
    <el-aside class="el-aside" width="200px">
      <el-tree highlight-current
               :expand-on-click-node="false"
               class="tree"
               node-key="id"
               :data="data"
               :props="defaultProps"
               :render-content="renderContent"
               :default-expanded-keys="defaultExpandedKeys"
               v-loading="treeLoading"
               @node-click="handleNodeClick">
      </el-tree>
    </el-aside>
    <el-main class="el-main">
      <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input size="mini" clearable v-model="params.carNumber" class="w-200" placeholder="请输入车牌号"></el-input>
        <el-input size="mini" clearable v-model="params.vinNumber" class="w-200" placeholder="请输入车架号"></el-input>
        <el-input size="mini" clearable v-model="params.brand" class="w-200" placeholder="请输入车品牌"></el-input>
        <!-- <el-cascader
          size="mini"
          style="margin: 2px 5px 0 0"
          placeholder="请选择账号名称"
          v-model="partnerid"
          :options="partnersTree"
          :props="{label: 'partnername', value: 'id', children: '_children'}"
          filterable
          clearable
          change-on-select
        ></el-cascader> -->
        <el-radio-group size="mini" v-model="params.isOnlinevIds" @change="getAll">
          <el-radio-button :label="null">全部</el-radio-button>
          <el-radio-button :label="3">已绑定</el-radio-button>
          <el-radio-button :label="4">未绑定</el-radio-button>
        </el-radio-group>
        <div class="btn-wrapper inline">
          <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
          <el-button size="mini" icon="plus" @click="$refs.add.open()">新增车辆</el-button>
          <el-button size="mini" icon="el-icon-upload2" @click="$refs.import.open()">批量导入</el-button>
          <el-button size="mini" type="normal" icon="plus" @click="$refs.groupAdd.open()">新增分组</el-button>
          <el-button size="mini" type="normal" icon="el-icon-upload2" @click="$refs.groupImport.open()">导入车辆到分组</el-button>
        </div>
      </div>
      <el-table
        stripe
        size="mini"
        :data="tableData"
        :row-class-name="tableRowClassName"
        v-loading="tableLoading">
        <el-table-column
          type="index"
          width="50px">
        </el-table-column>
        <el-table-column
          width="85"
          prop="carNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="车主姓名">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="车主电话">
        </el-table-column>
        <el-table-column
          prop="partnerName"
          label="账户名称">
        </el-table-column>
        <el-table-column
          align="center"
          width="95"
          :formatter="({ devicelist }) => `${devicelist.length}个`"
          label="设备安装数量">
        </el-table-column>
        <el-table-column
          prop="brand"
          label="车品牌">
        </el-table-column>
        <el-table-column
          prop="carType"
          label="车型号">
        </el-table-column>
        <el-table-column
          width="95"
          align="center"
          prop="vehicleInfo.nextMtDate"
          label="下次保养日期">
        </el-table-column>
        <el-table-column
          width="95"
          align="center"
          prop="vehicleInfo.nextMtMil"
          label="下次保养里程">
        </el-table-column>
        <el-table-column
          prop="vehicleInfo.mtStatus"
          label="保养状态">
        </el-table-column>
        <el-table-column
          prop="vehicleInfo.insuranceCom"
          label="保险公司">
        </el-table-column>
        <el-table-column
          prop="vehicleInfo.nextInsuranceDate"
          label="保单到期">
        </el-table-column>
        <el-table-column
          align="center"
          prop="vehicleInfo.insuranceStatus"
          label="保险状态">
        </el-table-column>
        <el-table-column
          prop="vehicleInfo.nextYearlyInsDate"
          label="下次年检">
        </el-table-column>
        <el-table-column
          prop="vehicleInfo.yearlyStatus"
          label="年检状态">
        </el-table-column>
        <el-table-column
          label="绑定状态">
          <template slot-scope="{ row: { devicelist } }">
            <el-tag
              size="mini"
              :type="!devicelist.length ? 'info' : 'success'"
              close-transition>{{!devicelist.length ? '未绑定' : '已绑定'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="235"
          label="操作">
          <template slot-scope="{ row: { id, deviceStatus, isFllow, userPhone }, row, $index }">
            <div class="pos-rel">
              <el-button-group>
                <el-button style="position: relative; z-index: 1" type="primary" size="mini" @click="$refs.edit.open(id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="confirmDelete(id)">删除</el-button>
                <el-button type="normal" size="mini" @click="handleBindVehicle(id, row, deviceStatus, userPhone)">{{deviceStatus === '' ? '绑定设备' : '编辑设备信息'}}</el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pos-rel p-t-20 p-b-20 pages-footer">
        <div class="stat">

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
    <add ref="add" @init="getAll"></add>
    <edit ref="edit" @init="getAll"></edit>
    <!-- <detail-table ref="detail" @init="getAll"></detail-table> -->
    <import ref="import" @init="getAll"></import>
    <group-add ref="groupAdd" @init="fetchPartner"></group-add>
    <group-edit ref="groupEdit" @init="fetchPartner"></group-edit>
    <group-import ref="groupImport" @init="fetchPartner"></group-import>
    <bind-vehicle ref="bindVehicle" @init="getAll"></bind-vehicle>
    <edit-bind-vehicle ref="editBindVehicle" @init="getAll"></edit-bind-vehicle>
    </el-main>
  </el-container>
</template>

<script>
import VueStar from 'vue-star';
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import PartnerMixin from '@/assets/js/partner_com';

import GroupAdd from './group/add';
import GroupEdit from './group/edit';
import GroupImport from './group/import';

import Add from './add';
import Edit from './edit';
// import DetailTable from './detail-table';
import Import from './import';
import BindVehicle from '../userDevice/add';
import EditBindVehicle from '../userDevice/edit';

export default {
  name: escapeName('车辆列表'),
  mixins: [
    http,
    listMixin,
    PartnerMixin,
  ],
  data() {
    return {
      data: [],
      treeLoading: false,
      // partnerid: [],
      params: {
        carNumber: null,
        vinNumber: null,
        brand: null,
        partnerId: null,
        groupId: null,
        isOnlinevIds: null,
      },
      schema: {
        id: 'ids',
      },
    };
  },
  // watch: {
  //   partnerid(newValue) {
  //     if (newValue.length) {
  //       this.params.partnerId = newValue[newValue.length - 1];
  //     } else {
  //       this.params.partnerId = null;
  //       this.params.groupId = null;
  //     }
  //     this.getAll();
  //   },
  // },
  computed: {
    partnerid() {
      return Lockr.get('partnerid') - 0;
    },
    username() {
      return Lockr.get('seusername');
    },
    defaultExpandedKeys() {
      return [Lockr.get('partnerid') - 0];
    },
    filterGroups() {
      return this.groups.filter(i => i.partnerId === this.params.partnerId);
    },
    // ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.zh_name = '车辆';
    this.name = '/vehicle/getVehicles';
    this.delUrl = '/vehicle/delVehicle';
  },
  methods: {
    init() {
      // this.fetchPartners(true);
      this.params.partnerId = this.partnerid;
      this.fetchPartner();
      this.getAll();
    },
    async fetchPartner() {
      try {
        this.treeLoading = true;
        let { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
        data = this.normalizePartner(data, true);
        const tree = [{
          name: this.username,
          id: this.partnerid,
          userid: Lockr.get('securId'),
          icon: 'home',
          total: _.sumBy(data, 'total'),
          online: _.sumBy(data, 'online'),
          children: data,
        }];
        this.data = tree;
        this.treeLoading = false;
      } finally {
        this.treeLoading = false;
      }
    },
    renderContent(h, { node, data }) {
      return (
        <span
          class={{
            'el-tree-node__label': true,
            'c-sliver': data.isonline === false,
            'c-green': data.isonline === true,
          }}
        >
          <i class={`c-blue fa fa-${data.icon}`} aria-hidden="true" />
          &nbsp;
          {node.label}
          &nbsp;
          &nbsp;
          {
            String(data.id).substr(0, 1) === 'z' ?
            <span class="tree-btn-wrapper">
              <i class="el-icon-edit c-blue" title="编辑" onClick={() => this.$refs.groupEdit.open(data.id.substr(2))}></i>
              &nbsp;
              <i class="el-icon-delete c-blue" title="删除" onClick={() => this.confirmDeleteVehicle(data.id.substr(2))}></i>
            </span>
            : ''
          }
        </span>
      );
    },
    tableRowClassName({ deviceStatus }) {
      if (deviceStatus === '') {
        return 'info-row';
      }
      return '';
    },
    async handleFocusVehicle(vehicleid, isFllow, index) {
      try {
        const type = isFllow === '0' ? '1' : '0';
        await this.apiPost('/vehicle/fllowVehicle', { vehicleid, type });
        _g.toastMsg('success', `${isFllow === '0' ? '取消关注' : '关注'}成功`);
        this.tableData[index].isFllow = type;
        // this.getAll();
      } finally {
        //
      }
    },
    handleBindVehicle(id, row, deviceStatus, userPhone) {
      if (deviceStatus === '') {
        this.$refs.bindVehicle.open(row, [], userPhone);
      } else {
        this.$refs.editBindVehicle.open(id);
      }
    },
    handleNodeClick({ id }) {
      if (typeof id === 'string') {
        this.params.partnerId = null;
        this.params.groupId = id.substring(2);
      } else {
        this.params.partnerId = id;
        this.params.groupId = null;
      }
      this.getAll();
    },
    confirmDeleteVehicle(id) {
      this.$confirm('确认删除该分组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // modal: false,
        // customClass: 'bor-gra',
      })
      .then(async () => {
        const params = {};
        params.ids = id;
        await this.apiPost('/vehicle/delGroup', params);
        _g.toastMsg('success', '删除成功');
        this.fetchPartner();
      })
      .catch(() => {
        // catch error
      });
    },
  },
  components: {
    Add,
    Edit,
    // DetailTable,
    Import,
    GroupAdd,
    GroupEdit,
    GroupImport,
    VueStar,
    BindVehicle,
    EditBindVehicle,
  },
};
</script>

<style>
  .tree>.el-tree-node>.el-tree-node__children {
    overflow: auto;
  }
  .tree .is-current>div>span>.tree-btn-wrapper {
    display: inline;
  }
  .tree-btn-wrapper {
    display: none;
  }
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~assets/stylus/variable'

  .el-main
    padding: 5px

  .el-aside
    padding: 5px
    border-right: 1px solid #ccc
    .tree
      border: $border
      box-shadow: $box-shadow

</style>
