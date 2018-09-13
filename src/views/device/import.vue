<template>
  <el-dialog
      ref="dialog"
      title="导入设备"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号名称" prop="">
          <el-cascader
            style="margin: 2px 5px 0 0"
            placeholder="请选择账号名称"
            v-model="backUserId"
            :options="partnersTree"
            :props="{label: 'username', value: 'id', children: '_children'}"
            filterable
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="form.deviceType"
                      clearable
                      placeholder="请选择设备类型">
            <el-option
              v-for="item in deviceType"
              :key="item.id"
              :label="item.deviceModel"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务年限" prop="serviceLife">
          <el-radio-group v-model="form.serviceLife" >
            <el-radio-button label="1">1年</el-radio-button>
            <el-radio-button label="2">2年</el-radio-button>
            <el-radio-button label="3">3年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导入文件" prop="file">
          <el-upload
            class="upload"
            ref="upload"
            :show-file-list="false"
            :data="form"
            :action="action"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">
              为确保导入信息准确，请点击“下载Excel模板”将填写标准的信息，录入到Excel列表中。
              <a class="c-blue a-text-deco" :href="downTemplate">下载Excel模板</a>
            </div>
          </el-upload>
          <p v-for="(i, index) in fileList" :key="index">
            <i class="el-icon-document"></i>
            {{i.name}}
          </p>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="submitUpload" :loading="isLoading">确定</el-button>
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
    const validateFile = (rule, value, callback) => {
      if (!this.fileList.length) {
        callback(new Error('请选择文件'));
      }
      callback();
    };
    return {
      backUserId: [],
      deviceType: [],
      fileList: [],
      form: {
        deviceType: null,
        backUserId: null,
        serviceLife: null,
        tokenId: Lockr.get('tokenId'),
      },
      rules: {
        deviceType: [{ required: true, message: '请选择设备类型' }],
        serviceLife: [{ required: true, message: '请选择服务年限' }],
        backUserId: [{ required: true, message: '请选择账号名称' }],
        file: [{ required: true, validator: validateFile }],
      },
    };
  },
  watch: {
    backUserId(newValue) {
      if (newValue.length) {
        this.form.backUserId = newValue[newValue.length - 1];
      } else {
        this.form.backUserId = null;
        this.form.groupId = null;
      }
    },
  },
  computed: {
    action() {
      return `${HOST}/device/importDevice`;
    },
    downTemplate() {
      return `${HOST}/excel/import_device.xls`;
    },
    ...mapGetters(['partnersTree']),
  },
  methods: {
    init() {},
    async open() {
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchPartners(true);
      const { data } = await this.apiPost('/device/findAllDeviceType', {});
      this.deviceType = data;
      this.preLoading = false;
    },
    submitUpload() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true;
          this.$refs.upload.submit();
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleSuccess(response) {
      // response = response.replace(/^<body>(.*)<\/body>$/, '$1');
      try {
        // response = JSON.parse(response);
        if (response.retCode !== 0) {
          this.$alert(response.message, '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback() {},
          });
        } else {
          _g.toastMsg('success', '导入成功');
          setTimeout(() => {
            this.dialogVisible = false;
            this.clearCache();
            this.$emit('init');
          }, 1000);
          return;
        }
        this.clearCache();
      } catch (e) {
        //
      }
    },
    clearCache() {
      this.isLoading = false;
      this.fileList = [];
      this.$refs.upload.clearFiles();
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
