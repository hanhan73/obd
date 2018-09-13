<template>
  <div>
    <div class="account-desc">
      您好 {{name}} , 您的账户剩余点数为: <i class="f-w-b fz-18 c-blue">{{point}}</i> 。
    </div>
    <h2>充值详情</h2>
    <el-table :data="rechargeData" height="350px" size="mini" stripe>
      <el-table-column label="充值金额" :formatter="({ totalFree }) => `${totalFree/100} 元`"></el-table-column>
      <el-table-column label="详情" prop="body"></el-table-column>
      <el-table-column label="充值状态" :formatter="({ status }) => status === '0' ? '成功' : '失败'"></el-table-column>
      <el-table-column label="充值时间" prop="startTime"></el-table-column>
      <el-table-column label="所属用户">
        <template slot-scope="{ row: { userid } }">
          {{hashParters[userid] || partnername}}
        </template>
      </el-table-column>
    </el-table>
      <div class="pos-rel p-t-10 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
        <el-pagination
          @current-change="getRechargeInfo"
          :current-page.sync="listQuery.currentPage"
          :page-size="listQuery.pageSize"
          :page-sizes="[15, 30, 60, 100]"
          layout="total, prev, pager, next, jumper"
          :total="counts2">
        </el-pagination>
      </div>
    </div>
    <h2 class="bottom">消费详情</h2>
    <el-table :data="list" height="350px" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row size="mini">
      <el-table-column type="index" align="center" width="50"></el-table-column>
      <!-- <el-table-column label="登录方式" align="center" prop="loginType"></el-table-column> -->
      <el-table-column label="明细类别" align="center" prop="name"></el-table-column>
      <el-table-column label="点数" align="center" prop="point"></el-table-column>
      <el-table-column align="center" prop="createtime" label="时间" width="200">
        <template slot-scope="{ row: { time } }">
          <i class="el-icon-time"></i>
          <span>{{time | timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="相关订单号" align="center" prop="orderNumber"></el-table-column>
      <el-table-column label="所属用户">
        <template slot-scope="{ row: { userid } }">
          {{hashParters[userid] || partnername}}
        </template>
      </el-table-column>
    </el-table>
      <div class="pos-rel p-t-10 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
        <el-pagination
          @current-change="fetchData"
          :current-page.sync="listQuery2.currentPage"
          :page-size="listQuery2.pageSize"
          :page-sizes="[15, 30, 60, 100]"
          layout="total, prev, pager, next, jumper"
          :total="counts">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      partners: [],
      counts: 0,
      counts2: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
      listQuery2: {
        pageSize: 10,
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
      rechargeData: [],
    };
  },
  computed: {
    partnername() {
      return Lockr.get('partnername') || '管理员';
    },
    hashParters() {
      const tmp = {};
      this.partners.forEach((i) => {
        tmp[i.userid] = i.partnername;
      });
      return tmp;
    },
    name() {
      return Lockr.get('seusername');
    },
    ...mapGetters(['point']),
  },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  mounted() {
    this.getRechargeInfo();
    this.fetchData();
    this.fetchPoint();
    this.apiPost('/partner/qryPartnerTree', { pageSize: 10000 }).then((response) => {
      this.partners = response.data;
    });
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      this.fkApiPost('/wxpay/findAllPointDetail', this.listQuery2).then((response) => {
        const { list, page } = response.obj;
        this.list = list;
        this.counts = page.counts;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    async getRechargeInfo() {
      const { obj: { rechargelist, page } } = await this.fkApiPost('/wxpay/getRechargeInfo', this.listQuery);
      this.rechargeData = rechargelist;
      this.counts2 = page.counts;
    },
    ...mapActions(['fetchPoint']),
  },
};
</script>

<style lang="stylus" scoped>
  .account-desc
    padding 15px 10px 15px
    background #fff
    border-bottom 1px solid #ccc
  h2
    margin-top 5px
    margin-bottom 5px
    margin-left 5px
    margin-right 5px
    padding-left 10px
    padding-top 10px
    padding-bottom 10px
    border-left 4px solid #409EFF
    background #fff
    // &.bottom
</style>
