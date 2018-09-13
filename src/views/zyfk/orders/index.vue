<template>
  <div ref="wrapper">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <!-- <el-input size="mini" @change="fetchData" clearable style="width: 200px;" class="filter-item" placeholder="请输入微信昵称" v-model="listQuery.nickname"> -->
      </el-input>
      <el-date-picker
        class="filter-item"
        value-format="yyyy-MM-dd"
        v-model="listQuery.registerTime"
        type="date"
        size="mini"
        placeholder="选择日期">
      </el-date-picker>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" :loading="listLoading" @click="fetchData">搜索</el-button>
      <div class="right-wrapper">
        <el-switch
          class="filter-item"
          v-model="switchRefresh"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          @change="handleSwitchChange">
        </el-switch>
        <el-tag size="mini" v-show="switchRefresh" class="filter-item" style="margin-left: 10px" type="info">{{countDown}} 秒后刷新</el-tag>
      </div>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row size="mini">
      <el-table-column type="index" align="center" width="50"></el-table-column>
      <el-table-column label="申请人姓名" prop="name" align="center">
      </el-table-column>
      <el-table-column label="身份证号码" width="150px" align="center" prop="idcard">
      </el-table-column>
      <el-table-column label="手机号码" align="center" width="100px">
        <template slot-scope="{ row: { accountId } }">
          <span>{{accountId | accountIdFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="查询类型" align="center">
        <template slot-scope="{ row: { queryType } }">
          <span>{{queryType | queryTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="{ row: { userid } }">
          <span>{{userid === '2' ? '管理员' :hashParters[userid]}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" align="center">
        <template slot-scope="{ row: { orderStatus }, row }">
          <el-tag size="mini" v-if="orderStatus === 0" type="success" class="pointer" @click.native.stop="$refs.report.open(row)">查看报告</el-tag>
          <el-tag size="mini" v-else type="normal">查询中</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="{ row: { registerTime } }">
          <i class="el-icon-time"></i>
          <span>{{registerTime}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作人" align="center" :formatter="({ nickname }) => this.$Base64.decode(nickname)">
      </el-table-column> -->
      <el-table-column label="订单编号" align="center" prop="orderNumber">
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-10 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
        <el-pagination
          @current-change="fetchData"
          @size-change="onPageSizeChange"
          :current-page.sync="listQuery.currentPage"
          :page-size="listQuery.pageSize"
          :page-sizes="[15, 30, 60, 100]"
          layout="total, prev, pager, next, jumper"
          :total="counts">
        </el-pagination>
      </div>
    </div>
    <report ref="report"></report>
  </div>
</template>

<script>
import http from '@/assets/js/http';
// import { mapGetters } from 'vuex';
// import { getList, saveOrder, findAllOrderByConditions } from '@/api/orders';
// import { getInter } from '@/api/orderinter';
// import { isTestEnv } from '@/utils/auth';
import Report from './report';

const refreshSwitchKey = 'order_refresh_switch';

export default {
  name: 'orders',
  mixins: [http],
  components: {
    Report,
  },
  data() {
    return {
      partners: [],
      queryTypeMap: {
        4: { label: '自定义查询', value: 80, tips: '自定义选择查询项, 根据所选项进行扣点', hot: true },
        1: { label: '基本查询', value: 80, tips: '包含基本信息验证和基本反欺诈查询' },
        2: { label: '多维查询', value: 150, tips: '包含基本查询和更多维度反欺诈查询' },
      },
      switchRefresh: true,
      hasSpouse: false,
      countDown: 10,
      saveLoading: false,
      activeName: '1',
      counts: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 15,
        currentPage: 1,
        nickname: null,
        registerTime: null,
      },
      form: {
        item: [],
        queryType: '1',
        name: null,
        accountId: null,
        idcard: null,
        bankid: null,
        version: 1,
        deviceType: 'pc',
        spouseName: null,
        spousePhone: null,
        spouseIdcard: null,
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名' },
        ],
        accountId: [
          { required: true, message: '请输入手机号码' },
          { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入合法手机号码' },
        ],
        idcard: [
          { required: true, message: '请输入身份证号码' },
        ],
        item: [
          { required: true, message: '请选择查询项' },
        ],
      },
    };
  },
  computed: {
    hashParters() {
      const tmp = {};
      this.partners.forEach((i) => {
        tmp[i.userid] = i.partnername;
      });
      return tmp;
    },
  },
  filters: {
    queryTypeFilter(queryType) {
      const queryTypeMap = {
        1: '基本查询',
        2: '多维查询',
        3: '个人认证',
        4: '自定义查询',
        5: '证件查询',
      };
      return queryTypeMap[queryType];
    },
    accountIdFilter(accountId) {
      if ([11111111111, 0].indexOf(accountId) !== -1) {
        return '无';
      }
      return accountId;
    },
  },
  mounted() {
    // this.listQuery.personnelId = Lockr.get('securId');
    this.fetchData();
    this.apiPost('/partner/qryPartnerTree', { pageSize: 10000 }).then((response) => {
      this.partners = response.data;
    });
  },
  methods: {
    fetchData() {
      this.resetTimer();
      if (this.$refs.wrapper.parentNode.style.display === 'none') {
        this.setTimer();
        return;
      }
      this.listLoading = true;
      this.getList(this.listQuery).then((response) => {
        const { list, page } = response.obj;
        this.list = list;
        this.counts = page.counts;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      }).finally(() => {
        this.setTimer();
      });
    },
    getList(params) {
      // if (BUILD_MODE === 'test') {
      //   params.personnelId = null;
      return this.fkApiPost('/appOrder/findAllOrderByConditions2', params);
      // }
      // return this.fkApiPost('/appOrder/findAllOrder', params);
    },
    setTimer() {
      if (this._timer === null || !this.switchRefresh) return;
      this.clearTimer();
      this._timer = window.setTimeout(() => {
        this.countDown -= 1;
        if (this.countDown === 0) {
          this.fetchData();
        } else {
          this.setTimer();
        }
      }, 1000);
    },
    resetTimer() {
      this.countDown = 10;
      this.clearTimer();
    },
    clearTimer() {
      window.clearTimeout(this._timer);
    },
    handleSwitchChange(val) {
      this.$Lockr.set(refreshSwitchKey, val);
      if (!val) {
        this.resetTimer();
      } else {
        this.setTimer();
      }
    },
    onPageSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.fetchData();
    },
  },
  activated() {
    this._timer = 1;
    this.setTimer();
  },
  deactivated() {
    this.resetTimer();
    this._timer = null;
  },
  beforeDestroy() {
    this.resetTimer();
    this._timer = null;
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
// .app-container
//   position absolute
//   display flex
//   height 100%
//   flex-direction column
//   >.container
//     flex 1 1 auto
//     overflow-y auto
//   >.banner-wrapper
//     flex 0 0 auto
//     padding-top 20px
//     text-align center
//     border-top 1px solid #DCDFE6
</style>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .right-wrapper
    flex 1 1 auto
    text-align right
    line-height 25px
  .el-checkbox
    width 100%
    overflow hidden
    margin 0px 0px 0px 0px
    line-height 16px
    &first-child
      margin-top 10px

  .item-label
    color #909399
    font-size 12px
    margin 0
</style>

