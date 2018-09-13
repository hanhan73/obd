<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input
        size="mini"
        class="w-200"
        placeholder="请输入车主姓名"
        v-model="params.userName"
        clearable>
        </el-input>
        <div class="btn-wrapper inline">
            <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
        </div>
    </div>
    <el-table :data="tableData"  style="width: 100%" size="mini" stripe>
      <el-table-column
        type="index"
        width="50">
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
        prop="carnumber"
        label="车牌"
        width="100">
        </el-table-column>
        <el-table-column
        prop="carType"
        label="车型"
        width="100">
        </el-table-column>
        <el-table-column
        prop="sn"
        label="设备号"
        width="130">
        </el-table-column>
      <el-table-column
        prop="deviceStatus"
        label="设备状态"
        width="120">
        </el-table-column>
        <el-table-column
        prop="address"
        label="位置"
        width="220">
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button-group>
                <el-button type="primary" size="mini" @click="$refs.serviceinfo.open(scope.row.appUserId)">服务记录</el-button>
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
            :current-page="pagination.curPage"
            :total="pagination.dataCount">
          </el-pagination>
      </div>
    </div>
    <serviceinfo ref="serviceinfo"></serviceinfo>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Serviceinfo from './service-info';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        userName: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/operator/findAllVehicle';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    Serviceinfo,
  },
};
</script>
<style lang="stylus" scoped>
.g-img
  width 100px
  height 100px
</style>

