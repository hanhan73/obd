<template>
  <el-dialog
  title="服务选择"
  :visible.sync="dialogVisible"
  width="25%"
  :modal-append-to-body="false"
  center>
  <div class="">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item   label="服务门店" prop="serviceProId">
        <el-select v-model="form.serviceProId" clearable  placeholder="请选择服务门店" class="w-200">
          <el-option  v-for="(item,index) in stormitem" :key="index" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.updateType === 2" label="维修方案" prop="remark">
        <el-input
          size="medium"
          class="w-200"
          placeholder="请输入维修方案"
          v-model="form.repairPlan"
          clearable>
          </el-input>
      </el-form-item>
      <el-form-item v-if="form.updateType === 1" label="保养套餐" prop="setMealId" >
        <el-select v-model="form.setMealId" clearable  placeholder="请选择保养套餐" class="w-200">
          <el-option  v-for="(item,index) in Mealitem" :key="index" :label="item.name" :value="item.id"></el-option>
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
      Mealitem: {
        id: null,
        name: null,
      },
      safeitem: {
        id: null,
        name: null,
      },
      form: {
        updateType: null,
        orderNumber: null,
        serviceProId: null,
        setMealId: null,
        repairPlan: null,
      },
      rules: {
        serviceProId: [
          { required: true, message: '请选择服务门店', trigger: 'change' },
        ],
        repairPlan: [
          { required: true, message: '请输入维修套餐', trigger: 'blur' },
        ],
        setMealId: [
          { required: true, message: '请选择保养套餐', trigger: 'change' },
        ],
      },
    };
  },
  beforeCreate() {
    this.name = '/maintain/serviceSelection';
    this.getitem = '/maintain/findSetMealList';
  },
  methods: {
    async open(r, chanceType) {
      this.dialogVisible = true;
      this.form.orderNumber = r.orderNumber;
      this.form.updateType = chanceType;
      this.form.serviceProId = r.serviceProId;
      if (r.mainType === 0) {
        this.form.updateType = 1;
        r.setMealId = this.form.setMealId;
      } else if (r.mainType === 1) {
        this.form.updateType = 2;
        r.setMealName = this.form.repairPlan;
      }
      const accounttype = 3;
      const { data } = await this.apiPost('/backUser/findAll', { accounttype, pageSize: 10000 });
      this.stormitem = data;
      if (chanceType === 1) {
        this.Mealitem = await this.apiPost(this.getitem, { accounttype, pageSize: 10000 });
        this.Mealitem = this.Mealitem.data;
      } else if (chanceType === 2) {
        // this.safeitem = await this.apiPost('/insurance/findPackageList', { pageSize: 10000 });
        // this.safeitem = this.safeitem.data;
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