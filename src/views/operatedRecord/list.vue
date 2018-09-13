<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-select v-model="params.partnerid"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择账号名称"
                 @clear="handlePartnerClear"
                 @change="handlePartnerChange">
        <el-option
          v-for="item in partners"
          :key="item.id"
          :label="item.partnername"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="params.operatorid"
                 size="mini"
                 :disabled="params.partnerid === null"
                 v-loading="userListLoading"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择操作人">
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.username"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="params.modeid"
                 size="mini"
                 clearable
                 class="w-200"
                 popper-class="w-200"
                 placeholder="请选择功能模块">
        <el-option
          v-for="item in menuList"
          :key="item.menuid"
          :label="item.menuname"
          :value="item.menuid">
        </el-option>
      </el-select>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
      </div>
    </div>
    <el-table
      stripe
      size="small"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="80px">
      </el-table-column>
      <el-table-column
        property="modeName"
        label="功能模块">
      </el-table-column>
      <el-table-column
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        property="operatorname"
        label="操作人">
      </el-table-column>
      <el-table-column
        property="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        width="180"
        property="createtime"
        label="创建时间">
      </el-table-column>
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
  name: escapeName('操作日志列表'),
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      menuList: [],
      userList: [],
      userListLoading: false,
      params: {
        partnerid: null,
        operatorid: null,
        modeid: null,
      },
    };
  },
  computed: {
    ...mapGetters(['partners']),
  },
  beforeCreate() {
    this.name = '/operarecord/queryOperationList';
  },
  methods: {
    async init() {
      const { data } = await this.apiPost('/operarecord/queryMenuList', { levels: 3 });
      this.menuList = data;
      this.fetchPartners();
      this.getAll();
    },
    async handlePartnerChange(partnerid) {
      this.params.operatorid = null;
      this.userList = [];
      this.userListLoading = true;
      const { data } = await this.apiPost('/backuser/qryAllUserInfoList', { partnerid });
      this.userListLoading = false;
      this.userList = data;
    },
    handlePartnerClear() {
      this.params.partnerid = null;
      this.params.operatorid = null;
      this.userList = [];
    },
    ...mapActions(['fetchPartners']),
  },
  components: {
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
