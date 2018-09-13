<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input
        size="mini"
        class="w-200"
        placeholder="请输入关键词搜索"
        v-model="input10"
        clearable>
        </el-input>
        <div class="btn-wrapper inline">
            <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
            <el-button size="mini" type="normal" icon="el-icon-plus" @click="$refs.add.open()">新增</el-button>
        </div>
    </div>
    <el-table :data="tableData" 
      style="width: 100%"
      size="mini" 
      v-loading="tableLoading"
      highlight-current-row
      @selection-change="val => selection = val"
      stripe>
      <el-table-column
      type="index"
      width="50">
      </el-table-column>
      <el-table-column
      prop="name"
      label="救援人员姓名"
      width="120">
      </el-table-column>
      <el-table-column
      prop="phone"
      width="120"
      label="手机号">
      </el-table-column>
      <el-table-column
      prop="idcard"
      width="120"
      label="身份证">
      </el-table-column>
      <el-table-column
      prop="address"
      width="180"
      label="联系地址">
      </el-table-column>
      <el-table-column
      prop="createtime"
      width="180"
      label="创建时间">
      </el-table-column>
      <el-table-column
      prop="score"
      width="120"
      label="评分">
      </el-table-column>
      <el-table-column
      min-width="120px"
      label="操作">
      <template slot-scope="scope">
      <el-button-group>
        <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" @click="confirmDelete(scope.row.id)">删除</el-button>
      </el-button-group>
      </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-10 pages-footer">
      <div class="stat">
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
    <edit ref="edit" @init="getAll"></edit>
    <add ref="add" @init="getAll"></add>
  </div>
</template>
<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Edit from './edit';
import Add from './add';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      input10: null,
    };
  },
  components: {
    Edit,
    Add,
  },
  beforeCreate() {
    this.name = '/aid/findAllRescueUser';
    this.zh_name = '救援人员';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
};
</script>


<style lang="stylus" scoped>
h2 {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-left: 4px solid #409EFF;
    background: #fff;
    // &.bottom
}
</style>
