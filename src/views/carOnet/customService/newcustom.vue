<template>
    <el-dialog
    title="新建客服记录"
    :visible.sync="centerDialogVisible"
    width="26%"
    :modal-append-to-body="false"
    center>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="车主姓名" size="medium">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" size="medium">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="车辆信息" size="medium">
        <el-input v-model="form.carinfo"></el-input>
      </el-form-item>
      <el-form-item label="呼出时间" size="medium">
        <el-input v-model="form.calltime"></el-input>
      </el-form-item>
      <el-form-item label="服务类型" size="medium">
        <el-input v-model="form.servicetype"></el-input>
      </el-form-item>
      <el-form-item label="服务人员" size="medium">
        <el-input v-model="form.serviceperson"></el-input>
      </el-form-item>
      <el-form-item label="服务人员手机" size="medium">
        <el-input v-model="form.servicephone"></el-input>
      </el-form-item>
      <el-form-item label="备注" size="medium">
        <el-input  type="textarea" autosize v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">          
        <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      tabBtn: 'movementInfo',
      userInput: null,
      tabPosition: 'left',
      form: {
        name: '',
        sex: '',
      },
      pagination: {
        pageSize: 10,
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
    };
  },
  methods: {
    async open() {
      this.centerDialogVisible = true;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn-div
  text-align center
  width 100%
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