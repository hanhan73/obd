<template>
  <el-dialog
      ref="dialog"
      title="绑定围栏详情"
      custom-class="w-800"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="dialogVisible">
      <el-table :data="tableData" v-loading="isLoading">
        <el-table-column
          label="围栏名称"
          prop="desc">
        </el-table-column>
        <el-table-column
          label="类型"
          :formatter="({ fenceType }) => fenceType === 0 ? '圆形' : '行政区'">
        </el-table-column>
        <el-table-column
          label="规则"
          :formatter="({ mindType }) => showMindType(mindType)">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="{ row: { fenceId } }">
            <el-button type="danger" size="mini" @click="handleDeleteFence(fenceId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      isLoading: false,
    };
  },
  computed: {},
  methods: {
    showMindType(mindType) {
      if (mindType === 0) {
        return '进出围栏';
      } else if (mindType === 1) {
        return '进围栏';
      } else if (mindType === 2) {
        return '出围栏';
      }
      return '';
    },
    async open(sn) {
      this.dialogVisible = true;
      this.sn = sn;
      this.fetchData();
    },
    async fetchData() {
      this.isLoading = true;
      const { data } = await this.apiPost('/fence/searchFence', { sn: this.sn, fenceid: '' });
      this.tableData = data;
      this.isLoading = false;
    },
    async handleDeleteFence(fenceId) {
      this.$confirm('确定要取消该围栏的关联绑定吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await this.apiPost('/fence/delRelation', { fenceId, sns: this.sn });
          _g.toastMsg('success', '移除成功');
          this.fetchData();
        } catch (e) {
          //
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .device-wrapper
    display: flex
    overflow-x: auto
    >div
      flex: 0 0 315px
      margin-left: 5px
      &:first-child
        margin-left: 0px
</style>
