<template>
  <div>
      <div class="m-b-5 ovf-hd fz-14 search-bar">
          <el-input
          size="mini"
          class="w-200"
          placeholder="请输入订单号搜索"
          v-model="params.orderNumber"
          clearable>
          </el-input>
          <div class="btn-wrapper inline">
              <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
          </div>
      </div>
      <el-table @sort-change="createtimeSort"
      :default-sort="{prop: 'createtime', order: 'descending'}" :data="tableData" style="width: 100%" v-loading="tableLoading" @selection-change="val => selection = val" size="mini" stripe>
          <el-table-column
            type="index"
            width="35px">
          </el-table-column>
          <el-table-column
          prop="orderNumber"
          label="订单编号"
          width="180">
          </el-table-column>
          <el-table-column
          prop="userName"
          label="车主姓名"
          width="100">
          </el-table-column>
          <el-table-column
          prop="userPhone"
          width="120"
          label="车主手机">
          </el-table-column>
          <el-table-column
          prop="carNumber"
          width="160"
          label="救援车牌">
          </el-table-column>
          <el-table-column
          prop="carBrand"
          width="100"
          label="车型">
          </el-table-column>
          <el-table-column
          width="100"
          label="服务项目">
            <template slot-scope="scope">
              <span v-if="scope.row.mainType === 0">保养</span>
              <span v-if="scope.row.mainType === 1">维修</span>
            </template>
          </el-table-column>
          <el-table-column
          width="120"
          label="服务方案">
            <template slot-scope="scope">
              <span v-if="scope.row.mainType === 0">{{scope.row.setMealName}}</span>
              <span v-if="scope.row.mainType === 1">{{scope.row.repairPlan}}</span>
            </template>
          </el-table-column>
          <el-table-column
          prop="serviceProName"
          width="120"
          label="服务门店">
          </el-table-column>
          <el-table-column
          prop="remark"
          width="80"
          label="描述">
          </el-table-column>
          <el-table-column
          prop="createtime"
          width="160"
          sortable="custom"
          label="订单时间">
          </el-table-column>
          <el-table-column
          prop="orderStatus"
          width="80"
          label="服务状态">
            <template slot-scope="{ row: { orderStatus }}">
              <a v-bind:style="{ color: activeColor1 }" href="#" v-if="orderStatus === 1">已分派</a>
              <a class="c-sliver" href="#" v-if="orderStatus === 2">救援中</a>
              <a v-bind:style="{ color: activeColor3 }" href="#" v-if="orderStatus === 3">已完成</a>
              <a v-bind:style="{ color: activeColor2 }" href="#" v-if="orderStatus === 0" @click="$refs.orderstatus.open()">未分派</a>
            </template>
          </el-table-column>
          <el-table-column
          min-width="100px"
          label="操作">
              <template slot-scope="scope">
                  <el-button-group>
                    <el-button type="primary" size="mini" @click="$refs.servicechange.open(scope.row, 1)">服务选择</el-button>
                    <el-button type="danger" size="mini" @click="$refs.sendinfo.open(scope.row, 'MAINTENANCE_TEMPLATE')">发消息</el-button>
                    <el-button type="info" size="mini" @click="$refs.serviceinfo.open(scope.$index, scope.row)">服务进程</el-button>
                    <el-button type="success" size="mini" v-if="scope.row.orderStatus !== 0 && scope.row.orderStatus !== 3"  @click="orderfinish(scope.row)">完结</el-button>
                  </el-button-group>
              </template>
          </el-table-column>
      </el-table>
      <div class="pos-rel p-t-10 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[15, 30, 60, 100]"
            :page-size="pagination.pageSize"
            :current-page="pagination.pageNumber"
            :total="pagination.dataCount">
          </el-pagination>
      </div>
    </div>
      <serviceinfo ref="serviceinfo"></serviceinfo>
      <orderstatus ref="orderstatus" @init="getAll"></orderstatus>
      <servicechange ref="servicechange" @init="getAll"></servicechange>
      <sendinfo ref="sendinfo"></sendinfo>
  </div>
</template>
<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Serviceinfo from './service-info';
import Servicechange from './service-change';
import Orderstatus from './orderstatus';
import Sendinfo from '../onekey/send-info';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      activeColor1: '#409EFF',
      activeColor2: '#F56C6C',
      activeColor3: '#E6A23C',
      params: {
        orderNumber: null,
        orderBy: 'createtime desc',
      },
    };
  },
  beforeCreate() {
    this.name = '/maintain/findAllMaintainOrder';
  },
  methods: {
    async init() {
      this.tableLoading = true;
      this.getAll();
      this.tableLoading = false;
    },
    orderfinish(r) {
      this.$confirm('确定完结订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      })
      .then(async () => {
        const params = { orderNumber: r.orderNumber };
        const loading = _g.toastMsg('normal', '正在处理中...');
        await this.apiPost('/operator/endOrder', params);
        loading.close();
        _g.toastMsg('success', '成功');
        this.getAll();
      })
      .catch(() => {
        // catch error
      });
    },
    createtimeSort(ob) {
      if (ob.order === 'ascending') {
        this.params.orderBy = 'createtime';
      } else if (ob.order === 'descending') {
        this.params.orderBy = 'createtime desc';
      }
      this.getAll();
    },
  },
  components: {
    Serviceinfo,
    Servicechange,
    Orderstatus,
    Sendinfo,
  },
};
</script>

