<template>
  <el-dialog
      ref="dialog"
      title="分配权限"
      width="900px"
      top="60px"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-checkbox-group v-model="form.patternTypeIds">
        <el-checkbox :label="i.patternTypeId" v-for="(i, index) in data" :key="index">{{i.name}}</el-checkbox>
      </el-checkbox-group>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'childMenu',
        label: 'menuname',
      },
      form: {
        deviceTypeId: null,
        patternTypeIds: [],
      },
      rules: {
        login_name: [{ required: true, message: '请输入登录名' }],
      },
    };
  },
  computed: {},
  methods: {
    init() {},
    async open(deviceTypeId) {
      this.form.deviceTypeId = deviceTypeId;
      this.dialogVisible = true;
      this.preLoading = true;
      const { data } = await this.apiPost('/device/getDevicePatternTypeList', {});
      this.data = data;
      // this.menu = this.normalizeMenu(data);
      const { data: checkList } = await this.apiPost('/device/getDevicePatternType', { deviceTypeId });
      this.form.patternTypeIds = checkList.map(i => i.patternTypeId);
      this.preLoading = false;
      // this.setCheckedKeys(resource.data);
    },
    setCheckedKeys(data) {
      this.$nextTick(() => {
        const keys = data.map(item => item.menuid);
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    normalizeMenu(menu) {
      return menu.map((item) => {
        let child = [];
        item.menuid = item.m.menuid;
        item.menuname = item.m.menuname;
        if (item.childMenu instanceof Array && item.childMenu.length) {
          child = this.normalizeMenu(item.childMenu);
        }
        item.childMenu = child;
        return item;
      });
    },
    async add() {
      try {
        this.isLoading = true;
        await this.apiPost('/device/saveDevicePatternTypeDetails', this.form);
        _g.toastMsg('success', '分配成功');
        setTimeout(() => {
          this.isLoading = false;
          this.dialogVisible = false;
        }, 1000);
      } catch (e) {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .el-checkbox-group
    column-count 3
    .el-checkbox
      display block
      margin-left 0px
</style>
