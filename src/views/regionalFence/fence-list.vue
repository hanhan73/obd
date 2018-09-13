<template>
  <div class="fence-list-wrapper">
    <div class="search-bar m-t-5 m-b-5 m-l-5 m-r-5">
      <el-input size="mini" v-model="params.desc" placeholder="请输入围栏名称" class="w-150"></el-input>
      <el-button size="mini" type="primary" @click="getAll">查询</el-button>
      <el-button class="m-l-0" size="mini" type="normal" @click="$emit('handleAddFence')">新建圆形围栏</el-button>
      <el-button class="m-l-0" size="mini" type="danger" @click="batchDelete">删除</el-button>
    </div>
    <el-table
      class="table"
      :data="tableData"
      stripe
      ref="table"
      height="auto"
      size="mini"
      style="width: 100%"
      row-key="id"
      v-loading="tableLoading"
      @selection-change="(selection) => this.selection = selection"
      @row-click="(row) => this.$emit('handleFenceRowClick', row)">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="围栏名称">
      </el-table-column>
      <el-table-column
        :formatter="({ fenceType }) => fenceType === 0 ? '圆形' : '行政区'"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="partnername"
        label="创建用户">
      </el-table-column>
      <el-table-column
        :formatter="({ createtime }) => createtime.substr(0, 10)"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="50px"
        label="关联">
        <template slot-scope="{ row: { desc, fenceId, relationDevNum } }">
          <el-button size="mini" :disabled="relationDevNum === '0'" type="text" @click.stop="$emit('searchRelationDev', fenceId, desc)">{{relationDevNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="{ row: { fenceId, desc } }">
          <el-button size="mini" type="text" icon="el-icon-delete" @click.stop="deleteFence(fenceId)"></el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click.stop="$emit('handleBindDevice', fenceId, desc)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="tx-c pagination"
      small
      layout="prev, pager, next"
      :total="pagination.dataCount"
      :page-size="pagination.pageSize"
      :current-page.sync="pagination.curPage"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      selection: [],
      params: {
        desc: '',
        fenceType: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/queryFence';
  },
  methods: {
    init() {
      this.getAll();
    },
    async deleteFence(fenceId) {
      this.$confirm('确定删除该围栏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await this.apiPost('/fence/deleteFence', { fenceId });
          _g.toastMsg('success', '删除围栏成功!');
          this.getAll();
        } catch (e) {
          //
        }
      });
    },
    batchDelete() {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请先勾选需要删除的围栏');
        return;
      }
      this.$confirm('确定删除这些围栏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await this.apiPost('/fence/deleteFences', { fenceIds: this.selection.map(i => i.fenceId) });
          _g.toastMsg('success', '批量删除围栏成功');
          this.getAll();
        } catch (e) {
          //
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
  .fence-list-wrapper
    height: 100%
    display: flex
    flex-direction: column
    .search-bar,
    .pagination
      flex: 0 0 auto
    .table
      flex: 1 1 auto
</style>
