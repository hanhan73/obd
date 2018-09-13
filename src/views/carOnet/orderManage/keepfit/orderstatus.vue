<template>
 <el-dialog
  title="更改状态"
  :visible.sync="dialogVisible"
  width="30%"
  :modal-append-to-body="false"
  center>
  <div class="">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="更改状态为：" prop="serviceProId">
        <el-select v-model="form.orderstatus" clearable  placeholder="请选择服务门店">
          <el-option  v-for="(item,index) in statusitem" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
      form: {
        orderstatus: null,
      },
      rules: {
        orderstatus: [
          { required: true, message: '请选择服务状态', trigger: 'change' },
        ],
      },
      statusitem: [
        {
          id: 1,
          name: '已结束',
        },
        {
          id: 0,
          name: '待接单',
        },
        {
          id: 3,
          name: '已接单',
        },
      ],
    };
  },
  beforeCreate() {
    this.name = '';
  },
  methods: {
    async open() {
      this.dialogVisible = true;
    },
  },
};
</script>

