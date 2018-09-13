<template>
    <el-dialog
    title="发消息"
    :visible.sync="centerDialogVisible"
    width="30%"
    :modal-append-to-body="false"
    center>
    <div class="btn-div">
      <el-tabs v-model="tabBtn"  @tab-click="handleClick" >
        <el-tab-pane label="推送消息" name="movementInfo"></el-tab-pane>
        <el-tab-pane label="发短信 " name="message"></el-tab-pane>
        <div class="input-div">
          <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="userInput">
          </el-input>
        </div>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">          
        <el-button @click="centerDialogVisible = false">取 消</el-button>
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
</style>




