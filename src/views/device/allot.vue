<template>
  <el-dialog
      custom-class="w-400"
      ref="dialog"
      title="分配设备"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="账号名称" prop="partnerid">
          <!-- <el-select v-model="form.partnerid"
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
      </el-form>
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

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      partnerId: [],
      deviceType: [],
      form: {
        ids: null,
        partnerid: null,
      },
      rules: {
        partnerid: [{ required: true, message: '请选择账号名称' }],
      },
    };
  },
  watch: {
    partnerId(newValue) {
      if (newValue.length) {
        this.form.partnerid = newValue[newValue.length - 1];
      } else {
        this.form.partnerid = null;
      }
    },
  },
  computed: {
    ...mapGetters(['partnersTree']),
  },
  beforeCreate() {
    this.name = '/device/distributionPartner';
  },
  methods: {
    init() {
    },
    async open(ids) {
      this.dialogVisible = true;
      this.preLoading = true;
      await this.fetchPartners();
      this.form.ids = ids;
      this.preLoading = false;
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
            const data = await this.apiPost(this.name, form);
            _g.toastMsg('success', '分配成功');
            setTimeout(() => {
              if (typeof this.afterAdd === 'function') {
                this.afterAdd(data);
              }
              // if (this.$refs.form) this.$refs.form.resetFields();
              this.partnerId = [];
              this.isLoading = !this.isLoading;
              this.goback();
              this.$emit('init');
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
