<template>
  <el-dialog
      ref="dialog"
      title="新增电子围栏"
      custom-class="w-800"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      @close="handleClose">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else class="addFenceWrapper">
      <!-- <div>
        <el-tree
          style="max-height: 300px; overflow-y: auto;border: 1px solid #ccc;"
          ref="tree"
          show-checkbox
          node-key="id"
          :data="data"
          :default-expanded-keys="[]"
          :default-checked-keys="[]"
          :props="defaultProps">
        </el-tree>
      </div> -->
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="围栏名称" prop="desc">
          <el-input v-model.trim="form.desc" class="h-40 w-200"></el-input>
        </el-form-item>
        <el-form-item label="围栏类型" prop="mindType">
          <el-checkbox-group v-model="form.mindType">
            <el-checkbox :label="1">进入围栏</el-checkbox>
            <el-checkbox :label="2">离开围栏</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';
// import PartnerMixin from '@/assets/js/partner_com';

export default {
  mixins: [
    http,
    formMixin,
    // PartnerMixin,
  ],
  data() {
    return {
      form: {
        fenceType: 0,
        desc: null,
        mindType: [],
        gsmsn: null,
        'circle.lng': null,
        'circle.lat': null,
        'circle.redius': null,
      },
      rules: {
        desc: [{ required: true, message: '请输入围栏名称' }],
        mindType: [{ required: true, message: '请输入围栏类型' }],
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/addUserFence';
  },
  computed: {},
  methods: {
    init() {
    },
    async open({ sn, lng, lat, radius }) {
      this.dialogVisible = true;
      this.preLoading = true;
      this.form.gsmsn = sn;
      this.form['circle.lng'] = lng;
      this.form['circle.lat'] = lat;
      this.form['circle.redius'] = parseInt(radius, 10);
      // const { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
      // this.data = this.normalizePartner(data);
      this.preLoading = false;
    },
    beforeAdd() {
      // let vIds = this.$refs.tree.getCheckedKeys();
      // vIds = vIds.filter(i => typeof i === 'string' && i.substring(0, 1) === 'n')
      //   .map(i => parseInt(i.substring(2), 10));
      // if (!vIds.length) {
      //   this.isLoading = false;
      //   return _g.toastMsg('warning', '所选分组无设备在内');
      // }
      // const { data } = await this.apiPost('/device/qryDeviceDataByVIds', { vIds });
      // this.form.sns = data.filter(i => i.sn !== '').map(i => i.sn);

      const form = _.cloneDeep(this.form);
      if (this.form.mindType.length > 1) {
        form.mindType = 0;
      }
      return form;
    },
    handleClose() {
      //
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  // .addFenceWrapper
  //   display: flex
  //   >div
  //     flex: 0 0 50%
</style>
