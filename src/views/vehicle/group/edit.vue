<template>
  <el-dialog
      custom-class="w-700"
      ref="dialog"
      title="编辑分组"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号名称" prop="partnerId">
              <el-select v-model="form.partnerId"
                          @change="handlePartnerIdChange"
                          clearable
                          class="w-200"
                          popper-class="w-200"
                          placeholder="请选择账号名称">
                <el-option
                  v-for="item in partners"
                  :key="item.id"
                  :label="item.partnername"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="分组名称" prop="name">
              <el-input v-model.trim="form.name" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkName">
              <el-input v-model.trim="form.linkName" class="h-40 w-200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkMobile">
              <el-input v-model.trim="form.linkMobile" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="form.remark"
                        class="h-40 w-200"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-alert
        class="m-t-10"
        v-show="showAlert"
        title="由于更改账号名称, 车组相关联车辆及设备一同更改账号名称"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="edit()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    const checkMobileno = async (rule, mobileno, callback) => {
      if (!mobileno) {
        return callback(new Error('请输入车主电话'));
      }
      if (!this.$checkMobileNo(mobileno)) {
        return callback(new Error('请输入合法的手机号码'));
      }
      return callback();
    };
    return {
      showAlert: false,
      form: {
        partnerId: null,
        name: null,
        linkName: null,
        linkMobile: null,
        remark: null,
        bindType: null,
      },
      rules: {
        partnerId: [{ required: true, message: '请选择账号名称' }],
        name: [{ required: true, message: '请输入分组名称' }],
        linkName: [{ required: true, message: '请输入联系人' }],
        linkMobile: [{ required: true, validator: checkMobileno }],
      },
    };
  },
  computed: {
    ...mapGetters(['partners']),
  },
  beforeCreate() {
    this.name = '/vehicle/addOrUpdateGroup';
    this.getUrl = '/vehicle/queryGroup';
  },
  methods: {
    init() {

    },
    async open(id) {
      this.id = id;
      this.showAlert = false;
      this.form.bindType = null;
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchPartners();
      await this.getById();
      this._partnerid = this.form.partnerId;
      this.preLoading = false;
    },
    handlePartnerIdChange(val) {
      if (val !== this._partnerid) {
        this.showAlert = true;
        this.form.bindType = 0;
      } else {
        this.showAlert = false;
        this.form.bindType = null;
      }
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
