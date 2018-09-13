<template>
  <el-dialog
      ref="dialog"
      size="small"
      top="60px"
      :title="`新增区域围栏: ${currentArea.provinceName}-${currentArea.cityName}`"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-tree
        ref="tree"
        show-checkbox
        node-key="id"
        :data="data"
        :default-expanded-keys="[]"
        :default-checked-keys="[]"
        :props="defaultProps">
      </el-tree>
      <div class="tx-c m-t-20">
        <el-button class="w-100" type="primary" @click="add()" :loading="isLoading">确定</el-button>
        <el-button class="w-100" @click="dialogVisible = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';
import PartnerMixin from '@/assets/js/partner_com';

export default {
  mixins: [http, formMixin, PartnerMixin],
  // props: {
  //   currentArea: {
  //     type: Object,
  //     default() {
  //       return {};
  //     },
  //   },
  // },
  data() {
    return {
      currentArea: {
        provinceName: null,
        cityName: null,
      },
      data: [],
      form: {
        fenceType: 1,
        mindType: 1,
        desc: null,
        sns: null,
        pois: null,
      },
      rules: {
      },
    };
  },
  computed: {},
  methods: {
    init() {},
    async open(coordinates, currentArea) {
      this.currentArea = currentArea;
      this.form.pois = JSON.stringify(
        coordinates.map(
          ({ lng, lat }) => ({ lng, lat }),
        ),
      );
      this.form.desc = this.currentArea.cityName;
      this.dialogVisible = true;
      this.preLoading = true;
      const { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
      this.data = this.normalizePartner(data);
      this.preLoading = false;
    },
    async add() {
      this.isLoading = true;

      try {
        let vIds = this.$refs.tree.getCheckedKeys();
        vIds = vIds.filter(i => typeof i === 'string' && i.substring(0, 1) === 'n').map(i => parseInt(i.substring(2), 10));
        if (!vIds.length) {
          this.isLoading = false;
          return _g.toastMsg('warning', '所选分组无设备在内');
        }
        const { data } = await this.apiPost('/device/qryDeviceDataByVIds', { vIds });
        this.form.sns = data.filter(i => i.sn !== '').map(i => i.sn);
        if (!this.form.sns.length) {
          this.isLoading = false;
          return _g.toastMsg('warning', '所选分组无设备在内');
        }

        await this.apiPost('/fence/addUserFence', this.form);
        _g.toastMsg('success', '新增成功');
        setTimeout(() => {
          this.isLoading = false;
          this.dialogVisible = false;
        }, 1000);
      } catch (e) {
        this.isLoading = false;
      }
      return null;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
