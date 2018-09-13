<template>
  <el-container class="ovf-hd h-100p">
    <el-aside class="el-aside" width="250px">
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
        <!-- <el-input size="mini" clearable v-model="params.name" class="w-200" placeholder="请输入分组名"></el-input>
        <el-input size="mini" clearable v-model="params.linkName" class="w-200" placeholder="请输入联系人"></el-input> -->
        <!-- <el-cascader
          size="mini"
          style="margin: 2px 5px 0 0"
          placeholder="请选择账号名称"
          v-model="partnerid"
          :options="partnersTree"
          :props="{label: 'partnername',value: 'id',children: '_children'}"
          filterable
          clearable
          change-on-select
        ></el-cascader> -->
        <div class="btn-wrapper inline">
          <!-- <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button> -->
          <el-button size="mini" type="normal" icon="plus" @click="$refs.add.open()">新增分组</el-button>
          <el-button size="mini" type="normal" icon="el-icon-upload2" @click="$refs.import.open()">导入车辆到分组</el-button>
        </div>
      </div>
      <!-- <el-table
        stripe
        size="small"
        :data="tableData"
        v-loading="tableLoading"
        highlight-current-row>
        <el-table-column
          type="index"
          width="80px">
        </el-table-column>
        <el-table-column
          property="name"
          label="分组名">
        </el-table-column>
        <el-table-column
          property="partnerName"
          label="账号">
        </el-table-column>
        <el-table-column
          property="linkName"
          label="联系人">
        </el-table-column>
        <el-table-column
          property="linkMobile"
          label="联系电话">
        </el-table-column>
        <el-table-column
          property="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          property="createtime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          width="250"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="confirmDelete(scope.row.id)" v-show="scope.row.deviceStatus.length <= 0">删除</el-button>
            <el-button type="normal" size="mini" @click="$refs.detail.open(scope.row.id)">查看车辆</el-button>
          </template>
        </el-table-column>
      </el-table> -->
      <el-table :data="tableData" v-loading="tableLoading" size="mini">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="车架号"
          prop="vinNumber">
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="carNumber">
        </el-table-column>
        <el-table-column
          label="车品牌"
          prop="brand">
        </el-table-column>
        <el-table-column
          label="车类型"
          prop="carType">
        </el-table-column>
        <el-table-column
          label="发动机号"
          prop="engNumber">
        </el-table-column>
        <el-table-column
          label="底盘号"
          prop="chaNumber">
        </el-table-column>
        <el-table-column
          label="账号名称"
          prop="partnerName">
        </el-table-column>
        <el-table-column
          label="分组"
          prop="groupName">
        </el-table-column>
        <el-table-column
          width="135"
          label="创建时间"
          prop="createtime">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="confirmDeleteVehicle(scope.row.id)">删除</el-button>
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
      <add ref="add" @init="fetchPartner"></add>
      <edit ref="edit" @init="fetchPartner"></edit>
      <import ref="import" @init="fetchPartner"></import>
    </el-main>
  </el-container>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import PartnerMixin from '@/assets/js/partner_com';

// import { mapGetters, mapActions } from 'vuex';
import Add from './add';
import Edit from './edit';
import Import from './import';
// import DetailTable from './detail-table';
// import SetAlarm from './set-alarm';

export default {
  name: escapeName('车辆分组列表'),
  mixins: [
    http,
    listMixin,
    PartnerMixin,
  ],
  data() {
    return {
      data: [],
      treeLoading: false,
      partnerid: [],
      params: {
        partnerId: null,
        // name: null,
        // linkName: null,
        groupId: null,
      },
      schema: {
        id: 'ids',
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerId = newValue[newValue.length - 1];
      } else {
        this.params.partnerId = null;
      }
      this.getAll();
    },
  },
  computed: {
    defaultExpandedKeys() {
      return [Lockr.get('partnerid') - 0];
    },
    username() {
      return Lockr.get('seusername');
    },
    // ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.zh_name = '分组';
    // this.name = '/vehicle/getGroups';
    this.name = '/vehicle/getVehicles';
    this.delUrl = '/vehicle/delGroup';
  },
  methods: {
    init() {
      // this.fetchPartners(true);
      this.fetchPartner();
      // this.getAll();
    },
    async fetchPartner() {
      try {
        this.treeLoading = true;
        let { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
        data = this.normalizePartner(data, true);
        const tree = [{
          name: this.username,
          id: Lockr.get('partnerid') - 0,
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
    handleNodeClick({ id }) {
      if (String(id).substr(0, 1) === 'z') {
        this.params.groupId = String(id).substr(2);
        this.getAll();
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
              <i class="el-icon-edit c-blue" title="编辑" onClick={() => this.$refs.edit.open(data.id.substr(2))}></i>
              &nbsp;
              <i class="el-icon-delete c-blue" title="删除" onClick={() => this.confirmDelete(data.id.substr(2))}></i>
            </span>
            : ''
          }
        </span>
      );
    },
    confirmDeleteVehicle(id) {
      this.$confirm('确认从该分组删除此车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false,
        customClass: 'bor-gra',
      })
      .then(async () => {
        const params = {};
        params.id = id;
        params.groupId = this.groupId;
        const loading = _g.toastMsg('normal', '正在删除中...');
        await this.apiPost('/vehicle/delGroupDevice', params);
        loading.close();
        _g.toastMsg('success', '删除成功');
        this.getAll();
      })
      .catch(() => {
        // catch error
      });
    },
    // ...mapActions(['fetchPartners']),
  },
  components: {
    Add,
    Edit,
    Import,
    // DetailTable,
    // SetAlarm,
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
