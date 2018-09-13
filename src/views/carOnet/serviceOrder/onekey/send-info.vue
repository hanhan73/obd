<template>
    <el-dialog
    title="发消息"
    :visible.sync="dialogVisible"
    width="30%"
    :modal-append-to-body="false"
    center>
    <div class="btn-div">
      <el-tabs v-model="tabBtn"  @tab-click="handleClick" >
        <el-tab-pane label="推送消息" name="movementInfo"></el-tab-pane>
        <el-form :model="form" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="模板选择: " prop="content" label-width="100px">
          <el-select v-model="c" placeholder="请选择模板" class="w-400" @change="changec">
            <el-option
              v-for="(item, index) in getitem.data"
              :key="index"
              :label="item.name"
              :value="item.content">
            </el-option>
          </el-select>
           </el-form-item>
        <div class="input-div">
          <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.content">
          </el-input>
        </div>
        </el-form>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">          
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add()" :loading="isLoading">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      dialogVisible: false,
      tabBtn: 'movementInfo',
      userInput: null,
      tabPosition: 'left',
      getitem: null,
      c: null,
      form: {
        appUserId: null,
        content: null,
        orderNumber: null,
      },
    };
  },
  beforeCreate() {
    this.name = '/notice/sendPush';
    this.opname = '/messTemplate/findAll';
  },
  methods: {
    async open(row, iter) {
      this.form.appUserId = row.appUserId;
      this.form.orderNumber = row.orderNumber;
      this.getitem = await this.apiPost(this.opname, { series: iter });
      this.dialogVisible = true;
    },
    changec() {
      this.form.content = this.c;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn-div
  text-align center
  width 100%
</style>




