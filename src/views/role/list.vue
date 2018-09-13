<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-input size="mini" v-model="params.roleName" class="w-200" placeholder="请输入角色名称"></el-input>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
        <el-button size="mini" type="normal" icon="el-icon-plus" @click="$refs.add.open()">新增</el-button>
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
        property="rolename"
        label="角色名称">
      </el-table-column>
      <el-table-column
        property="roledesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        property="createtime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="220"
        label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row.id, scope.row.rolename, scope.row.roledesc)">编辑</el-button>
            <el-button type="danger" size="mini" @click="confirmDelete(scope.row.id)">删除</el-button>
            <el-button type="normal" size="mini" @click="$refs.allowAuth.open(scope.row.id)">分配权限</el-button>
          </el-button-group>
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
    <add ref="add" @init="getAll"></add>
    <edit ref="edit" @init="getAll"></edit>
    <allow-auth ref="allowAuth" @init="getAll"></allow-auth>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import Add from './add';
import Edit from './edit';
import AllowAuth from './allow-auth';

export default {
  name: escapeName('角色列表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      params: {
        roleName: null,
      },
      schema: {
        id: 'ids',
      },
    };
  },
  computed: {
  },
  beforeCreate() {
    this.zh_name = '角色';
    this.name = '/roleMenu/queryList';
    this.delUrl = '/role/del';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    Add,
    Edit,
    AllowAuth,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
