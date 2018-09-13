<template>
  <section class="report-container" :style="{ backgroundImage: `url(../../../static/report_images/${computedImg}.png)` }">
    <div class="level-line">
      <span><span>极低</span><span>3.8</span></span>
      <span><span>低</span><span>4.4</span></span>
      <span><span>中等</span><span>5.6</span></span>
      <span><span>高</span><span>7.5</span></span>
      <span><span>较高</span><span>8.7</span></span>
      <span><span>极高</span><span>9.5</span></span>
      <svg-icon icon-class="triangleUp" :style="`left: ${(report.score-380)/620*100+1}%`"></svg-icon>
    </div>
    <table>
      <thead>
        <tr><td colspan="1000">个人信息:</td></tr>
      </thead>
      <tbody>
        <tr>
          <td width="15%">姓名:</td>
          <td width="30%">{{row.name}}</td>
          <td width="15%">手机号:</td>
          <td width="30%">{{row.accountId}}</td>
        </tr>
        <tr>
          <td>身份证号:</td>
          <td>{{row.idcard}}</td>
          <td>银行卡:</td>
          <td>{{row.bankid}}</td>
        </tr>
        <tr>
          <!-- <td>驾驶证:</td>
          <td>无</td> -->
          <td>配偶姓名:</td>
          <td>{{row.spouseName}}</td>
          <td>配偶电话:</td>
          <td>{{row.spousePhone}}</td>
        </tr>
        <tr>
          <td>配偶身份证:</td>
          <td>{{row.spouseIdcard}}</td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr><td colspan="1000">信息校验:</td></tr>
      </thead>
      <tbody>
        <tr>
          <td width="25%">属性</td>
          <td width="7%" align="center">结果</td>
          <td>备注</td>
        </tr>
        <tr v-for="(i, index) in report.identityCheckList" :key="i.name">
          <td align="center">{{i.name}}</td>
          <td align="center" valign="middle">
            <img v-if="i.resultTag === '0'" src="~static/report_images/pitch_on.png" alt="匹配成功" title="匹配成功">
            <img v-else src="~static/report_images/exclamation.png" alt="不匹配" title="不匹配">
          </td>
          <td v-html="i.remark"></td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr><td colspan="1000">反欺诈查询:</td></tr>
      </thead>
      <tbody>
        <tr>
          <td width="25%">属性</td>
          <td width="7%" align="center">结果</td>
          <td>备注</td>
        </tr>
        <tr v-for="(i, index) in report.antiFraudList" :key="i.name">
          <td align="center">{{i.name}}</td>
          <td align="center">
            <img v-if="i.resultTag === '0'" src="~static/report_images/pitch_on.png" alt="匹配成功" title="匹配成功">
            <img v-else src="~static/report_images/exclamation.png" alt="不匹配" title="不匹配">
          </td>
          <td v-if="i.attribute === 'applyloanmon' && i.remark !== '未查询'">
            <table>
              <thead>
                <tr>
                  <td>时间</td>
                  <td>类型</td>
                  <td>备注</td>
                  <td>次数</td>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, key) in formatApplyloanmon(i.remark)">
                  <template v-for="(item1, key1, item1Index) in item">
                    <tr v-for="(i, index) in item1" :key="`${i.time}${i.type}${index}`">
                      <td v-if="item1Index === 0 && index === 0" :rowspan="computeLength(item)" align="center">{{key}}</td>
                      <td v-if="index === 0" :rowspan="item1.length" align="center">{{key1}}</td>
                      <td>{{i.remark}}</td>
                      <td>&nbsp;&nbsp;{{i.value}}&nbsp;&nbsp;</td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </td>
          <td v-else v-html="i.remark"></td>
        </tr>
        <tr v-for="(i, index) in report.otherList" :key="i.name">
          <td align="center">{{i.name}}</td>
          <td align="center">
            <img v-if="i.resultTag === '0'" src="~static/report_images/pitch_on.png" alt="匹配成功" title="匹配成功">
            <img v-else src="~static/report_images/exclamation.png" alt="不匹配" title="不匹配">
          </td>
          <td v-html="i.remark"></td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr><td colspan="1000">风险评定:</td></tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="1000" style="text-indent: 60px" v-html="report.totalRemark">
          </td>
        </tr>
        <tr align="center">
          <td width="50%">报告编号: {{row.orderNumber}}</td>
          <td>报告时间: {{report.orderSubmitTime}}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
const regExp = /(\d*)_alm_([md])(\d{1,2})_(id|cell|lm_cell)_(bank|nbank)_([a-z0-9_]*)/;

// const timeFirstMap = {
//   m: '第',
//   d: '近',
// };

const timeMap = {
  m: '个月',
  d: '天',
};

const queryMap = {
  id: '按身份证号查询',
  cell: '按手机号查询',
  lm_cell: '按联系人手机号查询',
};

const resMap = {
  bank: {
    selfnum: '在本银行机构的申请次数',
    allnum: '在银行机构申请次数',
    tra_allnum: '在银行机构-传统银行申请次数',
    ret_allnum: '在银行机构-网络零售银行申请次数',
    orgnum: '在银行机构申请机构数',
    tra_orgnum: '在银行机构-传统银行申请机构数',
    ret_orgnum: '在银行机构-网络零售银行申请机构数',
  },
  nbank: {
    selfnum: '在本非银机构申请次数',
    allnum: '在非银机构申请次数',
    p2p_allnum: '在非银机构-p2p申请次数',
    mc_allnum: '在非银机构-小贷申请次数',
    ca_allnum: '在非银机构-现金类分期申请次数',
    cf_allnum: '在非银机构-消费类分期申请次数',
    com_allnum: '在非银机构-代偿类分期申请次数',
    oth_allnum: '在非银机构-其他申请次数',
    nsloan_allnum: '在非银机构-持牌网络小贷机构申请次数',
    autofin_allnum: '在非银机构-持牌汽车金融机构申请次数',
    sloan_allnum: '在非银机构-持牌小贷机构申请次数',
    cons_allnum: '在非银机构-持牌消费金融机构申请次数',
    finlea_allnum: '在非银机构-持牌融资租赁机构申请次数',
    else_allnum: '在非银机构-其他申请次数',
    orgnum: '在非银机构申请机构数',
    p2p_orgnum: '在非银机构-p2p申请机构数',
    mc_orgnum: '在非银机构-小贷申请机构数',
    ca_orgnum: '在非银机构-现金类分期申请机构数',
    cf_orgnum: '在非银机构-消费类分期申请机构数',
    com_orgnum: '在非银机构-代偿类分期申请机构数',
    oth_orgnum: '在非银机构-其他申请机构数',
    nsloan_orgnum: '在非银机构-持牌网络小贷机构申请机构数',
    autofin_orgnum: '在非银机构-持牌汽车金融机构申请机构数',
    sloan_orgnum: '在非银机构-持牌小贷机构申请机构数',
    cons_orgnum: '在非银机构-持牌消费金融机构申请机构数',
    finlea_orgnum: '在非银机构-持牌融资租赁机构申请机构数',
    else_orgnum: '在非银机构-其他申请机构数',
  },
};

export default {
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      report: {
        identityCheckList: [],
        antiFraudList: [],
        otherList: [],
        orderSubmitTime: '',
        totalRemark: '',
        score: null,
      },
      row: {
        name: null,
        accountId: null,
        idcard: null,
        bankid: null,
        spouseName: null,
        spousePhone: null,
        spouseIdcard: null,
        orderNumber: null,
      },
    };
  },
  computed: {
    computedImg() {
      const score = this.report.score;
      if (score > 950) {
        return 'polar_altitude';
      } else if (score > 870 && score <= 950) {
        return 'Higher';
      } else if (score > 750 && score <= 870) {
        return 'tall';
      } else if (score > 560 && score <= 750) {
        return 'centr';
      } else if (score > 440 && score <= 560) {
        return 'excellen';
      }
      return 'Lower';
    },
  },
  methods: {
    open(row, report) {
      this.row = row;
      this.report = report;
    },
    formatApplyloanmon(text) {
      const arr = text.split(',');
      const temp = [];
      arr.forEach((i) => {
        const res = regExp.exec(i);
        temp.push({
          // key: `${timeFirstMap[res['2']]}${res['3']}${timeMap[res['2']]},
          // ${queryMap[res['4']]}, ${resMap[res['5']][res['6']]}`,
          _timeValue: res['3'],
          _timeType: res['2'],
          time: `近${res['3']}${timeMap[res['2']]}`,
          type: queryMap[res['4']],
          remark: resMap[res['5']][res['6']],
          value: res['1'],
        });
      });
      const res = _.groupBy(temp.sort((a, b) => {
        if (a._timeType === 'd') {
          if (a._timeType === b._timeType) {
            return Number(a._timeValue) <= Number(b._timeValue) ? -1 : 1;
          }
          return -1;
        }
        if (a._timeType === b._timeType) {
          return Number(a._timeValue) <= Number(b._timeValue) ? -1 : 1;
        }
        return 1;
      }), 'time');
      for (const i in res) {
        if (res[i] !== undefined) {
          res[i] = _.groupBy(res[i], 'type');
        }
      }
      return res;
    },
    computeLength(obj) {
      let num = 0;
      for (const i in obj) {
        if (obj[i] !== undefined) {
          num += obj[i].length;
        }
      }
      return num;
    },
  },
};
</script>

<style lang="stylus" scoped>
  .level-line
    display flex
    position relative
    margin-bottom 30px
    font-size 14px
    >i
      position absolute
      left 0%
      top 17px
      transform translateX(-50%)
      line-height 24px
    >span
      margin-top 20px
      position relative
      text-align center
      height 5px
      color #909399
      >span:first-child
        margin-top -20px
        display block
        line-height 24px
      >span:last-child
        position absolute
        left 0
        top 10px
        transform: translateX(-50%);
        line-height 24px
      &:nth-child(1)
        flex 0 0 10%
        background #60C55D
      &:nth-child(2)
        flex 0 0 20%
        background #86D3C3
      &:nth-child(3)
        flex 0 0 30%
        background #E8C400
      &:nth-child(4)
        flex 0 0 20%
        background #FF7800
      &:nth-child(5)
        flex 0 0 13%
        background #FF5551
      &:nth-child(6)
        flex 0 0 7%
        background #F90000

  .report-container {
    background-position: center right;
    background-repeat: no-repeat;
    margin: 0px 20px;
    table {
      width: 100%;
      border-collapse:collapse;
      border-spacing:0;
      color: #606266;
      thead {
        font-weight: bold;
        font-size: 18px;
        color: #409EFF;
      }
      td {
        vertical-align: middle;
        // text-align: center;
        margin: 0px;
        padding: 5px 5px;
        border: 1px solid #E4E7ED;
        img {
          vertical-align: middle;
        }
      }
    }
  }
</style>
