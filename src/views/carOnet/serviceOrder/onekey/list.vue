<template>
    <div class="">
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
              style="width: 100%"
              size="mini" 
              v-loading="tableLoading"
              @sort-change="serviceProTimeSort"
              :default-sort="{prop: 'serviceProTime', order: 'descending'}"
              highlight-current-row
              @selection-change="val => selection = val"
              stripe>
                <el-table-column
                type="index"
                width="50">
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
                width="100"
                label="救援车牌">
                </el-table-column>
                <el-table-column
                prop="carBrand"
                width="80"
                label="车型">
                </el-table-column>
                <el-table-column
                prop="aidType"
                width="80"
                label="救援类型">
                  <template slot-scope="{ row: { aidType }}">
                    <span v-if="aidType === 1">拖车</span>
                    <span v-if="aidType === 2">搭电</span>
                    <span  v-if="aidType === 3">换胎</span>
                    <span  v-if="aidType === 4">充气</span>
                    <span v-if="aidType === 5">送油</span>
                  </template>
                </el-table-column>
                <el-table-column
                prop="address"
                width="180"
                label="救援地点">
                </el-table-column>
                <el-table-column
                prop="rescueUserName"
                width="100"
                label="救援人员">
                </el-table-column>
                <el-table-column
                prop="rescueUserPhone"
                width="100"
                label="救援手机">
                </el-table-column>
                 <el-table-column
                prop="serviceProTime"
                sortable="custom"
                width="160"
                label="分派时间">
                </el-table-column>
                <el-table-column
                prop="orderStatus"
                width="100"
                label="救援状态">
                  <template slot-scope="{ row: { orderStatus }}">
                    <a  class="c-green" href="#" v-if="orderStatus === 1">已接单</a>
                    <a  class="c-blue" href="#" v-if="orderStatus === 2">救援中</a>
                    <a  class="c-red" href="#" v-if="orderStatus === 3">已完成</a>
                  </template>
                </el-table-column>
                <el-table-column
                min-width="120px"
                label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" size="mini" @click="$refs.Servicechange.open(scope.row.orderNumber, 2)">服务选择</el-button>
                            <el-button type="danger" size="mini" @click="$refs.sendinfo.open(scope.row,'RESCUE_TEMPLATE')">发消息</el-button>
                            <el-button type="info" size="mini" @click="$refs.Serviceinfo.open(scope.$index, scope.row, 'service')">服务进程</el-button>
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
        </div>
        <sendinfo ref="sendinfo"></sendinfo>
        <Servicechange ref="Servicechange" @init="getAll"></Servicechange>
        <Serviceinfo ref="Serviceinfo"></Serviceinfo>
    </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Sendinfo from './send-info';
import Servicechange from '../../orderManage/onekey/service-change';
import Serviceinfo from '../../orderManage/onekey/service-info';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        orderNumber: null,
        orderBy: 'serviceProTime desc',
      },
      oneBtuHelp: [
        {
          ordernum: '124565',
          name: '辅导费',
          phone: '1234789794',
          carnum: '445454545',
          cartype: 'dad',
          service: 'fafda',
          address: 'dadfddfdfdfdfd',
          serviceplan: 'daddada',
          helpstore: '深圳西丽大学城店',
          phonestore: '深圳南山西丽',
          helpstate: 3,
        },
      ],
    };
  },
  components: {
    Sendinfo,
    Servicechange,
    Serviceinfo,
  },
  beforeCreate() {
    this.name = '/aid/findOperatorOrder';
  },
  methods: {
    init() {
      this.getAll();
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
};
</script>


<style lang="stylus" scoped>
h2 {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-left: 4px solid #409EFF;
    background: #fff;
    // &.bottom
}
</style>



