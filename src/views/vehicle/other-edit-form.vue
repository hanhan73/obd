<template>
  <div>
    <section v-if="preLoading" class="tx-c p-t-20 p-b-20">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <el-form v-else ref="form" size="mini" :model="form" :rules="rules" label-width="125px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="保养里程周期" prop="">
            <el-select v-model="form.mtMilCycle"
                        clearable
                        placeholder="请选择保养里程周期">
              <el-option
                v-for="item in maintainMileageCycleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下次保养里程" prop="">
            <el-input v-model.trim.number="form.nextMtMil">
              <template slot="append">KM</template>
            </el-input>
          </el-form-item>
          <el-form-item label="投保公司" prop="">
            <el-select v-model="form.insuranceCom"
                        clearable
                        placeholder="请选择投保公司">
              <el-option
                v-for="item in insuranceCompanyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保单号" prop="">
            <el-input v-model.trim="form.insuranceOrderNum"></el-input>
          </el-form-item>
          <el-form-item label="下次续保日期" prop="">
            <el-date-picker
              style="width: auto"
              v-model="form.nextInsuranceDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="年检周期" prop="">
            <el-select v-model="form.yearlyInsCycle"
                        clearable
                        placeholder="请选择年检周期">
              <el-option
                v-for="item in [{label: '1年', value: 1},{label: '2年', value:  2}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年检次数" prop="">
            <el-input v-model.trim="form.yearlyInsNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保养时间周期" prop="">
            <el-select v-model="form.mtCycle"
                        clearable
                        placeholder="请选择保养时间周期">
              <el-option
                v-for="item in [{label: '3个月', value: 3},{label: '6个月', value: 6},{label: '12个月', value: 12}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下次保养日期" prop="">
            <el-date-picker
              style="width: auto"
              v-model="form.nextMtDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="保险周期" prop="">
            <el-select v-model="form.insuranceCycle"
                        clearable
                        placeholder="请选择保险周期">
              <el-option
                v-for="item in [{label: '1年', value: 1}]"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保单生效日期" prop="">
            <el-date-picker
              style="width: auto"
              v-model="form.insuranceDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="办保次数" prop="">
            <el-input v-model.trim.number="form.insuranceNum"></el-input>
          </el-form-item>
          <el-form-item label="下次年检日期" prop="">
            <el-date-picker
              style="width: auto"
              v-model="form.nextYearlyInsDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择年检日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="m-t-40 tx-r" v-show="!preLoading">
      <el-button type="primary" @click="edit()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </div>
</template>
<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      changePartnername: null,
      deviceData: [],
      groupLoading: false,
      groupOptions: [],
      maintainMileageCycleOptions: [
        { label: '3000KM', value: 3000 },
        { label: '5000KM', value: 5000 },
        { label: '7000KM', value: 7000 },
        { label: '10000KM', value: 10000 },
      ],
      insuranceCompanyOptions: [
        { label: '中国人民财产保险股份有限公司', value: '中国人民财产保险股份有限公司' },
        { label: '中国太平洋财产保险股份有限公司', value: '中国太平洋财产保险股份有限公司' },
        { label: '中国平安财产保险股份有限公司', value: '中国平安财产保险股份有限公司' },
        { label: '中银保险有限公司', value: '中银保险有限公司' },
        { label: '华安财产保险股份有限公司', value: '华安财产保险股份有限公司' },
        { label: '中国大地财产保险股份有限公司', value: '中国大地财产保险股份有限公司' },
        { label: '中国太平保险集团', value: '中国太平保险集团' },
      ],
      form: {
        id: null,
        vehicleid: null,
        mtMilCycle: null,
        nextMtMil: null,
        mtCycle: null,
        nextMtDate: null,
        insuranceCom: null,
        insuranceCycle: null,
        insuranceOrderNum: null,
        insuranceDate: null,
        nextInsuranceDate: null,
        insuranceNum: null,
        yearlyInsCycle: null,
        nextYearlyInsDate: null,
        yearlyInsNum: null,
        insuranceStatus: null,
        yearlyStatus: null,
        mtStatus: null,
      },
      rules: {
        // carNumber: [{ required: true, message: '请输入车牌号' }],
        // vinNumber: [{ required: true, message: '请输入车架号' }],
        // brand: [{ required: true, message: '请输入车品牌' }],
        // carType: [{ required: true, message: '请输入车型号' }],
        // partnerId: [{ required: true, message: '请选择账号名称' }],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) return;
      this.$emit('close');
    },
  },
  beforeCreate() {
    this.getUrl = '/vehicle/queryVehicle';
    this.name = '/vehicle/addOrUpdateVehicleInfo';
  },
  methods: {
    async open(id) {
      this.id = id;
      this.resetForm();
      this.form.vehicleid = id;
      this.dialogVisible = true;
      this.preLoading = true;
      await this.getById();
      this.preLoading = false;
    },
    resetForm() {
      for (const i in this.form) {
        if (this.form[i] !== undefined) {
          this.form[i] = null;
        }
      }
    },
    getById() {
      return new Promise(async (resolve, reject) => {
        if (!this.id) return;
        try {
          const { data: { vehicleInfo } } = await this.apiPost(this.getUrl, { id: this.id });
          if (vehicleInfo) {
            for (const i in this.form) {
              if (vehicleInfo[i] !== undefined) {
                this.form[i] = vehicleInfo[i];
              }
            }
          }
          resolve(vehicleInfo);
        } catch (e) {
          reject(e);
        }
      });
    },
    edit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          let form = _g.cloneJson(this.form);
          if (typeof this.beforeEdit === 'function') {
            form = this.beforeEdit();
          }
          if (this.rejected_form) {
            _(this.rejected_form).forEach(val => delete form[val]);
          }
          this.isLoading = !this.isLoading;
          try {
            // form.id = this.id;
            await this.apiPost(this.name, form);
            _g.toastMsg('success', '保存成功');
            setTimeout(() => {
              this.isLoading = !this.isLoading;
              this.goback();
              this.$emit('init');
              this.afterEdit();
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
