<template>
    <div class="">
        <div>
            <div class="m-b-5 ovf-hd fz-14 search-bar">
                <!-- <h2>一键救援</h2> -->
                <el-input
                size="mini"
                class="w-200"
                placeholder="请输入关键词搜索"
                v-model="params.orderNumber"
                clearable>
                </el-input>
                <div class="btn-wrapper inline">
                    <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
                </div>
            </div>
            <el-table 
            :data="tableData"
            @sort-change="createtimeSort"
            :default-sort="{prop: 'createtime', order: 'descending'}"
            style="width: 100%"
            size="mini" 
            v-loading="tableLoading"
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
                width="100"
                label="车主手机">
                </el-table-column>
                <el-table-column
                prop="carNumber"
                width="100"
                label="救援车牌">
                </el-table-column>
                <el-table-column
                prop="carBrand"
                width="100"
                label="车型">
                </el-table-column>
                <el-table-column
                prop="aidType"
                width="80"
                label="服务项目">
                  <template slot-scope="{ row: { aidType }}">
                    <span v-if="aidType === 1">拖车</span>
                    <span href="#" v-if="aidType === 2">搭电</span>
                    <span href="#" v-if="aidType === 3">换胎</span>
                    <span href="#" v-if="aidType === 4">充气</span>
                    <span href="#" v-if="aidType === 5">送油</span>
                  </template>
                </el-table-column>
                <el-table-column
                prop="address"
                width="160"
                label="救援地点">
                </el-table-column>
                <el-table-column
                prop="aidPlan"
                width="120"
                label="服务方案">
                </el-table-column>
                <el-table-column
                prop="serviceProName"
                width="120"
                label="救援门店">
                </el-table-column>
                <el-table-column
                prop="createtime"
                width="160"
                sortable="custom"
                label="订单时间">
                </el-table-column>
                <el-table-column
                prop="orderStatus"
                width="100"
                label="救援状态">
                  <template slot-scope="{ row: { orderStatus }}">
                    <a class="c-green" href="#" v-if="orderStatus === 1">已分派</a>
                    <a class="c-blue" href="#" v-if="orderStatus === 0">未分派</a>
                    <a class="c-sliver" href="#" v-if="orderStatus === 2">救援中</a>
                    <a class="c-red" href="#" v-if="orderStatus === 3">已完成</a>
                  </template>
                </el-table-column>
                <el-table-column
                min-width="120px"
                label="操作">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" size="mini" @click="$refs.servicechange.open(scope.row, 1)">服务选择</el-button>
                            <el-button type="danger" size="mini" @click="$refs.sendinfo.open(scope.row, 'RESCUE_TEMPLATE')">发消息</el-button>
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
        </div>
        <sendinfo ref="sendinfo" @init="getAll"></sendinfo>
        <Servicechange ref="servicechange" @init="getAll"></Servicechange>
        <Serviceinfo ref="serviceinfo"></Serviceinfo>
    </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Sendinfo from './send-info';
import Servicechange from './service-change';
import Serviceinfo from './service-info';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        orderNumber: null,
        orderBy: 'createtime desc',
      },
    };
  },
  beforeCreate() {
    this.name = '/aid/findOperatorOrder';
  },
  methods: {
    helpstate() {
    },
    init() {
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
    // Add,
    Sendinfo,
    Servicechange,
    Serviceinfo,
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



