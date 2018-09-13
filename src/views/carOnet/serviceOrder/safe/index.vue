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
      <el-table :data="tableData"
          @sort-change="serviceProTimeSort"
          :default-sort="{prop: 'serviceProTime', order: 'descending'}" style="width: 100%" v-loading="tableLoading" size="mini" stripe>
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
          width="80">
          </el-table-column>
          <el-table-column
          prop="userPhone"
          label="车主手机"
          width="100">
          </el-table-column>
          <el-table-column
          prop="carNumber"
          label="服务车牌"
          width="80">
          </el-table-column>
          <el-table-column
          prop="carBrand"
          label="车型"
          width="80">
          </el-table-column>
          <el-table-column
          prop="service"
          label="服务项目"
          width="120">
          </el-table-column>
          <el-table-column
          prop="serviceplan"
          label="服务方案"
          width="100">
          </el-table-column>
          <el-table-column
          prop="serviceProTime"
          label="分派时间"
          sortable="custom"
          width="140">
          </el-table-column>
          <el-table-column
          prop="serviceProName"
          label="服务门店"
          width="120">
          </el-table-column>
          <el-table-column
          prop="Phone"
          label="门店电话"
          width="80">
          </el-table-column>
          <el-table-column
          prop="orderStatus"
          width="80"
          label="服务状态">
            <template slot-scope="{ row: { orderStatus }}">
              <a class="c-green" href="#" v-if="orderStatus === 1">已接单</a>
              <a class="c-blue" href="#" v-if="orderStatus === 2">救援中</a>
              <a class="c-red" href="#" v-if="orderStatus === 3">已完成</a>
            </template>
          </el-table-column>
          <el-table-column
          min-width="100px"
          label="操作">
              <template slot-scope="scope">
                  <el-button-group>
                      <!-- <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row.id)">服务选择</el-button> -->
                      <el-button type="danger" size="mini" @click="$refs.sendinfo.open(scope.row,'INSURANCE_TEMPLATE')">发消息</el-button>
                      <el-button type="info" size="mini" @click="$refs.serviceinfo.open(scope.$index, scope.row, 'service')">服务进程</el-button>
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
      <sendinfo ref="sendinfo"></sendinfo>
      <Serviceinfo ref="serviceinfo"></Serviceinfo>
  </div>
</template>
<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Sendinfo from '../onekey/send-info';
import Serviceinfo from '../../orderManage/safe/service-info';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        orderNumber: null,
        orderBy: 'serviceProTime desc',
      },
    };
  },
  beforeCreate() {
    this.name = '/insurance/findAllInsuranceOrder';
  },
  methods: {
    init() {
      this.tableLoading = true;
      this.getAll();
      this.tableLoading = false;
    },
    serviceProTimeSort(ob) {
      if (ob.order === 'ascending') {
        this.params.orderBy = 'serviceProTime';
      } else if (ob.order === 'descending') {
        this.params.orderBy = 'serviceProTime desc';
      }
      this.getAll();
    },
  },
  components: {
    Sendinfo,
    Serviceinfo,
  },
};
</script>

