<template>
  <el-dialog
      id="alarmListDialog"
      ref="dialog"
      :title="`历史报警---${devicename}`"
      top="50px"
      width="500px"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <el-select size="mini" v-model="params.typeid" @change="getAll" @clear="getAll" clearable placeholder="请选择报警类型">
      <el-option
        v-for="item in AlarmTypesOptions"
        :key="item.value"
        :label="item.text"
        :value="item.value">
      </el-option>
    </el-select>
    <!-- <el-table class="m-t-10"
              size="mini"
              :data="tableData"
              v-loading="tableLoading"
              @row-click="handleTableRowClick">
      <el-table-column width="80" label="序号" type="index"></el-table-column>
      <el-table-column label="报警地点" prop="address"></el-table-column>
      <el-table-column width="120" label="报警类型" prop="typename"></el-table-column>
      <el-table-column width="135" label="报警时间" prop="alerttime"></el-table-column>
    </el-table> -->
    <ul class="custom-timeline">
      <li v-for="(i, index) in tableData" :key="index" @click="handleTableRowClick(i)" class="item">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss">{{i.alerttime.substring(10, 16)}}</span>
        <div class="item-content">
          <p class="time">{{i.alerttime.substring(0, 10)}}</p>
          <p class="title"><i class="el-icon-warning"></i> {{i.typename}}</p>
          <p class="content"><i class="el-icon-location"></i> {{i.address || '暂无告警地址'}}</p>
        </div>
      </li>
    </ul>
    <div class="pos-rel p-t-20 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages m-t-15">
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
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

export default {
  mixins: [http, listMixin],
  data() {
    return {
      dialogVisible: false,
      params: {
        sn: null,
        typeid: null,
        logtype: 1,
      },
      AlarmTypesOptions: [],
      devicename: null,
    };
  },
  beforeCreate() {
    this.name = '/deviceAlert/queryAlertList';
  },
  methods: {
    async open(sn, devicename) {
      this.dialogVisible = true;
      this.params.sn = sn;
      this.devicename = devicename;
      this.fetchAlertTypes();
      this.getAll();
    },
    async fetchAlertTypes() {
      const { data } = await this.apiPost('/deviceAlert/api/queryTypes', {});
      this.AlarmTypesOptions = data.map(({ id, name }) => ({ text: name, value: id }));
    },
    handleTableRowClick(row) {
      this.$emit('handleTableRowClick', row);
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .custom-timeline
    list-style: none;
    margin: 0;
    padding: 20px 0 0 20px;
    .item
      margin: 0!important;
      padding: 0 0 12px;
      list-style: none;
      position: relative;
      cursor pointer
      &:hover
        text-decoration underline
        // background: rgba(0, 0, 0, 0.1)
      &:last-child
        .item-tail
          display: none;
      .item-tail
        height: 100%;
        border-left: 1px solid #e9eaec;
        position: absolute;
        left: 48px;
        top: 0;
      .item-head
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        left: 40px
        &.blue
          border-color: #2d8cf0;
          color: #2d8cf0;
      .hhmmss
        position absolute
        top: 50%
        transform translateY(-50%)
        font-size: 16px
        font-weight bold
      .item-content
        padding: 1px 1px 10px 64px;
        font-size: 12px;
        position: relative;
        top: -3px;
        .time
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        .content, .title
          padding-left: 5px;
        .title
          color: #F56C6C
</style>
