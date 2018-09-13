<template>
  <el-dialog
      ref="dialog"
      title="高危车辆详情"
      size="large"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <el-table :data="tableData" v-loading="isLoading">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          label="IMEI"
          prop="imei">
        </el-table-column>
        <el-table-column
          label="车位置"
          prop="position">
        </el-table-column>
        <el-table-column
          :formatter="({ source }) => source === 1 ? '设备上传' : '服务器计算'"
          label="告警源">
        </el-table-column>
        <el-table-column
          label="告警内容"
          prop="description">
        </el-table-column>
        <el-table-column
          :formatter="({ source, alerttime, createtime }) => source === 1 ? alerttime : createtime "
          label="(告警/记录)时间">
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
    async open(batchnum) {
      this.dialogVisible = true;
      this.isLoading = true;
      const { data } = await this.apiPost('/vehicleDanger/queryDetail', { batchnum });
      this.tableData = data;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
