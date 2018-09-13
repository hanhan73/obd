<template>
  <el-dialog
    id="vehicleDataDialog"
    custom-class="vehicle-data-dialog"
    ref="dialog"
    width="60%"
    :append-to-body="true"
    :modal-append-to-body="false"
    :visible.sync="dialogVisible">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="deviceEditForm" class="p-t-30">
        <device-edit-form ref="deviceEditForm" @close="dialogVisible = false" @init="$emit('init')" @setVehicleId="(val) => vehicleid = val"></device-edit-form>
      </el-tab-pane>
      <!-- <el-tab-pane v-if="vehicleid !== null && vehicleid !== ''" label="车辆信息" name="vehicleEditForm" class="p-t-30">
        <vehicle-edit-form ref="vehicleEditForm" @close="dialogVisible = false" @init="$emit('init')"></vehicle-edit-form>
      </el-tab-pane>
      <el-tab-pane v-else label="新增车辆信息" name="vehicleAddForm">
        <div class="p-b-10 tx-l">
          <el-button type="primary" size="mini" icon="el-icon-plus" plain @click="handleBindOtherVehicle">绑定已有车辆</el-button>
        </div>
        <vehicle-add-form ref="vehicleAddForm" :default-partnerid="partnerid" @close="dialogVisible = false" @init="handleAddDevice"></vehicle-add-form>
      </el-tab-pane>
      <el-tab-pane label="生命周期" name="lifeCycleForm">
        <life-cycle ref="lifeCycleForm"></life-cycle>
      </el-tab-pane>
      <el-tab-pane label="安装照片" name="installPhotoForm">
        <install-photo ref="installPhotoForm"></install-photo>
      </el-tab-pane> -->
    </el-tabs>
    <bind-vehicle ref="bindVehicle" @init="handleAddDevice"></bind-vehicle>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import DeviceEditForm from 'views/device/edit-form';
import VehicleEditForm from 'views/vehicle/edit-form';
import VehicleAddForm from 'views/vehicle/add-form';
import BindVehicle from 'views/userDevice/add';
import LifeCycle from './vehicle-data-life-cycle';
import InstallPhoto from './install-photo';

const schemaHash = {
  deviceEditForm: 'deviceid',
  vehicleEditForm: 'vehicleid',
  vehicleAddForm: ['isAddDevice', 'sn'],
  lifeCycleForm: 'sn',
  installPhotoForm: 'deviceid',
};

export default {
  mixins: [http],
  data() {
    return {
      dialogVisible: false,
      activeName: 'deviceEditForm',
      deviceid: null,
      vehicleid: null,
      partnerid: null,
    };
  },
  methods: {
    open(r) {
      this.dialogVisible = true;
      // this.deviceid = deviceid;
      // this.vehicleid = vehicleid;
      // this.sn = sn;
      // this.partnerid = partnerid;
      // this.isAddDevice = vehicleid === null || vehicleid === '';
      this.activeName = 'deviceEditForm';
      // this.cache = [this.activeName];
      this.$nextTick(() => {
        this.$refs.deviceEditForm.open(r);
      });
    },
    handleTabClick({ name }) {
      if (this.cache.indexOf(name) !== -1) return;
      this.$refs[name].open(..._.at(this, schemaHash[name]));
      this.cache.push(name);
    },
    handleAddDevice(vehicleid) {
      this.$emit('init', vehicleid);
      this.dialogVisible = false;
    },
    async handleBindOtherVehicle() {
      const sn = this.sn;
      try {
        const { data: [device] } = await this.apiPost('/device/getDeviceList', { sn });
        this.$refs.bindVehicle.open(null, [device]);
      } catch (e) {
        //
      }
    },
  },
  components: {
    DeviceEditForm,
    VehicleEditForm,
    VehicleAddForm,
    BindVehicle,
    LifeCycle,
    InstallPhoto,
  },
};
</script>

<style lang="stylus">
  .vehicle-data-dialog
    .el-dialog__body
      padding-top: 0px
      padding-bottom: 15px
</style>

