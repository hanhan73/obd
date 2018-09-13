<template>
  <el-dialog
      ref="dialog"
      title="选择设备"
      top="30px"
      width="80%"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <el-cascader
      size="mini"
      style="margin: 2px 5px 0 0"
      placeholder="请选择账号名称"
      v-model="partnerid"
      :options="partnersTree"
      :props="{label: 'partnername', value: 'id', children: '_children'}"
      filterable
      clearable
      change-on-select
    ></el-cascader>
    <el-input size="mini" clearable class="w-200" v-model.trim="params.imei" placeholder="请输入IMEI" @change="getAll"></el-input>
    <!-- <el-button size="mini" type="primary" @click="getAll">查询</el-button> -->
    <el-table class="m-t-10"
              size="mini"
              :height="400"
              :data="tableData"
              v-loading="tableLoading"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="账号名称" prop="partnername"></el-table-column>
      <el-table-column label="设备类型" prop="typename"></el-table-column>
      <el-table-column label="设备名称" prop="devicename"></el-table-column>
      <el-table-column label="IMEI" prop="imei"></el-table-column>
      <el-table-column label="电话号码" prop="simphone"></el-table-column>
      <el-table-column width="180px" label="ICCID" prop="iccid"></el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 pages-footer">
      <div class="stat">
        <!-- <span class="title">汇总</span>
        <div style="display: inline" v-html="stat">
        </div> -->
      </div>
      <div class="block pages m-t-15">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[15, 30, 60, 100]"
          :page-size="params.pageSize"
          :current-page="params.curPage"
          :total="params.dataCount">
        </el-pagination>
      </div>
    </div>
    <div class="tx-c m-t-20">
      <el-button class="w-100" type="primary" @click="confirm" :disabled="check">确定</el-button>
      <el-button class="w-100" @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http],
  data() {
    return {
      partnerid: [],
      dialogVisible: false,
      tableLoading: false,
      tableData: [],
      multipleSelection: [],
      params: {
        partnerid: null,
        imei: null,
        status: 1,
        curPage: 1,
        pageSize: 15,
        dataCount: 0,
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerid = newValue[newValue.length - 1];
      } else {
        this.params.partnerid = null;
        this.params.groupId = null;
      }
      this.getAll();
    },
  },
  computed: {
    check() {
      return this.multipleSelection.length === 0;
    },
    ...mapGetters(['partnersTree']),
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    confirm() {
      this.$emit('saveDevices', this.multipleSelection);
      this.dialogVisible = false;
    },
    async open() {
      this.dialogVisible = true;
      this.fetchPartners(true);
      this.getAll();
    },
    async getAll() {
      this.tableLoading = true;
      const { data, page: { counts } } = await this.apiPost('/device/getDeviceList', this.params);
      this.tableData = data;
      this.params.dataCount = counts;
      this.tableLoading = false;
    },
    handleSizeChange(size) {
      this.params.pageSize = size;
      this.getAll();
    },
    handleCurrentChange(page) {
      this.params.curPage = page;
      this.getAll();
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
