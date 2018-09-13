<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-input v-model="params.username" class="w-200" placeholder="请输入用户名称"></el-input>
      <el-input v-model="params.useraccount" class="w-200" placeholder="请输入用户账号"></el-input>
      <el-input v-model="params.mobileno" class="w-200" placeholder="请输入手机号码"></el-input>
      <div class="btn-wrapper">
        <el-button type="primary" icon="search" @click="getAll">搜索</el-button>
        <!-- <el-button type="normal" icon="plus" @click="$refs.add.open()">新增</el-button> -->
      </div>
    </div>
    <el-table
      stripe
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        property="partnername"
        label="商户号">
      </el-table-column>
      <el-table-column
        :formatter="formatCounttype"
        label="账号类型">
      </el-table-column>
      <el-table-column
        property="username"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        property="useraccount"
        label="用户账号">
      </el-table-column>
      <el-table-column
        width="130"
        property="mobile"
        label="手机号码">
      </el-table-column>
      <el-table-column
        min-width="155"
        property="email"
        label="用户邮箱">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="{ row: { isactive } }">
          <el-tag type="success" v-if="isactive === 1">已激活</el-tag>
          <el-tag type="normal" v-else>已注销</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        property="createtime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="$refs.edit.open(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.isactive === 2" type="success" size="small" @click="cancelOrActivateUser(scope.row.isactive, scope.row.id)">激活</el-button>
          <el-button v-else type="warning" size="small" @click="cancelOrActivateUser(scope.row.isactive, scope.row.id)">注销</el-button>
          <el-button type="danger" size="small" @click="confirmDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages m-t-15">
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import Add from './add';
import Edit from './edit';

export default {
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      params: {
        username: null,
        useraccount: null,
        mobileno: null,
      },
    };
  },
  computed: {
  },
  beforeCreate() {
    this.zh_name = '用户';
    this.name = '/backuser/qryUserInfoList';
    this.delUrl = '/backuser/deleteSecur';
  },
  methods: {
    init() {
      this.getAll();
    },
    cancelOrActivateUser(active, id) {
      const status = active === 2 ? '激活' : '注销';
      this.$confirm(`确认${status}该${this.zh_name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      }).then(async () => {
        let isactive;
        if (active === 1) {
          isactive = 2;
        } else {
          isactive = 1;
        }
        await this.apiPost('/backuser/upSecurUser', { isactive, id });
        _g.toastMsg('success', `${status}成功`);
        this.getAll();
      }).catch(() => {});
    },
    formatCounttype({ accounttype }) {
      switch (accounttype) {
        case '1':
          return '超级管理员';
        case '2':
          return '管理员';
        case '3':
          return '账号名称';
        case '4':
          return '普通用户';
        default:
          return '';
      }
    },
  },
  components: {
    Add,
    Edit,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
