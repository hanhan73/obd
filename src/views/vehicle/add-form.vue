<template>
  <div>
    <section v-if="preLoading" class="tx-c p-b-20">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <el-form v-else ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="isAddDevice" label="安装位置" prop="devicepositions">
            <el-input v-model.trim="form.devicepositions" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="carNumber">
            <el-input v-model.trim="form.carNumber" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="账号名称" prop="partnerId">
            <!-- <el-select v-model="form.partnerId"
                        clearable
                        class="w-200"
                        popper-class="w-200"
                        placeholder="请选择账号名称"
                        @change="handleChange"
                        @clear="handleClear">
              <el-option
                v-for="item in partners"
                :key="item.id"
                :label="item.partnername"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-cascader
              class="w-200"
              placeholder="请选择账号名称"
              v-model="partnerId"
              :options="partnersTree"
              :props="{label: 'partnername', value: 'id', children: '_children'}"
              filterable
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
          <el-form-item label="分组名" prop="groupId">
            <el-select v-model="form.groupId"
                        :disabled="form.partnerId === null"
                        v-loading="groupLoading"
                        clearable
                        class="w-200"
                        popper-class="w-200"
                        placeholder="请选择分组">
              <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车架号" prop="">
            <el-input v-model.trim="form.vinNumber" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="车品牌" prop="">
            <el-input v-model.trim="form.brand" class="h-40 w-200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车主电话" prop="">
            <el-input v-model.trim="form.userPhone" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="车主姓名" prop="userName">
            <el-input v-model.trim="form.userName" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="发动机号" prop="engNumber">
            <el-input v-model.trim="form.engNumber" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="车型号" prop="">
            <el-input v-model.trim="form.carType" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="底盘号" prop="chaNumber">
            <el-input v-model.trim="form.chaNumber" class="h-40 w-200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="m-t-40 tx-r" v-show="!preLoading">
      <el-button type="primary" @click="add()" :loading="isLoading">{{isAddDevice ? '快速绑定' : '确定'}}</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  props: {
    defaultPartnerid: {
      type: Number,
      default: null,
    },
  },
  data() {
    const checkMobileno = async (rule, mobileno, callback) => {
      if (!mobileno) {
        return callback(new Error('请输入车主电话'));
      }
      if (!this.$checkMobileNo(mobileno)) {
        return callback(new Error('请输入合法的手机号码'));
      }
      if (this._mobileno !== mobileno) {
        this._mobileno = mobileno;
        try {
          let msg = null;
          await this.apiPost('/userDevice/getUserInfoByMobile', { mobileno }, ({ retCode }) => {
            if (retCode === 0) {
              msg = new Error('该手机号已存在');
            }
          });
          return callback(msg);
        } catch (e) {
          return callback();
        }
      }
      return callback();
    };
    return {
      partnerId: [],
      isAddDevice: false,
      groupLoading: false,
      groupOptions: [],
      form: {
        carNumber: null,
        vinNumber: null,
        brand: null,
        carType: null,
        engNumber: null,
        chaNumber: null,
        partnerId: Number(Lockr.get('partnerid')) || null,
        groupId: null,
        userPhone: null,
        userName: null,
        devicepositions: null,
      },
      rules: {
        carNumber: [{ required: true, message: '请输入车牌号' }],
        vinNumber: [{ required: true, message: '请输入车架号' }],
        brand: [{ required: true, message: '请输入车品牌' }],
        carType: [{ required: true, message: '请输入车型号' }],
        partnerId: [{ required: true, message: '请选择账号名称' }],
        devicepositions: [{ required: true, message: '请输入安装位置' }],
        userPhone: [{ required: true, validator: checkMobileno, trigger: 'blur' }],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) return;
      this.$emit('close');
    },
    async partnerId(newValue) {
      if (newValue.length) {
        const partnerId = newValue[newValue.length - 1];
        this.form.partnerId = partnerId;
        this.handleChange(partnerId);
      } else {
        this.handleClear();
      }
    },
  },
  computed: {
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/vehicle/addOrUpdateVehicle';
  },
  methods: {
    init() {},
    async open(isAddDevice = false, sn) {
      this.dialogVisible = true;
      await this.fetchPartners(true);
      this.setDefaultPartnerid();
      this.isAddDevice = isAddDevice;
      this.sn = sn;
    },
    setDefaultPartnerid() {
      if (this.defaultPartnerid) {
        const findPartner = (data) => {
          const partnerId = [];
          data.forEach((item) => {
            if (partnerId.length) return false;
            if (item.id === this.defaultPartnerid) {
              partnerId.push(item.id);
            } else if (item._children) {
              const temp = findPartner(item._children);
              if (temp.length) {
                partnerId.push(item.id, ...temp);
              }
            }
            return true;
          });
          return partnerId;
        };
        this.partnerId = findPartner(this.partnersTree);
      }
    },
    async handleChange(partnerId) {
      this.form.groupId = null;
      this.groupLoading = true;
      const { data } = await this.apiPost('/vehicle/getAllGroups', { partnerId });
      this.groupOptions = data;
      this.groupLoading = false;
    },
    add() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          this.isLoading = !this.isLoading;
          let form = this.form;
          if (typeof this.beforeAdd === 'function') {
            form = this.beforeAdd();
          }
          try {
            let vehicleid = null;
            const data = await this.apiPost(this.name, form);
            if (this.isAddDevice) {
              const { data: { id, userid } } = data;
              vehicleid = id;
              const devicepositions = this.form.devicepositions;
              await this.apiPost('/userDevice/bindUserVehicleDevice', {
                vehicleid,
                userid: userid || null,
                devicepositions,
                mobileno: this.form.userPhone,
                deviceremarks: '',
                sns: this.sn,
              });
            }
            _g.toastMsg('success', '新增成功');
            setTimeout(() => {
              if (typeof this.afterAdd === 'function') {
                this.afterAdd(data);
              }
              this.$emit('init', vehicleid);// 在线监控刷新设备需要新增后的车辆ID
              if (this.$refs.form) this.$refs.form.resetFields();
              this.isLoading = !this.isLoading;
              this.goback();
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    handleClear() {
      this.form.partnerId = null;
      this.form.groupId = null;
      this.groupOptions = [];
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
