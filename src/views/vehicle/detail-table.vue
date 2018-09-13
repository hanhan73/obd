<template>
  <el-dialog
      ref="dialog"
      title="绑定设备详情"
      size="large"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <el-table :data="tableData" v-loading="isLoading">
        <el-table-column
          label="IMEI"
          prop="imei">
        </el-table-column>
        <el-table-column
          label="设备类型"
          prop="typecode">
        </el-table-column>
        <el-table-column
          label="电话号码"
          prop="simphone">
        </el-table-column>
        <el-table-column
          label="ICCID"
          prop="iccid">
        </el-table-column>
        <el-table-column
          label="安装位置"
          prop="position">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
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
    async open(vehicleid) {
      this.dialogVisible = true;
      this.isLoading = true;
      const { data } = await this.apiPost('/userDevice/getVehicleDevice', { vehicleid });
      this.tableData = data;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
