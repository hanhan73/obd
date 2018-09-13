<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-input size="mini" v-model="params.typecode" class="w-200" placeholder="请输入类型编码"></el-input>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
        <el-button size="mini" icon="el-icon-plus" @click="$refs.add.open()">新增</el-button>
      </div>
    </div>
    <el-table
      stripe
      size="mini"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        property="typecode"
        label="类型编码(唯一编码)">
      </el-table-column>
      <el-table-column
        property="name"
        label="名称">
      </el-table-column>
      <el-table-column
        property="deviceModel"
        label="厂商名称">
      </el-table-column>
      <el-table-column
        property="desctype"
        label="描述">
      </el-table-column>
      <el-table-column
        property="devicetype"
        :formatter="row => row.devicetype === '0' ? 'GPS' : 'OBD'"
        label="设备类型">
      </el-table-column>
      <el-table-column
        property="connectedtype"
        :formatter="row => row.connectedtype === '0' ? '有源' : '无源'"
        label="接线类型">
      </el-table-column>
      <el-table-column
        property="username"
        label="操作人">
      </el-table-column>
      <el-table-column
        width="135px"
        property="createtime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        width="220"
        label="操作">
        <template slot-scope="{ row: { id } }">
          <el-button-group>
            <el-button type="primary" size="mini" @click="$refs.edit.open(id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="confirmDelete(id)">删除</el-button>
            <!-- <el-button type="normal" size="mini" @click="$refs.allowAuth.open(id)">分配权限</el-button> -->
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
          :current-page="pagination.pageNumber"
          :total="pagination.dataCount">
        </el-pagination>
      </div>
    </div>
    <add ref="add" @init="getAll"></add>
    <edit ref="edit" @init="getAll"></edit>
    <allow-auth ref="allowAuth"></allow-auth>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import Add from './add';
import Edit from './edit';
import AllowAuth from './allow-auth';

export default {
  name: escapeName('设备类型列表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      params: {
        typecode: null,
      },
      schema: {
        id: 'ids',
      },
    };
  },
  computed: {
  },
  beforeCreate() {
    this.zh_name = '设备类型';
    this.name = '/device/findAllDeviceType';
    this.delUrl = '/devicetype/delDevicetype';
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
