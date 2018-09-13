<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
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
      <el-radio-group v-model="params.typename" size="mini" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button label="ZY-V">ZY-V</el-radio-button>
        <el-radio-button label="ZY-T">ZY-T</el-radio-button>
        <el-radio-button label="ZY-M">ZY-M</el-radio-button>
      </el-radio-group>
      <div class="m-l-10">
        剩余电量:
        <el-input-number size="mini" :step="10" :min="0" :max="100" v-model="params.voltage" @change="getAll"></el-input-number>
        以下
      </div>
      <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      <!-- <el-input size="mini" clearable v-model.trim="params.query" class="w-200" placeholder="请输入IMEI、车牌号、设备名称" @change="getAll"></el-input> -->
      <!-- <el-date-picker
        size="mini"
        type="date"
        v-model="params.stime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开始日期"
        @change="getAll">
      </el-date-picker>
      <el-date-picker
        size="mini"
        type="date"
        v-model="params.etime"
        value-format="yyyy-MM-dd 23:59:59"
        placeholder="选择结束日期"
        @change="getAll">
      </el-date-picker> -->
    </div>
    <el-table
      stripe
      size="small"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column
        width="180"
        property="devicename"
        label="设备名称">
      </el-table-column>
      <el-table-column
        width="160"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="180"
        property="sn"
        label="IMEI">
      </el-table-column>
      <!-- <el-table-column
        property="name"
        label="车主姓名">
      </el-table-column>
      <el-table-column
        property="phone"
        label="车主手机">
      </el-table-column> -->
      <el-table-column
        width="100"
        property="typecode"
        label="设备类型">
      </el-table-column>
      <el-table-column
        width="100"
        label="剩余电量">
        <template slot-scope="{ row: { voltage } }">
          <span><i class="f-w-b fz-20" :class="{ 'c-red': voltage <= 30, 'c-blue': voltage > 30 }">{{voltage}}</i></i> %</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="145px"
        prop="activetime"
        label="激活时间">
      </el-table-column>
      <!-- <el-table-column
        prop="createtime"
        label="入库时间">
      </el-table-column> -->
      <!-- <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small">编辑</el-button>
          <el-button type="primary" size="small">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pos-rel p-t-20 p-b-20 pages-footer">
      <div class="stat">
        <!-- <span class="title">汇总</span>
        <div style="display: inline" v-html="stat">
        </div> -->
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
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  // name: escapeName(''),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      partnerid: [],
      params: {
        voltage: 100,
        typename: null,
        partnerid: null,
        query: null,
        sTime: null,
        eTime: null,
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerid = newValue[newValue.length - 1];
      } else {
        this.params.partnerid = null;
      }
      this.getAll();
    },
  },
  computed: {
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/device/getSurplusElectric';
  },
  methods: {
    init() {
      this.fetchPartners(true);
      this.getAll();
    },
    handleExport() {
      this.$confirm('是否导出记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        location.href = `${HOST}/excel/exportSurplusElectric?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
