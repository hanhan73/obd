<template>
  <div>
    <el-dialog
        ref="dialog"
        title="新增用户设备绑定"
        width="90%"
        top="50px"
        :append-to-body="true"
        :modal-append-to-body="false"
        :visible.sync="dialogVisible">
      <section v-if="preLoading" class="tx-c">
        <span class="fz-30 el-icon-loading"></span>
      </section>
      <section v-else>
        <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="150px" class="userDeviceBindForm">
          <div class="split-box">
            <span class="line"></span>
            <span class="text">车辆信息</span>
          </div>
          <el-form-item label="" prop="vehicle">
            <template slot="label">
              绑定车辆
              <el-button size="mini" class="inl-blo" @click="$refs.selectVehicle.open()">选择</el-button>
            </template>
            <el-table :data="vehicleData" size="mini">
              <el-table-column label="车架号" prop="vinnumber"></el-table-column>
              <el-table-column label="车牌号" prop="carnumber"></el-table-column>
              <el-table-column label="车品牌" prop="brand"></el-table-column>
              <el-table-column label="发动机号" prop="engNumber"></el-table-column>
              <el-table-column label="操作" width="85px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="vehicleData.splice(scope.$index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div class="split-box">
            <span class="line"></span>
            <span class="text">设备信息</span>
          </div>
          <el-form-item label="" prop="devices">
            <template slot="label">
              绑定设备
              <el-button size="mini" class="inl-blo" @click="$refs.selectDevices.open()">选择</el-button>
            </template>
            <el-table :data="devicesData" size="mini">
              <el-table-column type="index"></el-table-column>
              <el-table-column label="设备类型" prop="typename"></el-table-column>
              <el-table-column label="IMEI" prop="imei"></el-table-column>
              <!-- <el-table-column label="SN" prop="sn"></el-table-column> -->
              <el-table-column label="电话号码" prop="simphone"></el-table-column>
              <el-table-column label="ICCID" prop="iccid"></el-table-column>
              <el-table-column label="安装位置" min-width="150">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.position" placeholder="请输入安装位置"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" min-width="150">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.remark" placeholder="请输入备注"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="85px">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="devicesData.splice(scope.$index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <div class="split-box">
            <span class="line"></span>
            <span class="text">车主资料(可选填)</span>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="车主电话" prop="mobileno">
                <el-input v-model.trim="form.mobileno" class="w-200"></el-input>
                <div v-show="isGetUserInfo === true" class="c-green">
                  <i class="el-icon-circle-check"></i>
                  该手机号已注册
                </div>
                <div v-show="isGetUserInfo === false" class="c-red">
                  <i class="el-icon-circle-close"></i>
                  该手机未注册
                </div>
              </el-form-item>
              <div v-show="isGetUserInfo !== null">
                <el-form-item label="用户姓名" prop="name">
                  <el-input v-model.trim="form.name" class="w-200"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="idcard">
                  <el-input v-model.trim="form.idcard" class="w-200"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-show="isGetUserInfo !== null">
                <el-form-item label="用户密码" prop="password">
                  <el-input v-model.trim="form.password" class="w-200"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model.trim="form.email" class="w-200"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="省份" prop="provinceid">
                <el-select v-model="form.provinceid"
                          class="w-200"
                          popper-class="w-200"
                          placeholder="请选择省份"
                          @change="handleProvinceChange">
                  <el-option
                    v-for="item in provinceOptions"
                    :key="item.provinceId"
                    :label="item.province"
                    :value="item.provinceId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="城市" prop="cityid">
                <el-select v-model="form.cityid"
                          v-loading="cityLoading"
                          :disabled="cityDisabled"
                          clearable
                          class="w-200"
                          popper-class="w-200"
                          placeholder="请选择城市">
                  <el-option
                    v-for="item in cityOptions"
                    :key="item.cityId"
                    :label="item.cityName"
                    :value="item.cityId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="公司地址" prop="companyAddr">
            <template slot="label">
              公司地址
              <el-button size="mini" class="inl-blo" type="" @click="$refs.positionPicker.open('company')">选择</el-button>
            </template>
            <div class="m-t-10 dis-inl">
              <el-input v-model.trim="form.companyAddr" :disabled="true" class="w-300"></el-input>
              经度: <el-input v-model.trim="form.companyLon" :disabled="true" class="w-200"></el-input>
              纬度: <el-input v-model.trim="form.companyLat" :disabled="true" class="w-200"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="现住地址" prop="familyAddr">
            <template slot="label">
              现住地址
              <el-button size="mini" class="inl-blo" type="" @click="$refs.positionPicker.open('family')">选择</el-button>
            </template>
            <div class="m-t-10 dis-inl">
              <el-input v-model.trim="form.familyAddr" :disabled="true" class="w-300"></el-input>
              经度: <el-input v-model.trim="form.familyLon" :disabled="true" class="w-200"></el-input>
              纬度: <el-input v-model.trim="form.familyLat" :disabled="true" class="w-200"></el-input>
            </div>
          </el-form-item> -->
        </el-form>
      </section>
      <div slot="footer" v-show="!preLoading">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="add()" :loading="isLoading">绑定</el-button>
      </div>
    </el-dialog>
    <position-picker ref="positionPicker" @savePosition="handleSavePosition"></position-picker>
    <select-vehicle ref="selectVehicle" @saveVehicle="handleSaveVehicle" @saveDevices="handleSaveDevices"></select-vehicle>
    <select-devices ref="selectDevices" @saveDevices="handleSaveDevices"></select-devices>
  </div>
</template>

<script>
// import { lazyAMapApiLoaderInstance } from 'vue-amap';
import http from '@/assets/js/http';
import jsonp from '@/assets/js/jsonp';
import formMixin from '@/assets/js/form_com';

import PositionPicker from './position-picker';
import SelectVehicle from './select-vehicle';
import SelectDevices from './select-devices';

export default {
  mixins: [http, formMixin],
  components: {
    PositionPicker,
    SelectVehicle,
    SelectDevices,
  },
  data() {
    // const checkMobileno = async (rule, mobileno, callback) => {
    //   if (!mobileno) {
    //     this.isGetUserInfo = null;
    //     return callback(new Error('请输入车主电话'));
    //   }
    //   if (!this.$checkMobileNo(mobileno)) {
    //     this.isGetUserInfo = null;
    //     return callback(new Error('请输入合法的手机号码'));
    //   }
    //   if (this._mobileno !== mobileno) {
    //     this._mobileno = mobileno;
    //     try {
    //       await this.apiPost('/userDevice/getUserInfoByMobile', { mobileno },
    //            ({ data, retCode }) => {
    //         if (retCode === 0) {
    //           this.isGetUserInfo = true;
    //           this.form.userid = data.id;
    //           this.form.name = data.name;
    //           this.form.sex = data.sex;
    //           this.form.password = data.pwdtext;
    //           this.form.email = data.email;
    //           this.form.idcard = data.idcard;
    //         } else {
    //           this.isGetUserInfo = false;
    //           this.form.userid = null;
    //           this.form.name = null;
    //           this.form.sex = null;
    //           this.form.password = null;
    //           this.form.email = null;
    //           this.form.idcard = null;
    //         }
    //       });
    //       return callback();
    //     } catch (e) {
    //       this.isGetUserInfo = false;
    //       return callback();
    //     }
    //   }
    //   return callback();
    // };
    const checkDevices = (rule, value, callback) => {
      if (!this.devicesData.length) {
        return callback(new Error('请选择设备'));
      }
      if (!this.vehicleData.length) {
        return callback();
      }
      // const [{ partnerid }] = this.vehicleData;
      const arr = [];
      // this.devicesData.forEach((item) => {
      //   if (item.partnerid !== partnerid) {
      //     arr.push(item.imei);
      //   }
      // });
      // if (arr.length) {
      //   return callback(new Error(`设备:IMEI【${arr.join(', ')}】 与当前选择的车辆不在同一个账号名称下`));
      // }
      this.devicesData.forEach(({ imei, position }) => {
        if (position === undefined || position.trim() === '') {
          arr.push(`IMEI: ${imei}的安装位置不能为空`);
        }
      });
      if (arr.length) {
        return callback(new Error(arr.join(', ')));
      }
      return callback();
    };
    const checkVehicle = (rule, value, callback) => {
      if (!this.vehicleData.length) {
        return callback(new Error('请选择车辆'));
      }
      return callback();
    };
    // const checkCompanyAddr = (rule, value, callback) => {
    //   const { companyAddr, companyLon, companyLat } = this.form;
    //   if (!companyAddr || !companyLon || !companyLat) {
    //     return callback(new Error('请完善公司地址'));
    //   }
    //   return callback();
    // };
    // const checkFamilyAddr = (rule, value, callback) => {
    //   const { familyAddr, familyLon, familyLat } = this.form;
    //   if (!familyAddr || !familyLon || !familyLat) {
    //     return callback(new Error('请完善家庭地址'));
    //   }
    //   return callback();
    // };
    return {
      isGetUserInfo: null,
      vehicleData: [],
      devicesData: [],
      provinceOptions: [],
      cityOptions: [],
      cityLoading: false,
      cityDisabled: false,
      form: {
        userid: null,
        name: null,
        sex: null,
        idcard: null,
        password: null,
        email: null,
        mobileno: null,
        provinceid: null,
        cityid: null,
        vehicleid: null,
        sns: null,
        devicepositions: null,
        deviceremarks: null,
        activestatus: null,
        companyAddr: null,
        companyLon: null,
        companyLat: null,
        familyAddr: null,
        familyLon: null,
        familyLat: null,
        devices: null,
        vehicle: null,
      },
      rules: {
        // mobileno: [{ required: true, validator: checkMobileno, trigger: 'blur' }],
        // provinceid: [{ required: true, message: '请选择省份' }],
        // cityid: [{ required: true, message: '请选择城市' }],
        // name: [{ required: true, message: '请输入姓名' }],
        // sex: [{ required: true, message: '请选择性别' }],
        // password: [{ required: true, message: '请输入密码' }],
        // idcard: [{ required: true, message: '请输入身份证' }],
        // email: [{ required: true, message: '请输入邮箱' }],
        devices: [{ required: true, validator: checkDevices, trigger: 'blur' }],
        vehicle: [{ required: true, validator: checkVehicle, trigger: 'blur' }],
        // companyAddr: [{ required: true, validator: checkCompanyAddr, trigger: 'blur' }],
        // familyAddr: [{ required: true, validator: checkFamilyAddr, trigger: 'blur' }],
      },
    };
  },
  computed: {},
  beforeCreate() {
    this.name = '/userDevice/bindUserVehicleDevice';
  },
  methods: {
    open(vehicle, devices, userPhone) {
      this.resetForm();
      this.dialogVisible = true;
      if (vehicle && typeof vehicle === 'object') {
        const { carNumber, vinNumber, brand, engNumber, id, partnerId } = vehicle;
        this.handleSaveVehicle({
          vehicleid: id,
          carnumber: carNumber,
          vinnumber: vinNumber,
          brand,
          engNumber,
          partnerid: partnerId,
        });
        this.form.vehicleid = id;
      }
      if (devices instanceof Array && devices.length) {
        this.handleSaveDevices(devices);
      }
      if (userPhone) {
        this.form.mobileno = userPhone;
        this.$nextTick(() => {
          this.$refs.form.validateField('mobileno', () => {});
        });
      }
    },
    async init() {
      const { data } = await jsonp(
        'http://base.mltcloud.com/base/rest/city/queryProvinceList',
        {},
        { param: 'jsoncallback' },
      );
      this.provinceOptions = data.filter(i => i.provinceId !== 0);
    },
    async handleProvinceChange(proId) {
      this.form.cityid = null;
      this.cityLoading = true;
      try {
        const { data } = await jsonp(
          'http://base.mltcloud.com/base/rest/city/queryCityListByPId',
          { proId },
          { param: 'jsoncallback' },
        );
        this.cityOptions = data;
      } finally {
        this.cityLoading = false;
      }
    },
    handleSavePosition({ position: { lng, lat, address }, addressType }) {
      this.form[`${addressType}Lon`] = lng;
      this.form[`${addressType}Lat`] = lat;
      this.form[`${addressType}Addr`] = address;
    },
    handleSaveVehicle(vehicle) {
      this.vehicleData = [vehicle];
      this.form.vehicleid = vehicle.id;
    },
    handleSaveDevices(devices) {
      this.devicesData = this.devicesData.concat(
        R.differenceWith((x, y) => x.id === y.id, devices)(this.devicesData),
      );
    },
    add() {
      this.form.sns = this.devicesData.map(i => i.sn).join(',');
      this.form.devicepositions = this.devicesData.map(i => i.position).join(',');
      this.form.deviceremarks = this.devicesData.map(i => (i.remark === '' || i.remark === undefined ? '-' : i.remark)).join(',');

      this.$refs.form.validate(async (pass) => {
        if (pass) {
          this.isLoading = !this.isLoading;
          const form = this.form;
          try {
            const { retCode } = await this.apiPost(this.name, form);
            if (retCode === 0) {
              _g.toastMsg('success', '添加成功');
              setTimeout(() => {
                this.$emit('init', this.form.vehicleid);// 在线监控刷新设备需要新增后的车辆ID
                this.resetForm();
                this.isLoading = !this.isLoading;
                this.goback();
              }, 1000);
            } else {
              switch (retCode) {
                case -1:
                  _g.toastMsg('error', '该手机号已注册');
                  break;
                case -344:
                  _g.toastMsg('error', '该身份证已注册');
                  break;
                default:
                  _g.toastMsg('error', '系统繁忙, 请稍后再试');
              }
              this.isLoading = !this.isLoading;
            }
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    resetForm() {
      if (this.$refs.form) this.$refs.form.resetFields();
      this.isGetUserInfo = null;
      this.form.mobileno = null;
      this.form.companyLon = null;
      this.form.companyLat = null;
      this.form.familyLon = null;
      this.form.familyLat = null;
      this.vehicleData = [];
      this.devicesData = [];
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
