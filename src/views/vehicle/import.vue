<template>
  <el-dialog
      ref="dialog"
      width="700px"
      title="导入车辆"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分组" prop="groupIds">
          <el-select v-model="form.groupIds"
                      clearable
                      class="w-200"
                      popper-class="w-200"
                      placeholder="请选择分组">
            <el-option
              v-for="item in groupsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
      fileList: [],
      form: {
        groupIds: null,
      },
      rules: {
        groupIds: [{ required: true, message: '请选择分组' }],
        file: [{ required: true, validator: validateFile }],
      },
    };
  },
  computed: {
    groupsOptions() {
      return this.groups.map(item => (
        {
          id: item.id,
          name: `${item.partnerName}: ${item.name}`,
        }
      ));
    },
    action() {
      return `${HOST}/vehicle/importVehicle`;
    },
    downTemplate() {
      return `${HOST}/excel/import_vehicle.xls`;
    },
    ...mapGetters(['groups']),
  },
  methods: {
    init() {},
    beforeOpen() {
      this.fetchGroups();
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
      response = response.replace(/^<body>(.*)<\/body>$/, '$1');
      try {
        response = JSON.parse(response);
        if (response.message) {
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
    ...mapActions([
      'fetchGroups',
    ]),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
