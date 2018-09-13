<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <div class="btn-wrapper inline">
        <el-button size="mini" icon="el-icon-upload2" @click="$refs.import.open()">导入设备</el-button>
        <!-- <el-button size="mini" icon="el-icon-plus" @click="$refs.add.open()">添加设备</el-button> -->
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
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
        property="filename"
        label="文件名称">
      </el-table-column>
      <el-table-column
        property="backUserName"
        label="账号名称">
      </el-table-column>
      <el-table-column
        property="importtime"
        label="导入时间">
      </el-table-column>
      <el-table-column
        property="importnum"
        label="导入设备数量">
      </el-table-column>
      <el-table-column
        property="typecode"
        label="导入设备类型">
      </el-table-column>
      <!-- <el-table-column
        width="140px"
        label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="primary" size="mini">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column> -->
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
          :page-size="pagination.limit"
          :current-page="pagination.page"
          :total="pagination.dataCount">
        </el-pagination>
      </div>
    </div>
    <add ref="add" @init="getAll"></add>
    <import ref="import" @init="getAll"></import>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import Add from '../device/add';
import Import from '../device/import';

export default {
  name: escapeName('批量分配设备'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      params: {
      },
    };
  },
  computed: {
  },
  beforeCreate() {
    this.name = '/device/getImportHis';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    Add,
    Import,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
