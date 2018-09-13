<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input
        size="mini"
        class="w-200"
        placeholder="请输入服务商名称"
        v-model="params.serviceProName"
        clearable>
        </el-input>
        <div class="btn-wrapper inline">
            <el-button size="mini" type="primary" icon="search" @click="getAll">搜索</el-button>
            <el-button size="mini" type="primary" icon="add" @click="$refs.edit.open('')">新建门店</el-button>
        </div>
    </div>
    <el-table :data="tableData"  style="width: 100%" size="mini" stripe>
      <el-table-column
        type="index"
        width="35px">
      </el-table-column>
      <el-table-column
        prop="picName"
        label="商品"
        width="180">
        <template slot-scope="scope">
          <el-row>
            <el-col>
              <img
              class="g-img"
              :src="scope.row.picName"
              alt="">
            </el-col>
          </el-row>
        </template>
      </el-table-column>
       <el-table-column
        prop="name"
        label="服务商名称"
        width="80">
        </el-table-column>
      <el-table-column
        prop="chargePer"
        label="负责人"
        width="80">
        </el-table-column>
        <el-table-column
        prop="chargePerTel"
        label="联系电话"
        width="100">
        </el-table-column>
        <el-table-column
        label="经纬度"
        width="120">
          <template slot-scope="scope">
            <h4>经度：{{scope.row.lng}}</h4>
            <h4>纬度：{{scope.row.lat}}</h4>
          </template>
        </el-table-column>
      <el-table-column
        prop="address"
        label="服务商地址"
        width="200">
        </el-table-column>
        <el-table-column
        prop="serviceType"
        label="服务范围"
        width="160">
        </el-table-column>
        <el-table-column
        prop="keepfitTime"
        label="服务接单数"
        width="100">
        </el-table-column>
        <el-table-column
        prop="useraccount"
        label="登录账号"
        width="100">
        </el-table-column>
        <el-table-column
        prop="password"
        label="登录密码"
        width="100">
        </el-table-column>
        <el-table-column
        prop="roleName"
        label="账号权限"
        width="100">
        </el-table-column>
        <el-table-column
        prop="remark"
        label="备注"
        width="100">
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button-group>
                <el-button type="primary" size="mini" @click="$refs.edit.open(scope.row)">编辑</el-button>
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
    <edit ref="edit" @init="getAll"></edit>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import Edit from './edit';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      params: {
        serviceProName: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/serviceProvider/findAll';
  },
  methods: {
    init() {
      this.getAll();
    },
  },
  components: {
    Edit,
  },
};
</script>
<style lang="stylus" scoped>
.g-img
  width 100px
  height 100px
</style>