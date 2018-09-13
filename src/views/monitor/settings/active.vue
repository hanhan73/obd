<template>
  <section class="settings-wrapper">
    <!-- <el-alert
      title="提示：请确认该设备支持该项指令设置。"
      type="warning"
      center
      close-text="知道了"
      class="m-b-10"
      show-icon>
      <span v-show="disabledSend" class="c-red" slot="description">当前设备不在线无法进行设置</span>
    </el-alert> -->
    <el-tabs ref="tabs" v-model="defaultActive" @tab-click="handleTabClick" tab-position="left" type="border-card" class="h-400">
      <el-tab-pane v-if="menuList.indexOf(14) !== -1" label="一键设防" name="fortify">
        <el-radio-group v-model="form.fortify.type" class="w-100p m-b-30">
          <el-radio-button :label="0">设防</el-radio-button>
          <el-radio-button :label="1">撤防</el-radio-button>
        </el-radio-group>
        <div v-if="form.fortify.type === 0">
          <p class="f-w-b">将设置状态如下：</p>
          <p>以当前位置为中心设置
            <el-select class="w-100" v-model="form.fortify.distance" placeholder="请选择">
              <el-option
                v-for="item in distanceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          半径的圆形区域，目标离开此区域时会触发非法移动报警。</p>
        </div>
        <div v-else>
          撤销非法移动报警。
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(9) !== -1" label="回传间隔" name="1">
        <el-form>
          <el-form-item label="回传间隔:">
            <el-select class="w-100" v-model="form[1].time_span" placeholder="请选择">
              <el-option
                v-for="item in form[1].time_span_arrs"
                :key="item.timeKey"
                :label="item.timeValue"
                :value="item.timeKey">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(10) !== -1" label="断油断电" name="2">
        <el-form ref="2Form" :model="form[2]" :rules="rules[2]">
          <el-form-item label="设置类型:">
            <el-radio-group v-model="form[2].state">
              <el-radio label="1">断油/断电</el-radio>
              <el-radio label="0">恢复</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账号密码:" prop="password">
            <el-input type="password" v-model.trim="form[2].password"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(11) !== -1" label="单次点名" name="3">
        <el-alert
          title="单次点名: 直接点击发送即可↓↓↓"
          type="info"
          show-icon
          :closable="false">
        </el-alert>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(12) !== -1" label="重启设备" name="4">
        <el-alert
          title="重启设备: 直接点击发送即可↓↓↓"
          type="info"
          show-icon
          :closable="false">
        </el-alert>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(13) !== -1" label="短信设置" name="phonePush">
        <el-form ref="phonePushForm" :model="form['phonePush']" :rules="rules['phonePush']" label-width="100px">
          <el-form-item label="手机号码:" prop="phone">
            <el-input v-model.trim="form['phonePush'].phone"></el-input>
            <el-alert
              style="line-height: 18px"
              title="可填多个手机号, 以英文逗号分隔"
              type="info"
              show-icon
              :closable="false">
            </el-alert>
          </el-form-item>
          <el-form-item label="告警设置:" prop="warn_id">
            <el-checkbox-group v-model="form['phonePush'].warn_id">
              <el-checkbox label="101019">断电报警</el-checkbox>
              <el-checkbox label="103025">位移报警</el-checkbox>
              <el-checkbox label="103038">二押停留报警</el-checkbox>
              <el-checkbox label="103039">二押久留报警</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="tx-r m-t-20 w-100p">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="isLoading">发送</el-button>
    </div>
  </section>
</template>

<script>
import md5 from 'js-md5';
import http from '@/assets/js/http';

const omitFormSchema = {
  1: ['time_span_arrs'],
};

export default {
  props: ['isonline', 'deviceInfo'],
  mixins: [http],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'));
      }
      if (md5(md5(value)) !== Lockr.get('PASSWORD')) {
        return callback(new Error('密码不正确'));
      }
      return callback();
    };
    return {
      menuList: [],
      isLoading: false,
      distanceOptions: [
        { label: '100米', value: 100 },
        { label: '200米', value: 200 },
        { label: '300米', value: 300 },
        { label: '400米', value: 400 },
        { label: '500米', value: 500 },
        { label: '600米', value: 600 },
        { label: '700米', value: 700 },
        { label: '800米', value: 800 },
      ],
      passBackOptions: [
        { label: '10秒', value: '10' },
        { label: '15秒', value: '15' },
        { label: '30秒', value: '30' },
        { label: '60秒', value: '60' },
        { label: '90秒', value: '90' },
        { label: '120秒', value: '120' },
      ],
      form: {
        fortify: {
          type: 0,
          distance: 300,
        },
        1: {
          work_pattern: 1,
          state: 1,
          time_span: 10,
          time_span_arrs: [],
        },
        2: {
          work_pattern: 2,
          state: 1,
          password: '',
        },
        3: {
          work_pattern: 3,
          state: 1,
        },
        4: {
          work_pattern: 4,
          state: 1,
        },
        phonePush: {
          phone: null,
          warn_id: [],
        },
      },
      rules: {
        2: {
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        },
        phonePush: {
          phone: [
            { required: false, message: '请输入手机号码' },
            // { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入正确的手机号码' },
          ],
          warn_id: [
            { required: false, message: '请选择需要推送的告警类型' },
          ],
        },
      },
      defaultActive: 'fortify',
    };
  },
  computed: {
    disabledSend() {
      if (this.defaultActive !== 'fortify' && this.isonline === 'false') {
        return true;
      }
      return false;
    },
  },
  methods: {
    async init() {
      const { data: { typeid } } = await this.apiPost('/device/getDeviceById', { id: this.deviceInfo.id });
      const { data: menuList } = await this.apiPost('/device/getDevicePatternType', { deviceTypeId: typeid });
      this.menuList = menuList.map(i => i.patternTypeId);
      const el = this.$refs.tabs.$el.querySelector('.el-tabs__header .el-tabs__item');
      if (el) el.click();
    },
    getBaseParams() {
      const { sn, isActive } = this.deviceInfo;
      return { sn, device_type: isActive ? 0 : 1 };
    },
    close() {
      this.$emit('close');
    },
    async handleTabClick({ name }) {
      if (name === 'fortify') return;
      const baseParams = this.getBaseParams();
      if (name === 'phonePush') {
        const { data } = await this.deviceApiPost('/phonePush/getPhonePush', baseParams);
        for (const i in this.form[name]) {
          if (data[i] !== undefined) {
            this.form[name][i] = data[i];
          }
        }
        this.form[name].warn_id = data.warn_id === '' ? [] : data.warn_id.split(',');
      } else {
        const { data } = await this.deviceApiPost('/deviceOrder/getDevOrder', _.merge(baseParams, { work_pattern: name }));
        for (const i in this.form[name]) {
          if (data[i] !== undefined) {
            this.form[name][i] = data[i];
          }
        }
      }
    },
    async onSubmit() {
      const { sn, lng, lat, isActive } = this.deviceInfo;
      const baseParams = { sn, device_type: isActive ? 0 : 1 };
      this.isLoading = true;
      if (this.defaultActive === 'fortify') {
        if (!lng || !lat) {
          _g.toastMsg('warning', '当前设备无定位信息, 无法一键设防');
          this.isLoading = false;
          return;
        }
        const { data } = await this.apiPost('/fence/searchFence', { sn, fenceid: '' });
        const index = data.findIndex(i => i.fenceType === 3);
        if (this.form.fortify.type === 0) {
          try {
            if (index !== -1) {
              _g.toastMsg('warning', '已存在设防，请先撤防');
              return;
            }
            const form = {
              fenceType: 3,
              desc: '一键设防',
              mindType: [2],
              gsmsn: sn,
              'circle.lng': lng,
              'circle.lat': lat,
              'circle.redius': this.form.fortify.distance,
            };
            await this.apiPost('/fence/addUserFence', form);
            _g.toastMsg('success', '指令提交成功');
          } finally {
            this.isLoading = false;
          }
        } else {
          try {
            if (index !== -1) {
              await this.apiPost('/fence/deleteFence', { fenceId: data[index].fenceId });
            }
            _g.toastMsg('success', '指令提交成功');
          } finally {
            this.isLoading = false;
          }
        }
        this.$emit('init');
      } else if (this.defaultActive === 'phonePush') {
        if (this.form.phonePush.phone !== null && this.form.phonePush.warn_id.length === 0) {
          _g.toastMsg('warning', '告警类型不能为空');
          return;
        }
        const el = this.$refs[`${this.defaultActive}Form`];
        let isPass = true;
        if (el) {
          el.validate((valid) => {
            if (!valid) isPass = false;
          });
        }
        if (isPass) {
          try {
            const { retCode } = await this.deviceApiPost('/phonePush/save', _.merge(baseParams, this.form[this.defaultActive]));
            if (retCode === 0) {
              _g.toastMsg('success', '短信设置成功');
            } else {
              _g.toastMsg('error', '短信设置失败');
            }
          } catch (e) {
            _g.toastMsg('error', '短信设置失败');
          }
        }
      } else {
        const el = this.$refs[`${this.defaultActive}Form`];
        let form = { ...this.form[this.defaultActive] };
        const omitSchema = omitFormSchema[this.defaultActive];
        if (omitSchema) form = _.omit(form, omitSchema);
        let isPass = true;
        if (el) {
          el.validate((valid) => {
            if (!valid) isPass = false;
          });
        }
        if (isPass) {
          try {
            const { retCode } = await this.deviceApiPost('/deviceOrder/save', _.merge(baseParams, form));
            if (retCode === 0) {
              _g.toastMsg('success', '指令发送成功');
            } else {
              _g.toastMsg('error', '指令发送失败');
            }
          } catch (e) {
            _g.toastMsg('error', '指令发送失败');
          }
        }
      }
      this.isLoading = false;
    },
  },
};
</script>

<style lang="stylus">
</style>
