<template>
  <div>
    <section v-if="preLoading" class="tx-c p-t-20 p-b-20">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <el-form v-else ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="车牌号" prop="carNumber">
            <el-input v-model.trim="form.carNumber" class="h-40 w-200"></el-input>
          </el-form-item>
          <el-form-item label="账号名称" prop="partnerId">
            <!-- <el-select v-model="form.partnerId"
                        class="w-200"
                        popper-class="w-200"
                        placeholder="请选择账号名称"
                        @change="handleChange">
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
              v-model="partnerid"
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
          <el-form-item label="车牌号" prop="">
            <el-input v-model.trim="form.brand" class="h-40 w-200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车主电话" prop="userPhone">
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
    <div v-show="showConfirm">
      <el-alert
        class="m-t-5 m-b-5"
        :title="`由于改变账号名称为${changePartnername}, 是否将以下设备或车辆更换为${changePartnername}?`"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-table
        :header-row-style="{ background: '#f5f7fa' }"
        v-show="deviceData.length"
        class="m-t-5"
        :data="deviceData">
        <el-table-column
          prop="date"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="imei"
          label="设备IMEI">
        </el-table-column>
        <el-table-column
          prop="typecode"
          label="设备类型">
        </el-table-column>
      </el-table>
      <div class="m-t-15 tx-r">
        <el-button type="primary" @click="form.bindtype = 0;edit()" :loading="isLoading && form.bindtype === 0" :disabled="isLoading && form.bindtype === 1">确认更改</el-button>
        <el-button type="danger" @click="form.bindtype = 1;edit()" :loading="isLoading && form.bindtype === 1" :disabled="isLoading && form.bindtype === 0">不改动,解除绑定</el-button>
        <el-button @click="handleGiveUpChange">放弃更改</el-button>
      </div>
    </div>
    <div class="m-t-40 tx-r" v-show="!preLoading && !showConfirm">
      <el-button type="primary" @click="edit()" :loading="isLoading">确定</el-button>
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
  data() {
    return {
      partnerid: [],
      changePartnername: null,
      showConfirm: false,
      showConfirmLoading: false,
      deviceData: [],
      groupLoading: false,
      groupOptions: [],
      form: {
        carNumber: null,
        vinNumber: null,
        brand: null,
        carType: null,
        engNumber: null,
        chaNumber: null,
        partnerId: null,
        groupId: null,
        bindtype: null,
        userPhone: null,
        userName: null,
        userId: null,
      },
      rules: {
        carNumber: [{ required: true, message: '请输入车牌号' }],
        vinNumber: [{ required: true, message: '请输入车架号' }],
        brand: [{ required: true, message: '请输入车品牌' }],
        carType: [{ required: true, message: '请输入车型号' }],
        partnerId: [{ required: true, message: '请选择账号名称' }],
        // userPhone: [{ required: true, validator: checkMobileno, trigger: 'blur' }],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) return;
      this.$emit('close');
    },
    partnerid(newValue) {
      let partnerId = null;
      if (newValue.length) {
        partnerId = newValue[newValue.length - 1];
      }
      this.form.partnerId = partnerId;
      this.handleChange(partnerId);
    },
  },
  computed: {
    ...mapGetters(['partnersTree', 'partners']),
  },
  beforeCreate() {
    this.getUrl = '/vehicle/queryVehicle';
    this.name = '/vehicle/addOrUpdateVehicle';
  },
  methods: {
    async open(id) {
      this.showConfirm = false;
      this.id = id;
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchPartners(true);
      await this.getById();
      this.setPartnerId();
      if (this.form.partnerId === 0) this.form.partnerId = null;
      this._partnerid = this.form.partnerId;
      if (this.form.partnerId) {
        const { data } = await this.apiPost('/vehicle/getAllGroups', { partnerId: this.form.partnerId });
        this.groupOptions = data;
      }
      this.preLoading = false;
    },
    setPartnerId() {
      const findPartner = (data) => {
        const partnerId = [];
        data.forEach((item) => {
          if (partnerId.length) return false;
          if (item.id === this.form.partnerId) {
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
      this.partnerid = findPartner(this.partnersTree);
    },
    afterEdit() {
      this.showConfirm = false;
    },
    async handleChange(partnerId) {
      this.form.groupId = null;
      this.groupLoading = true;
      const { data } = await this.apiPost('/vehicle/getAllGroups', { partnerId });
      this.groupOptions = data;
      this.groupLoading = false;

      // if (partnerId !== this._partnerid) {
      //   const vehicleid = this.id;
      //   this.changePartnername = this.partners[
      //     this.partners.findIndex(i => i.id === partnerId)
      //   ].partnername;
      //   try {
      //     this.showConfirmLoading = true;
      //     const { data: deviceData } =
      // await this.apiPost('/userDevice/getVehicleDevice', { vehicleid });
      //     this.deviceData = deviceData;
      //     if (deviceData.length) {
      //       this.showConfirm = true;
      //     }
      //   } finally {
      //     this.showConfirmLoading = false;
      //   }
      // } else if (partnerId === this._partnerid) {
      //   this.showConfirm = false;
      // }
    },
    handleGiveUpChange() {
      this.showConfirm = false;
      this.form.bindtype = null;
      this.dialogVisible = false;
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
