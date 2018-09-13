<template>
  <div class="wrapper ovf-hd">
    <section class="left p-t-5 p-l-5">
      <el-tree highlight-current
               class="tree partnerTree ovf-y-auto ovf-x-auto h-100p"
               :data="data"
               :props="defaultProps"
               v-loading="treeLoading"
               @node-click="handleNodeClick">
      </el-tree>
    </section>
    <section class="right ovf-y-auto">
      <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input size="mini" v-model="params.partnerName" class="w-200" placeholder="请输入公司名称"></el-input>
        <!-- <el-input size="mini" v-model="params.linkname" class="w-200" placeholder="请输入联系人"></el-input> -->
        <el-input size="mini" v-model="params.linkmobile" class="w-200" placeholder="请输入手机号码"></el-input>
        <div class="btn-wrapper inline">
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
          <el-button size="mini" type="normal" icon="el-icon-plus" @click="$refs.add.open(params.parentid)">新增</el-button>
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
          width="80px">
        </el-table-column>
        <el-table-column
          property="username"
          label="账号名称">
        </el-table-column>
        <el-table-column
          property="linkname"
          label="联系人名称">
        </el-table-column>
        <el-table-column
          property="parentName"
          label="上级单位">
        </el-table-column>
        <el-table-column
          property="useraccount"
          label="账号">
        </el-table-column>
        <el-table-column
          property="mobile"
          label="联系人号码">
        </el-table-column>
        <el-table-column
          property="accounttype"
          :formatter="accountFormat"
          label="账号类型">
        </el-table-column>
        <el-table-column
          property="roleName"
          label="角色权限">
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
          width="200"
          label="操作">
          <template slot-scope="{ row: { isactive, id, userid, rolename }, row }">
            <el-button-group>
              <!-- <el-button v-if="isactive === '2'" type="success" size="mini" @click="cancelOrActivateUser(isactive, userid)">激活</el-button> -->
              <!-- <el-button v-else type="warning" size="mini" @click="cancelOrActivateUser(isactive, userid)">注销</el-button> -->
              <el-button type="primary" size="mini" @click="$refs.edit.open(row, roleName)">编辑</el-button>
              <el-button type="danger" size="mini" @click="confirmDelete(id)">删除</el-button>
            </el-button-group>
            <!-- <el-button type="normal" size="small" @click="$refs.setAuth.open(scope.row)">账号权限</el-button> -->
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
    </section>
    <add ref="add" @init="init"></add>
    <edit ref="edit" @init="init"></edit>
    <!-- <set-auth ref="setAuth"></set-auth> -->
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapActions } from 'vuex';

import Add from './add';
import Edit from './edit';
// import SetAuth from './set-auth';

export default {
  name: escapeName('账号名称列表'),
  mixins: [http, listMixin],
  data() {
    return {
      treeLoading: false,
      params: {
        partnername: null,
        linkname: null,
        linkmobile: null,
        parentid: null,
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'username',
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.zh_name = '账号名称';
    // this.name = '/partner/qryPartnerTree';
    this.name = '/backUser/findAll';
    this.delUrl = '/backUser/saveOrUpdate';
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    async init() {
      // console.log(Lockr);
      this.partnerid = parseInt(Lockr.get('partnerid'), 10);
      console.log(this.partnerid);
      this.currentpartnerid = '';
      if (this.partnerid && this.partnerid !== '0') {
        this.currentpartnerid = this.partnerid;
      }
      this.treeLoading = true;
      this.tableLoading = true;
      const { data, page: { totalRow } } = await this.apiPost('/backUser/findAll',
                     { partnerid: this.currentpartnerid, pageSize: 10000 });
      this.pagination.dataCount = totalRow;
      this.tableData = data.slice(0, this.pagination.pageSize);
      data.forEach((item, index, arr) => {
        if (item.parentid === '') {
          arr[index].parentid = 0;
        }
      });
      this.data = [{ username: '全部', children: [], id: null }].concat(this.listToTree(this.partnerid, data));
      this.treeLoading = false;
      this.tableLoading = false;
      console.log(this.data);
    },
    listToTree(pId, data) {
      const children = [];
      data.forEach((item) => {
        if (item.parentid === pId) {
          item.children = this.listToTree(item.id, data);
          children.push(item);
        }
      });
      return children;
    },
    cancelOrActivateUser(active, id) {
      const status = active === '2' ? '激活' : '注销';
      this.$confirm(`确认${status}该${this.zh_name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      }).then(async () => {
        let isactive;
        if (active === '1') {
          isactive = '2';
        } else {
          isactive = '1';
        }
        await this.apiPost('/backuser/upSecurUser', { isactive, id });
        _g.toastMsg('success', `${status}成功`);
        this.getAll();
      }).catch(() => {});
    },
    handleNodeClick(data) {
      this.params.parentid = data.id;
      this.getAll();
    },
    confirmDelete(id) {
      this.$confirm(`确认删除该${this.zh_name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      })
      .then(async () => {
        const params = {};
        params[this.schema.id] = id;
        params.isactive = 3;
        const loading = _g.toastMsg('normal', '正在删除中...');
        await this.apiPost(this.delUrl, params);
        loading.close();
        _g.toastMsg('success', '删除成功');
        this.init();
      })
      .catch(() => {
        // catch error
      });
    },
    accountFormat(row) {
      switch (row.accounttype) {
        case 1:
          return '管理员';
        case 2:
          return '运营商';
        case 3:
          return '服务商';
        default:
          break;
      }
      return '';
    },
    ...mapActions(['fetchRoles']),
  },
  components: {
    Add,
    Edit,
    // SetAuth,
  },
};
</script>

<style>
.partnerTree .el-tree-node.is-expanded>.el-tree-node__children {
  overflow: visible;
}
</style>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~assets/stylus/variable'

  .wrapper
    display: flex
    height: 100%
    >.left
      flex: 0 0 180px
      padding-right: 5px
      box-sizing: border-box
      border-right: 1px solid #ccc
      .tree
        border: $border
        box-shadow: $box-shadow
    >.right
      flex: 1 1 auto
      width: 1px
      padding-left: 5px
</style>
