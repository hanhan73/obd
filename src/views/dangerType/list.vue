<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <!-- <el-select v-model="params.alerttype"
                 size="mini"
                 clearable
                 class="w-200"
                 placeholder="请选择告警类型">
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.typename"
          :value="item.id">
        </el-option>
      </el-select> -->
      <div class="btn-wrapper inline">
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
        <el-button size="mini" type="normal" icon="el-icon-plus" @click="$refs.add.open()">新增</el-button>
      </div>
      <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group> -->
    </div>
    <el-table
      stripe
      size="mini"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row
      @selection-change="val => selection = val">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        property="typename"
        label="告警类型">
      </el-table-column>
      <el-table-column
        property="oepratorname"
        label="添加人">
      </el-table-column>
      <el-table-column
        property="createtime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="confirmDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 p-b-20 pages-footer">
      <div class="stat">
        <el-alert
          title="设置该列表可自定义接收及提示相对应的警情信息，如若需要，可自行添加删除。"
          type="info"
          show-icon>
        </el-alert>
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters } from 'vuex';

import Add from './add';

export default {
  name: escapeName('警情类型设置'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      selection: [],
      params: {
        alerttype: null,
        operatorid: null,
      },
      schema: {
        id: 'ids',
      },
    };
  },
  computed: {
    ...mapGetters(['types', 'curSecurId']),
  },
  beforeCreate() {
    this.zh_name = '告警类型';
    this.name = '/vehicleDanger/queryTypes';
    this.delUrl = '/vehicleDanger/delTypes';
  },
  methods: {
    init() {
      this.params.operatorid = this.curSecurId;
      this.getAll();
    },
    handleBatchDelete() {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请勾选需要删除的警情类型');
        return;
      }
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        await this.apiPost(this.delUrl, { ids: this.selection.map(i => i.id).join(',') });
        this.$message('批量删除成功');
        this.getAll();
      })
      .catch(() => {
      });
    },
  },
  components: {
    Add,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
