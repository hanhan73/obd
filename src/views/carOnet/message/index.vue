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
        width="180">
      </el-table-column>
      <el-table-column
        prop="series"
        label="模板系列"
        :formatter="forseries"
        width="180">
      </el-table-column>
      <el-table-column
        prop="content"
        label="模板内容"
        width="400">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="220">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="160">
      </el-table-column>
      <el-table-column
      min-width="100px"
      label="操作">
          <template slot-scope="scope">
              <el-button-group>
                  <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row)">查看编辑</el-button>
                  <el-button type="danger" size="mini" @click="confirmDelete(row.id)">删除</el-button>
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
    <add ref="add"  @init="getAll"></add>
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
    this.name = '/messTemplate/findAll';
  },
  methods: {
    init() {
      this.getAll();
    },
    forseries(r) {
      switch (r.series) {
        case 'RESCUE_TEMPLATE':
          return '救援模板';
        case 'MAINTENANCE_TEMPLATE':
          return '保养模板';
        case 'INSURANCE_TEMPLATE':
          return '保险模板';
        default:
          break;
      }
      return '';
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
  },
  components: {
    edit,
    add,
  },
};
</script>

