<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input
        size="mini"
        class="w-200"
        placeholder="请输入模板名称搜索"
        v-model="params.name"
        clearable>
        </el-input>
        <div class="btn-wrapper inline">
            <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
            <el-button size="mini" type="primary" icon="add"  @click="$refs.add.open()">新增模板</el-button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" size="mini" stripe>
      <el-table-column
        type="index"
        width="35px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="模板名称"
        width="200">
      </el-table-column>
      <el-table-column
        label="模板内容"
        width="500">
        <template slot-scope="scope">
          <h4 v-for="(item, index) in scope.row.typeOfInsurance" :key="index">{{index+1}}:{{item.name}}</h4>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="价格"
        width="160">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="180">
      </el-table-column>
      <el-table-column
      min-width="100px"
      label="操作">
          <template slot-scope="scope">
              <el-button-group>
                  <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row)">编辑</el-button>
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
            :current-page="pagination.curPage"
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
import edit from './edit';
import add from './add';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        name: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/insurance/findPackageList';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    edit,
    add,
  },
};
</script>

