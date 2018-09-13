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
      <el-input size="mini" clearable v-model.trim="params.query" class="w-200" placeholder="请输入IMEI、车牌号、设备名称" @change="getAll"></el-input>
      <el-select v-model="queryStoptime"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择停留时段">
        <el-option label="最近6小时" :value="21600"></el-option>
        <el-option label="最近24小时" :value="86400"></el-option>
        <el-option label="最近3天" :value="259200"></el-option>
        <el-option label="3天以上" :value="999999"></el-option>
      </el-select>
      <el-select v-model="querytime"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择停留时长">
        <el-option label="3小时内" :value="10800"></el-option>
        <el-option label="6小时内" :value="21600"></el-option>
        <el-option label="1-3天" :value="259200"></el-option>
        <el-option label="3天以上" :value="999999"></el-option>
      </el-select>
      <el-button size="mini" type="normal" icon="el-icon-download" @click="handleExport">导出</el-button>
      <!-- <span>停留时段:</span>
      <el-radio-group v-model="queryStoptime" size="mini" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button :label="1800000">最近6小时</el-radio-button>
        <el-radio-button :label="3600000">最近24小时</el-radio-button>
        <el-radio-button :label="86400000">最近3天</el-radio-button>
        <el-radio-button :label="259200000">3天以上</el-radio-button>
      </el-radio-group>
      <span>停留时长:</span>
      <el-radio-group v-model="querytime" size="mini" @change="getAll">
        <el-radio-button :label="null">全部</el-radio-button>
        <el-radio-button :label="1800000">3小时内</el-radio-button>
        <el-radio-button :label="3600000">6小时内</el-radio-button>
        <el-radio-button :label="86400000">24小时内</el-radio-button>
        <el-radio-button :label="259200000">1-3天</el-radio-button>
        <el-radio-button :label="259200000">3天以上</el-radio-button>
      </el-radio-group> -->
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
        width="150"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        width="140"
        property="sn"
        label="IMEI">
      </el-table-column>
      <el-table-column
        width="110"
        property="carnumber"
        label="车牌号">
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
        width="135"
        property="starttime"
        label="开始时间">
      </el-table-column>
      <el-table-column
        width="135"
        property="endtime"
        label="结束时间">
      </el-table-column>
      <el-table-column
        width="130"
        :formatter="({ stoptime }) => $secondsFormat(stoptime/1000)"
        label="停留时长">
      </el-table-column>
      <el-table-column
        min-width="150"
        property="adress"
        label="停留地址">
      </el-table-column>
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
  name: escapeName('停车明细表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      queryStoptime: null,
      querytime: null,
      partnerid: [],
      params: {
        partnerid: null,
        query: null,
        queryType: 7,
        sTime: null,
        eTime: null,
        querytimeMin: null,
        querytimeMax: null,
        queryStoptimeMax: null,
        queryStoptimeMin: null,
      },
    };
  },
  watch: {
    queryStoptime(val) {
      if (val !== '') {
        if (val <= 259200) {
          this.params.queryStoptimeMin = 0;
          this.params.queryStoptimeMax = val;
        } else {
          this.params.queryStoptimeMin = 259200;
          this.params.queryStoptimeMax = null;
        }
      } else {
        this.params.queryStoptimeMin = null;
        this.params.queryStoptimeMax = null;
      }
      this.getAll();
    },
    querytime(val) {
      if (val !== '') {
        let min = null;
        let max = null;
        if (val <= 259200) {
          min = 0;
          max = val;
        } else {
          min = 259200;
        }
        if (val === 259200) {
          min = 86400;
          max = val;
        }
        this.params.querytimeMin = min * 1000;
        this.params.querytimeMax = max === null ? max : max * 1000;
      } else {
        this.params.querytimeMin = null;
        this.params.querytimeMax = null;
      }
      this.getAll();
    },
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
    this.name = '/vehicle/queryStopList';
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
        location.href = `${HOST}/excel/exportStopOvertime?${this.transformRequest(
          this.params,
        )}`;
      })
      .catch(() => {});
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
  components: {
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
