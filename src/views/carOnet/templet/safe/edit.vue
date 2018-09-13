<template>
  <el-dialog
  title="编辑保险套餐"
  :visible.sync="dialogVisible"
  width="50%"
  :modal-append-to-body="false"
  center>
  <el-row>
    <el-col><h3>模板名称：<el-input v-model="templatename" placeholder="商品名称" class="w-300" clearable></el-input></h3></el-col>
  </el-row>
   <div style="height:400px;">
    <el-scrollbar style="height:80%">
  <el-table :data="prodlist" style="width: 100%" size="mini" stripe>
    <el-table-column
      type="index"
      width="35px">
    </el-table-column>
    <el-table-column
    label="商品"
    prop="name"
    width="300">
    </el-table-column>
    <el-table-column
    prop="insuredAmount"
    label="保额"
    width="120">
    </el-table-column>
    <el-table-column
    prop="amount"
    label="价格"
    width="120">
    </el-table-column>
    <el-table-column
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, prodlist)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-scrollbar>
   <div class="" style="padding:10px;">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="名称">
            <el-input v-model="formInline.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="保额">
            <el-input v-model="formInline.insuredAmount" placeholder="保额"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="formInline.amount" placeholder="价格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-row>
        <el-col><h3>备注：<el-input v-model="remark" placeholder="请输入备注"  class="w-300" clearable></el-input></h3></el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"  @click="allSubmit" :loading="isLoading">提交</el-button>
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
      prodlist: [],
      templatename: null,
      formInline: {
        name: null,
        insuredAmount: null,
        amount: null,
      },
      remark: null,
      i: null,
    };
  },
  beforeCreate() {
    this.name = '/insurance/saveOrUpdatePackage';
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    async open(row) {
      this.dialogVisible = true;
      this.prodlist = row.typeOfInsurance;
      this.templatename = row.name;
      this.remark = row.remark;
      this.i = row.id;
    },
    onSubmit() {
      this.prodlist.push(Object.assign({}, this.formInline));
      this.$refs.formInline.resetFields();
    },
    async allSubmit() {
      await this.apiPost(this.name, { typeOfInsurance: JSON.stringify(this.prodlist),
        id: this.i,
        name: this.templatename,
        remark: this.remark });
      this.$message.success('提交成功！');
      this.dialogVisible = false;
      this.$emit('init');
    },
    close() {
      this.dialogVisible = false;
      this.$emit('init');
    },
  },
};
</script>
<style>
</style>

