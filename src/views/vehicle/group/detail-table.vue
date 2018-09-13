<template>
  <el-dialog
      ref="dialog"
      title="车辆详情"
      width="80%"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <el-table :data="tableData" v-loading="isLoading">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          label="车架号"
          prop="vinNumber">
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="carNumber">
        </el-table-column>
        <el-table-column
          label="车品牌"
          prop="brand">
        </el-table-column>
        <el-table-column
          label="车类型"
          prop="carType">
        </el-table-column>
        <el-table-column
          label="发动机号"
          prop="engNumber">
        </el-table-column>
        <el-table-column
          label="底盘号"
          prop="chaNumber">
        </el-table-column>
        <el-table-column
          label="合作商"
          prop="partnerName">
        </el-table-column>
        <el-table-column
          label="分组"
          prop="groupName">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createtime">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="confirmDelete(scope.row.id)">删除</el-button>
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
    fetchVehicles() {
      return new Promise(async (resolve) => {
        const { data } = await this.apiPost('/vehicle/getVehicles', { groupId: this.groupId, pageSize: 10000 });
        this.tableData = data;
        resolve();
      });
    },
    async open(groupId) {
      this.groupId = groupId;
      this.dialogVisible = true;
      this.isLoading = true;
      await this.fetchVehicles();
      this.isLoading = false;
    },
    confirmDelete(id) {
      this.$confirm('确认从该分组删除此车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: false,
        customClass: 'bor-gra',
      })
      .then(async () => {
        const params = {};
        params.id = id;
        params.groupId = this.groupId;
        const loading = _g.toastMsg('normal', '正在删除中...');
        await this.apiPost('/vehicle/delGroupDevice', params);
        loading.close();
        _g.toastMsg('success', '删除成功');
        this.fetchVehicles();
      })
      .catch(() => {
        // catch error
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
