<template>
  <el-dialog
  title="服务选择"
  :visible.sync="dialogVisible"
  width="30%"
  :modal-append-to-body="false"
  center>
  <div class="">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="form.updateType === 1" label="服务门店" prop="serviceProId">
        <el-select v-model="form.serviceProId" clearable  placeholder="请选择服务门店">
          <el-option  v-for="(item,index) in stormitem" :key="index" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.updateType === 2" label="救援人员" prop="rescueUserId">
        <el-select v-model="form.rescueUserId" clearable  placeholder="请选择救援人员">
          <el-option  v-for="(item,index) in helpitem" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务方案" prop="aidPlan">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.aidPlan">
          </el-input>
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
import listMixin from '@/assets/js/list_com';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, listMixin, formMixin],
  data() {
    return {
      dialogVisible: false,
      stormitem: {
        id: null,
        username: null,
      },
      helpitem: {
        id: null,
        name: null,
      },
      form: {
        updateType: null,
        orderNumber: null,
        serviceProId: null,
        aidPlan: null,
        rescueUserId: null,
      },
      rules: {
        serviceProId: [
          { required: true, message: '请选择服务门店', trigger: 'change' },
        ],
        rescueUserId: [
          { required: true, message: '请选择救援人员', trigger: 'change' },
        ],
        aidPlan: [
          { required: false, message: '请输入服务方案', trigger: 'blur' },
        ],
      },
    };
  },
  beforeCreate() {
    this.name = '/aid/updateAidOrderInfo';
  },
  methods: {
    async open(r, chanceType) {
      this.dialogVisible = true;
      this.form.orderNumber = r.orderNumber;
      this.form.updateType = chanceType;
      this.form.aidPlan = r.aidPlan;
      if (chanceType === 1) {
        const accounttype = 3;
        const { data } = await this.apiPost('/backUser/findAll', { accounttype, pageSize: 10000 });
        this.stormitem = data;
        this.form.serviceProId = r.serviceProId;
      } else if (chanceType === 2) {
        const { data } = await this.apiPost('/aid/findAllRescueUser', { pageSize: 10000 });
        this.helpitem = data;
        this.form.rescueUserId = r.rescueUserId;
      }
    },
    async subForm() {
      // const { data } = await this.apiPost(this.name);
      // console.log(data);
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.btn-div
  text-align center
  width 100%
</style>