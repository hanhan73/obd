<template>
    <el-dialog
    title="服务记录"
    :visible.sync="dialogVisible"
    width="30%"
    :modal-append-to-body="false"
    center>
    <div style="height:400px;">
    <el-scrollbar style="height:100%">
    <ul class="custom-timeline">
      <li class="item" v-for="(item,index) in tableData" :key="index">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss">{{item.createTime}}</span>
        <div class="item-content">
          <p class="time">服务：{{item.name}}</p>
          <p class="title"> 门店:{{item.serviceProName}}</p>
          <p class="content">电话: {{item.serviceProPhone}}</p>
        </div>
      </li>
    </ul>
    </el-scrollbar>
    </div>
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
            :current-page="pagination.pageNumber"
            :total="pagination.dataCount">
          </el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">          
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
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
      tabBtn: 'movementInfo',
      userInput: null,
      tabPosition: 'left',
      params: {
        appUserId: null,
        orderBy: 'createTime desc',
      },
      listdata: [],
    };
  },
  beforeCreate() {
    this.name = '/appUser/findServiceRecordList';
  },
  methods: {
    async open(appUserId) {
      this.params.appUserId = appUserId;
      this.getAll();
      console.log(this.tableData);
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
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
        left: 178px;
        top: 0;
      .item-head
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        left: 170px
        &.blue
          border-color: #2d8cf0;
          color: #2d8cf0;
      .hhmmss
        position absolute
        top: 50%
        transform translateY(-50%)
        font-size: 16px
      .item-content
        padding: 1px 1px 10px 200px;
        font-size: 12px;
        position: relative;
        top: -3px;
        .time
          font-size: 15px;
          font-weight: 700;
          margin: 0;
          padding-bottom 5px;
        .content, .title
          padding-left: 5px;
          padding-bottom 5px;
        .title
          color: #f56c6c
</style>




