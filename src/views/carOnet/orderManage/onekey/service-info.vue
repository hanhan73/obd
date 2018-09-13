<template>
    <el-dialog
    title="服务记录"
    :visible.sync="dialogVisible"
    width="20%"
    :modal-append-to-body="false"
    center>
    <ul class="custom-timeline">
      <li class="item" v-if="list.createtime && type === undefined">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss c-blue">待分派</span>
        <div class="item-content">
          <p class="time">{{list.aidPlan}}</p>
          <p class="title"> {{list.serviceProName}}</p>
          <p class="content">{{list.createtime}}</p>
        </div>
      </li>
      <li class="item" v-if="list.serviceProTime">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss c-green">{{type?'已接单':'已分派'}}</span>
        <div class="item-content">
          <p class="time">{{list.aidPlan}}</p>
          <p class="title"> {{list.serviceProName}}</p>
          <p class="content"> {{list.serviceProTime}}</p>
        </div>
      </li>
      <li class="item" v-if="list.rescueUserTime && type !== undefined">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss c-green">救援中</span>
        <div class="item-content">
          <p class="time">{{list.aidPlan}}</p>
          <p class="title"> {{list.serviceProName}}</p>
          <p class="content"> {{list.rescueUserTime}}</p>
        </div>
      </li>
      <li class="item" v-if="list.endTime">
        <div class="item-tail"></div>
        <div class="item-head blue"></div>
        <span class="hhmmss c-red">服务结束</span>
        <div class="item-content">
          <p class="time">{{list.aidPlan}}</p>
          <p class="title"> {{list.serviceProName}}</p>
          <p class="content"> {{list.endTime}}</p>
        </div>
      </li>
    </ul>
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
      tabPosition: 'left',
      list: [],
      type: null,
    };
  },
  methods: {
    async open(index, row, infotype) {
      this.list = row;
      this.type = infotype;
      console.log(this.type);
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
        left: 58px;
        top: 0;
      .item-head
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        left: 50px
        &.blue
          border-color: #2d8cf0;
          color: #2d8cf0;
      .hhmmss
        position absolute
        top: 50%
        transform translateY(-50%)
        font-size: 16px
      .item-content
        padding: 1px 1px 10px 70px;
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
          color: #F56C6C
</style>




