<template>
  <div class="container">
    <div class="wrapper">
      <el-radio-group v-model="form.queryType" class="radio">
        <el-radio-button v-for="(i, key) in queryTypeMap" :key="key" :label="key">
          {{i.label}}
          <svg-icon v-if="i.icon" :icon-class="i.icon"></svg-icon>
        </el-radio-button>
      </el-radio-group>


      <div class="form">
        <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-alert
            style="margin: 0px 0px 30px"
            :title="queryTypeMap[form.queryType].tips"
            type="info"
            show-icon>
          </el-alert>
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item v-if="form.queryType !== '5'" label="手机:" prop="accountId">
            <el-input v-model="form.accountId"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idcard">
            <el-input v-model="form.idcard"></el-input>
          </el-form-item>
          <div v-if="form.queryType === '4'">
            <el-form-item v-if="form.item.indexOf('2') !== -1" label="银行卡号:" prop="bankid">
              <el-input v-model="form.bankid"></el-input>
            </el-form-item>
            <el-form-item label="查询项:" prop="item" style="text-align: left">
              <el-checkbox-group v-model="form.item">
                <el-checkbox v-for="i in customQueryItem" :key="i.value" :label="i.value">
                  {{i.label}}
                  <el-tooltip class="item" effect="dark" :content="i.desc" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if="form.queryType === '5'">
            <div v-if="form.item.indexOf('16') !== -1">
              <el-form-item label="号牌种类:" prop="cardtype">
                <el-select v-model="form.cardtype" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="(i, index) in plateNumberType"
                    :key="index"
                    :label="i.label"
                    :value="i.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车牌号:" prop="cardnum">
                <el-input v-model="form.cardnum"></el-input>
              </el-form-item>
              <el-form-item label="车架号:" prop="framenum">
                <el-input v-model="form.framenum"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="查询项:" prop="item" style="text-align: left">
              <el-checkbox-group v-model="form.item">
                <el-checkbox v-for="i in cardQueryItem" :key="i.value" :label="i.value">
                  {{i.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if="form.queryType === '2'">
            <el-form-item label="银行卡号:">
              <el-input v-model="form.bankid"></el-input>
            </el-form-item>
            <el-form-item label="配偶:" style="text-align: left">
              <el-switch
                v-model="hasSpouse"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <div v-if="hasSpouse">
              <el-form-item label="配偶姓名:" prop="spouseName">
                <el-input v-model="form.spouseName"></el-input>
              </el-form-item>
              <el-form-item label="配偶手机:" prop="spousePhone">
                <el-input v-model="form.spousePhone"></el-input>
              </el-form-item>
              <el-form-item label="配偶身份证:" prop="spouseIdcard">
                <el-input v-model="form.spouseIdcard"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-button type="primary" @click="onSubmit" :loading="saveLoading">提交</el-button>
        <span class="fz-12 m-l-5" style="color: #909399">消耗 <i class="c-red f-w-b fz-18">{{form.queryType === '4' ? totalCost : queryTypeMap[form.queryType].value}}</i> 点</span>
      </div>
    </div>
    <div class="report-wrapper"
         v-loading="isLoading === true"
         element-loading-text="正在生成报告中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <report-table v-show="isLoading === false" ref="reportTable"></report-table>
    </div>
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      top="38vh"
      width="300px"
      :append-to-body="true"
      :before-close="handleClose">
      <span>{{count}} 秒后跳转到订单列表</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import http from '@/assets/js/http';
import { mapActions } from 'vuex';
import ReportTable from '../orders/report-table';
// import { saveOrder } from '@/api/orders';
// import { getInter } from '@/api/orderinter';

const form = {
  item: [],
  name: null,
  accountId: null,
  idcard: null,
  bankid: null,
  version: 1,
  deviceType: 'gpspc',
  spouseName: null,
  spousePhone: null,
  spouseIdcard: null,
  cardtype: null,
  cardnum: null,
  framenum: null,
};

export default {
  name: 'query',
  mixins: [http],
  components: {
    ReportTable,
  },
  data() {
    return {
      totalCost: 0,
      isLoading: null,
      dialogVisible: false,
      count: 3,
      isIDCardEqualDriverId: false,
      plateNumberType: [
        { label: '大型汽车', value: 1 },
        { label: '小型汽车', value: 2 },
        { label: '使馆汽车', value: 3 },
        { label: '领馆汽车', value: 4 },
        { label: '境外汽车', value: 5 },
        { label: '外籍汽车', value: 6 },
        { label: '两三轮摩托', value: 7 },
        { label: '轻便摩托车', value: 8 },
        { label: '使馆摩托车', value: 9 },
        { label: '领馆摩托车', value: 10 },
        { label: '境外摩托车', value: 11 },
        { label: '外籍摩托车', value: 12 },
        { label: '农用运输车', value: 13 },
        { label: '拖拉机', value: 14 },
        { label: '挂车', value: 15 },
        { label: '教练汽车', value: 16 },
        { label: '教练摩托车', value: 17 },
        { label: '香港入境车', value: 26 },
        { label: '澳门入境车', value: 27 },
      ],
      cardQueryItem: [],
      customQueryItem: [],
      queryTypeMap: {
        1: { label: '基本查询', value: 80, tips: '基本查询：通过输入姓名+身份证+手机号验证个人信息，查询手机在网时长和状态,同时查询个人不良、黑名单、个人司法、贷款逾期' },
        2: { label: '多维查询', value: 150, tips: '多维查询：通过输入姓名+身份证+手机号验证个人信息，查询手机在网时长和状态，同时查询个人不良、黑名单、个人司法、贷款逾期、贷款申请详情、贷款放款、贷款驳回、个人学历' },
        // 5: { label: '证件查询', value: 150, tips: '证件查询：通过勾选驾驶证查询或行驶证查询，填入对应信息进行查询' },
        4: { label: '自定义查询', value: 80, tips: '自定义查询：通过输入姓名+身份证+手机号验证个人信息，选择查询项目进行查询', icon: 'hot' },
        // { key: 5, label: '芝麻信用分', value: 150, tips: '包含基本查询和更多维度反欺诈查询', icon: 'zhima' }
      },
      hasSpouse: false,
      saveLoading: false,
      activeName: '1',
      form: {
        queryType: '1',
        ...form,
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名' },
        ],
        bankid: [
          { required: true, message: '请输入银行卡号' },
        ],
        accountId: [
          { required: true, message: '请输入手机号码' },
          { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入合法手机号码' },
        ],
        idcard: [
          { required: true, message: '请输入身份证号码' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入合法身份证号码' },
        ],
        item: [
          { required: true, message: '请选择查询项' },
        ],
        cardtype: [
          { required: true, message: '请选择号牌种类' },
        ],
        cardnum: [
          { required: true, message: '请输入车牌号' },
        ],
        framenum: [
          { required: true, message: '请输入车架号' },
        ],
        spouseName: [
          { required: true, message: '请输入配偶姓名' },
        ],
        spousePhone: [
          { required: true, message: '请输入配偶手机号' },
          { pattern: /^[1][3,4,5,6,7,8][0-9]{9}$/, message: '请输入合法手机号码' },
        ],
        spouseIdcard: [
          { required: true, message: '请输入配偶身份证号' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入合法身份证号码' },
        ],
        // driverId: [
        //   { required: true, message: '请输入驾驶证号' }
        // ]
      },
    };
  },
  watch: {
    'form.item': function a(val) {
      if (this.form.queryType === '4') {
        const arr = this.customQueryItem
                                  .filter(i => val.indexOf(i.value) !== -1);
        this.form.checkname = arr.map(i => i.label);
        this.totalCost = _.sum(arr.map(i => i.point));
      } else if (this.form.queryType === '5') {
        this.form.checkname = this.cardQueryItem
                                  .filter(i => val.indexOf(i.value) !== -1)
                                  .map(i => i.label);
      }
    },
  },
  created() {
    this.fkApiPost('/orderinter/getInter', {}).then((response) => {
      const data = response.obj;
      const arr = [];
      for (const i in data) {
        if (i === undefined) return;
        const val = [];
        const temp = [];
        for (const j in data[i].map) {
          if (i === undefined) return;
          val.push(j);
          temp.push(data[i].map[j]);
        }
        arr.push({ label: data[i].name, value: val.join(','), desc: temp.join('、'), point: data[i].point });
      }
      this.customQueryItem = arr;
    });
    this.fkApiPost('/orderinter/getInter', { type: 1 }).then((response) => {
      const data = response.obj;
      const arr = [];
      // eslint-disable-next-line
      for (const i in data) {
        const val = [];
        const temp = [];
        // eslint-disable-next-line
        for (const j in data[i]) {
          val.push(j);
          temp.push({ value: j, label: data[i][j] });
        }
        arr.push(...temp);
      }
      this.cardQueryItem = arr;
    });
  },
  destroyed() {
    window.clearInterval(this._interval);
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.dialogVisible = false;
          window.clearInterval(this._interval);
          done();
        })
        .catch(() => {});
    },
    resetForm() {
      // eslint-disable-next-line
      for (const i in form) {
        this.form[i] = form[i];
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.isLoading = null;
          this.fkApiPost('/appOrder/saveOrder', this.form).then((respoonse) => {
            this.$message.success('提交成功！');
            this.saveLoading = false;
            this.resetForm();
            this.$nextTick(() => {
              this.$refs.form.clearValidate();
            });
            this.fetchPoint();
            this.isLoading = true;
            setTimeout(() => {
              this.queryReport(respoonse.obj);
              // this.queryReport({ queryType: '5', id: 1006 });
            }, 1000 * 10);
          }).catch(() => {
            this.saveLoading = false;
          });
        }
      });
    },
    queryReport(obj) {
      const { queryType, id } = obj;
      this.fkApiPost('/appOrderResult/NewGetResultById2', { queryType, id }).then((response) => {
        if (response.obj.order.orderStatus === 0) {
          this.isLoading = false;
          const { order, orderresult } = response.obj;
          this.$nextTick(() => {
            this.$refs.reportTable.open(order, orderresult);
          });
        } else {
          setTimeout(() => {
            this.queryReport(obj);
          }, 1000 * 5);
        }
      }).catch(() => {
        this.isLoading = null;
      });
    },
    ...mapActions(['fetchPoint']),
  },
};
</script>

<style lang="stylus" scoped>
  .container
    display flex
    // flex-direction column
    position absolute
    height 100%
    width 100%
    padding 20px
    box-sizing border-box
    background #fff
    >.wrapper
      flex 0 0 400px
      text-align center
      width 0
      padding-right 20px
      border-right 1px solid #ccc
      box-shadow inherit
    >.report-wrapper
      flex 1 1 auto
      height 100%
      overflow-y auto
    .radio
      margin 30px 0px 30px
      i
        color red
        position absolute
        top -20px
        font-size 26px
        right 0px
    .form
      .el-form
        display inline-block
  .el-checkbox
    width 50%
    margin-left 0px
</style>
