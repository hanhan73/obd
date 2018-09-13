<template>
  <div class="app-container">
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row size="mini">
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
    </el-table>
    <div class="pos-rel p-t-10 p-b-20 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
        <el-pagination
          @current-change="fetchData"
          :current-page.sync="listQuery.currentPage"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="counts">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import moment from 'moment';
// import { getList } from '@/api/consume';

export default {
  name: 'consume-list',
  mixins: [http],
  data() {
    return {
      counts: 0,
      list: null,
      listLoading: true,
      listQuery: {
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
    };
  },
  filters: {
    timeFilter(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      this.fkApiPost('/wxpay/findAllPointDetail', this.listQuery).then((response) => {
        const { list, page } = response.obj;
        this.list = list;
        this.counts = page.counts;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    onSubmit() {
      //
    },
  },
};
</script>
