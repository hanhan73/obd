<template>
  <section class="settings-wrapper">
    <!-- <el-alert
      title="提示：请确认该设备支持该项指令设置。"
      type="warning"
      center
      class="m-b-10"
      show-icon>
      <span v-show="disabledSend" class="c-red" slot="description">当前设备不在线无法进行设置</span>
    </el-alert> -->
    <el-tabs ref="tabs" v-model="defaultActive" @tab-click="handleTabClick" tab-position="left" type="border-card" class="h-400">
      <el-tab-pane v-if="menuList.indexOf(1) !== -1" label="唤醒休眠" name="1">
        <el-form ref="1Form" :model="form[1]" :rules="rules[1]" label-width="120px">
          <el-form-item label="工作模式:">
            <el-radio-group v-model="form[1].state">
              <el-radio label="1">唤醒</el-radio>
              <el-radio v-if="['xyr-gw005', 'bsj-a5c-8'].indexOf(computedDeviceType) !== -1" label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form[1].state !== '0'" label="回传间隔:" :prop="computedDeviceType !== 'kks-gt740' ? 'time_span' : ''">
            <el-autocomplete
              v-if="computedDeviceType !== 'kks-gt740'"
              clearable
              class="inline-input"
              v-model="form[1].time_span"
              :fetch-suggestions="querySearch"
              value-key="timeValue"
              label="timeKey"
              placeholder="请输入0-999之间的数字(单位:分钟)"
              @select="handleSelectAutocomplete"
            ></el-autocomplete>
            <el-select v-else v-model="form[1].time_span" placeholder="请选择">
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
      <el-tab-pane v-if="menuList.indexOf(2) !== -1" label="追踪模式" name="2">
        <el-form ref="2Form" :model="form[2]" :rules="rules[2]" label-width="120px">
          <el-form-item label="追踪开关:">
            <el-radio-group v-model="form[2].state">
              <el-radio label="1">{{computedDeviceType === 'bsj-a5c-3' ? '实时追踪' : '开启'}}</el-radio>
              <el-radio label="0">{{computedDeviceType === 'bsj-a5c-3' ? '智能省电' : '关闭'}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form[2].state === '1' && ['bsj-a5c-8'].indexOf(computedDeviceType) === -1" label="回传间隔:" prop="time_span">
            <el-select v-model="form[2].time_span" placeholder="请选择">
              <el-option
                v-for="item in form[2].time_span_arrs"
                :key="item.timeKey"
                :label="item.timeValue"
                :value="item.timeKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form[2].state === '1' && ['bsj-a5c-3'].indexOf(computedDeviceType) === -1" label="追踪时间:" prop="track_time">
            <el-select v-model="form[2].track_time" placeholder="请选择">
              <el-option
                v-for="item in form[2].track_time_arrs"
                :key="item.timeKey"
                :label="item.timeValue"
                :value="item.timeKey">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(3) !== -1" label="多点回传参数设置" name="3">
        <el-form ref="3Form" :model="form[3]" :rules="rules[3]" label-width="120px">
          <el-form-item label="多点回传参数:" prop="time_span">
            <el-input v-model.trim="form[3].time_span"></el-input>
          </el-form-item>
        </el-form>
        <p style="line-height: 25px">
          可设置0至6个
          <br>空表示删除多点回传参数
          <br>例如：“0830120016301900”表示每天回传4个点的数据；
              <br>第1个回传时间点是08:30；
              <br>第2个回传时间点是12:00；
              <br>第3个回传时间点是16:30；
              <br>第4个回传时间点是19:00；
        </p>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(4) !== -1" label="星期模式设置" name="4">
        <el-form ref="4Form" :model="form[4]" :rules="rules[4]" label-width="60px">
          <el-form-item label="开关:">
            <el-radio-group v-model="form[4].state">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form[4].state === '1'" label="星期:" prop="time_span">
            <el-checkbox-group v-model="form[4].time_span">
              <el-checkbox v-for="i in 7" :label="`${i}`" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="form[4].state === '1'" label="时间:" prop="track_time">
            <el-input v-model="form[4].track_time" placeholder="格式: HHmm"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(5) !== -1" label="GPS定位开关" name="5">
        <el-form>
          <el-form-item label="GPS定位开关:">
            <el-radio-group v-model="form[5].state">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(6) !== -1" label="WIFI定位开关" name="6">
        <el-form>
          <el-form-item label="WIFI定位开关:">
            <el-radio-group v-model="form[6].state">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(8) !== -1" label="防拆设置" name="8">
        <el-form>
          <el-form-item label="防拆设置:">
            <el-radio-group v-model="form[8].state">
              <el-radio label="1">开启</el-radio>
              <el-radio label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(7) !== -1" label="工作模式查询" name="7">
        <el-form>
          <el-form-item label="当前工作模式:">
            <el-radio-group v-model="form[7].state">
              <el-radio label="1">查询</el-radio>
              <!-- <el-radio label="0">关闭</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="查询结果:">
            <el-input
              :readonly="true"
              type="textarea"
              :rows="3"
              placeholder=""
              v-model="form[7].result">
            </el-input>
          </el-form-item>
          <el-form-item label="待执行指令:">
            <el-input
              :readonly="true"
              type="textarea"
              :rows="3"
              placeholder=""
              v-model="form[7].result_cache">
            </el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="menuList.indexOf(15) !== -1" label="短信设置" name="phonePush">
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
              <el-checkbox label="103040">拆卸报警</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="tx-r m-t-20 w-100p">
      <span v-if="workpat_state === '0'" class="c-red m-r-10" style="user-select: none">该设备暂不支持此项指令设置</span>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="onSubmit" :disabled="workpat_state === '0'" :loading="isLoading">发送</el-button>
    </div>
  </section>
</template>

<script>
import http from '@/assets/js/http';

const omitFormSchema = {
  1: ['time_span_arrs'],
  2: ['track_time_arrs', 'time_span_arrs'],
};

export default {
  props: ['isonline', 'deviceInfo'],
  mixins: [http],
  data() {
    const checkNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'));
      } else if (parseInt(value, 10).toString() !== value) {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      menuList: [],
      workpat_state: null,
      typeid: null,
      deviceTypeList: [],
      isLoading: false,
      // rouseTimeSpanOptions: [
      //   {
      //     label: '按小时',
      //     options: [
      //       { value: '60', label: '1小时' },
      //       { value: '120', label: '2小时' },
      //       { value: '180', label: '3小时' },
      //       { value: '240', label: '4小时' },
      //       { value: '360', label: '6小时' },
      //       { value: '480', label: '8小时' },
      //       { value: '720', label: '12小时' },
      //     ],
      //   },
      //   {
      //     label: '按天',
      //     options: [
      //       { value: '1440', label: '1天' },
      //       { value: '2880', label: '2天' },
      //       { value: '4320', label: '3天' },
      //       { value: '5760', label: '4天' },
      //       { value: '7200', label: '5天' },
      //       { value: '8640', label: '6天' },
      //       { value: '10080', label: '7天' },
      //     ],
      //   },
      // ],
      traceTimeSpanOptions: [
        { value: '60', label: '1分钟' },
        { value: '120', label: '2分钟' },
        { value: '180', label: '3分钟' },
        { value: '240', label: '4分钟' },
        { value: '300', label: '5分钟' },
      ],
      traceTrackTimeOptions: [
        { value: '60', label: '1小时' },
        { value: '120', label: '2小时' },
        { value: '180', label: '3小时' },
        { value: '240', label: '4小时' },
        { value: '360', label: '6小时' },
        { value: '480', label: '8小时' },
        { value: '1440', label: '1天' },
        { value: '10080', label: '1周' },
        { value: '43200', label: '1月' },
      ],
      form: {
        1: {
          work_pattern: 1,
          state: 1,
          time_span: null,
          time_span_arrs: [],
        },
        2: {
          work_pattern: 2,
          state: 1,
          time_span: null,
          track_time: null,
          track_time_arrs: [],
          time_span_arrs: [],
        },
        3: {
          work_pattern: 3,
          state: 1,
          time_span: '',
        },
        4: {
          work_pattern: 4,
          state: 1,
          time_span: [],
          track_time: null,
        },
        5: {
          work_pattern: 5,
          state: 0,
        },
        6: {
          work_pattern: 6,
          state: 0,
        },
        7: {
          work_pattern: 7,
          state: 0,
          result: null,
          result_cache: null,
        },
        8: {
          work_pattern: 8,
          state: 0,
        },
        phonePush: {
          phone: null,
          warn_id: [],
        },
      },
      rules: {
        1: {
          time_span: [
            { required: true, message: '请输入回传间隔' },
            { pattern: /^(0|([1-9]\d{0,2}))$/, message: '请输入0-999之间的数字' },
          ],
        },
        2: {
          time_span: [
            { required: true, validator: checkNumber },
          ],
          track_time: [
            { required: true, validator: checkNumber },
          ],
        },
        3: {
          // time_span: [
          //   { required: true, message: '不能为空' },
          // ],
        },
        4: {
          time_span: [
            { type: 'array', required: true, message: '不能为空' },
          ],
          track_time: [
            { required: true, message: '不能为空' },
            { pattern: /(^[0-1][0-9][0-5][0-9]$)|(^2[0-3][0-5][0-9]$)/, message: '格式为: HHmm' },
          ],
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
      defaultActive: '1',
    };
  },
  computed: {
    computedDeviceType() {
      const list = {};
      this.deviceTypeList.forEach((i) => {
        list[i.id] = i.deviceModel;
      });
      return list[this.typeid];
    },
    disabledSend() {
      return this.isonline === 'false';
    },
  },
  methods: {
    async init() {
      const { data } = await this.apiPost('/devicetype/qryDevicetype', { pageSize: 10000 });
      this.deviceTypeList = data;
      const { data: { typeid } } = await this.apiPost('/device/getDeviceById', { id: this.deviceInfo.id });
      this.typeid = typeid;
      const { data: menuList } = await this.apiPost('/device/getDevicePatternType', { deviceTypeId: typeid });
      this.menuList = menuList.map(i => i.patternTypeId);
      this.$nextTick(() => {
        const el = this.$refs.tabs.$el.querySelector('.el-tabs__header .el-tabs__item');
        if (el) el.click();
      });
    },
    getBaseParams() {
      const { sn, isActive } = this.deviceInfo;
      return { sn, device_type: isActive ? 0 : 1 };
    },
    async onSubmit() {
      const baseParams = this.getBaseParams();
      this.isLoading = true;
      const el = this.$refs[`${this.defaultActive}Form`];
      let isPass = true;
      if (el) {
        el.validate((valid) => {
          if (!valid) isPass = false;
        });
      }
      if (isPass) {
        let form = { ...this.form[this.defaultActive] };
        const omitSchema = omitFormSchema[this.defaultActive];
        if (omitSchema) form = _.omit(form, omitSchema);
        if (this.defaultActive === 'phonePush') {
          if (this.form.phonePush.phone !== null && this.form.phonePush.warn_id.length === 0) {
            _g.toastMsg('warning', '告警类型不能为空');
            return;
          }
          try {
            const { retCode } = await this.deviceApiPost('/phonePush/save', _.merge(baseParams, form));
            if (retCode === 0) {
              _g.toastMsg('success', '短信设置成功');
            } else {
              _g.toastMsg('error', '短信设置失败');
            }
          } catch (e) {
            _g.toastMsg('error', '短信设置失败');
          }
        } else {
          if (this.workpat_state !== '1') {
            this.isLoading = false;
            _g.toastMsg('error', '该设备暂不支持此项指令设置');
            return;
          }
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
    querySearch(queryString, cb) {
      const data = this.form[1].time_span_arrs;
      // const results = data
      // 调用 callback 返回建议列表的数据
      cb(data.map((i) => {
        i.value = i.timeKey;
        return i;
      }));
    },
    handleSelectAutocomplete(item) {
      this.form[1].time_span = item.timeKey;
    },
    async handleTabClick({ name }) {
      this.workpat_state = '1';
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
          if (this.rules[name] && this.rules[name][i] && this.rules[name][i].findIndex(j => j.type === 'array') !== -1) {
            this.form[name][i] = data[i].split(',');
          } else {
            // console.log(i, data[i]);
            this.form[name][i] = data[i];
          }
        }
        // console.log(this.form[name]);
        this.workpat_state = data.workpat_state;
        // if (['2', '3'].indexOf(name) !== -1) this.form[name].state = '1';
        // 如果是追踪模式或多点回传就把开关自动设为 1;
      }
      this.$nextTick(() => {
        const form = this.$refs[`${name}Form`];
        if (form) {
          form.clearValidate();
        }
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="stylus">
</style>
