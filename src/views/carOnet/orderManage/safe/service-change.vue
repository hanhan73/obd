<template>
  <el-dialog
  title="服务选择"
  :visible.sync="dialogVisible"
  width="25%"
  :modal-append-to-body="false"
  center>
  <div class="">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      <el-form-item   label="服务门店" prop="serviceProId" v-if="form.updateType === 2">
        <el-select v-model="form.serviceProId" clearable  placeholder="请选择服务门店" class="w-200">
          <el-option  v-for="(item,index) in stormitem" :key="index" :label="item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基本套餐" prop="baseSetMealId" v-if="form.updateType === 2">
        <el-select v-model="form.baseSetMealId" clearable  placeholder="请选择基本套餐" class="w-200">
          <el-option  v-for="(item,index) in Mealitem" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="全面套餐" prop="allSetMealId" v-if="form.updateType === 2">
        <el-select v-model="form.allSetMealId" clearable  placeholder="请选择全面套餐" class="w-200">
          <el-option  v-for="(item,index) in Mealitem" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐套餐" prop="recomSetMealId"  v-if="form.updateType === 2">
        <el-select v-model="form.recomSetMealId" clearable  placeholder="请选择推荐套餐" class="w-200">
          <el-option  v-for="(item,index) in Mealitem" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最终套餐" prop="setMealId" v-if="form.updateType === 6">
        <el-select v-model="form.setMealId" clearable  placeholder="请选择最终套餐" class="w-200">
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
        recomSetMealId: null,
        baseSetMealId: null,
        allSetMealId: null,
        setMealId: null,
      },
      rules: {
        serviceProId: [
          { required: true, message: '请选择服务门店', trigger: 'change' },
        ],
      },
    };
  },
  beforeCreate() {
    this.name = '/insurance/serviceSelection';
    this.getitem = '/insurance/findPackageList';
  },
  methods: {
    async open(r, chanceType) {
      this.dialogVisible = true;
      this.form.orderNumber = r.orderNumber;
      this.form.updateType = chanceType;
      const accounttype = 3;
      const { data } = await this.apiPost('/backUser/findAll', { accounttype, pageSize: 10000 });
      this.stormitem = data;
      this.Mealitem = await this.apiPost(this.getitem, { accounttype, pageSize: 10000 });
      this.Mealitem = this.Mealitem.data;
      if (chanceType === 2) {
        this.form.serviceProId = r.serviceProId;
        this.form.recomSetMealId = r.recomSetMealId;
        this.form.baseSetMealId = r.baseSetMealId;
        this.form.allSetMealId = r.allSetMealId;
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