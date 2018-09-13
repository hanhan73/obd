<template>
  <el-dialog
      ref="dialog"
      title="选择车辆"
      width="80%"
      top="30px"
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
    <el-input size="mini" clearable class="w-200" v-model.trim="params.carnumber" placeholder="请输入车牌号" @change="getAll()"></el-input>
    <el-radio-group size="mini" v-model="params.isBind" @change="getAll">
      <el-radio-button :label="null">全部</el-radio-button>
      <el-radio-button :label="0">已绑定</el-radio-button>
      <el-radio-button :label="1">未绑定</el-radio-button>
    </el-radio-group>
    <!-- <el-button size="mini" type="primary" @click="getAll">查询</el-button> -->
    <el-table class="m-t-10"
              size="mini"
              :height="400"
              :data="tableData"
              v-loading="tableLoading"
              highlight-current-row
              @current-change="handleCurrentRowChange">
      <el-table-column label="账号名称" prop="partnername"></el-table-column>
      <el-table-column label="车牌号" prop="carnumber"></el-table-column>
      <el-table-column label="车架号" prop="vinnumber"></el-table-column>
      <el-table-column label="车品牌" prop="brand"></el-table-column>
      <el-table-column label="发动机号" prop="engnumber"></el-table-column>
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
      currentRow: null,
      params: {
        partnerid: null,
        isBind: null,
        carnumber: null,
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
      return this.currentRow === null;
    },
    ...mapGetters(['partnersTree']),
  },
  methods: {
    handleCurrentRowChange(val) {
      this.currentRow = val;
    },
    async confirm() {
      const { data: [{ devicelist }] } = await this.apiPost('/userDevice/getBindUserDevice', { vehicleid: this.currentRow.id });
      if (devicelist instanceof Array) {
        this.$emit('saveDevices', devicelist);
      }
      this.$emit('saveVehicle', this.currentRow);
      this.dialogVisible = false;
    },
    async open() {
      this.dialogVisible = true;
      this.fetchPartners(true);
      this.getAll();
    },
    async getAll() {
      this.tableLoading = true;
      const { data, page: { counts } } = await this.apiPost('/userDevice/getVehicles', this.params);
      this.params.dataCount = counts;
      this.tableData = data;
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
