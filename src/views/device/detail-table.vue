<template>
  <el-dialog
      ref="dialog"
      title="绑定车辆详情"
      custom-class="w-800"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <el-form v-for="(i, index) in tableData" :key="index" label-width="120px" v-loading="isLoading" class="column-2">
        <el-form-item label="车牌号:">
          {{i.carNumber}}
        </el-form-item>
        <el-form-item label="车架号:">
          {{i.vinNumber}}
        </el-form-item>
        <el-form-item label="车品牌:">
          {{i.brand}}
        </el-form-item>
        <el-form-item label="车型号:">
          {{i.carType}}
        </el-form-item>
        <el-form-item label="发动机号:">
          {{i.engNumber}}
        </el-form-item>
        <el-form-item label="底盘号:">
          {{i.chaNumber}}
        </el-form-item>
        <el-form-item label="车主姓名:">
          {{i.userName}}
        </el-form-item>
        <el-form-item label="车主手机:">
          {{i.userPhone}}
        </el-form-item>
        <el-form-item label="合作商:">
          {{i.partnerName}}
        </el-form-item>
        <el-form-item label="分组:">
          {{i.groupName}}
        </el-form-item>
        <el-form-item label="绑定时间:">
          {{i.createtime}}
        </el-form-item>
      </el-form>
      <!-- <el-table :data="tableData" v-loading="isLoading">
        <el-table-column
          label="车牌号"
          prop="carNumber">
        </el-table-column>
        <el-table-column
          label="车架号"
          prop="vinNumber">
        </el-table-column>
        <el-table-column
          label="车品牌"
          prop="brand">
        </el-table-column>
        <el-table-column
          label="车型号"
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
          label="车主姓名"
          prop="userName">
        </el-table-column>
        <el-table-column
          label="车主手机"
          prop="userPhone">
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
          label="绑定时间"
          prop="createtime">
        </el-table-column>
      </el-table> -->
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
      const { data } = await this.apiPost('/vehicle/getVehicles', { id: vehicleid });
      this.tableData = data;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
