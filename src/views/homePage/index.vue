<template>
  <div class="homePage-wrapper" ref="homePageWrapper">
    <section>
      <el-col :span="20">
        <el-card class="box-card system-info" v-loading="deviceAlertLoading">
          <h1 slot="header">
            今日各类订单
          </h1>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '二押点报警', props: { typeid: '103037,103038,103039' }})">
            <section class="icon"><img width="40px" src="./safe.png"/></section>
            <section class="data">{{insuranceCount}}</section>
            <section class="data">保险</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '二押点报警', props: { typeid: '103037,103038,103039' }})">
            <section class="icon"><img width="50px" src="./movecar.png"/></section>
            <section class="data">{{trailer}}</section>
            <section class="data">拖车</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '断电报警', props: { typeid: '101019' }})">
            <section class="icon"><img width="40px" src="./changetire.png"/></section>
            <section class="data">{{tireChange}}</section>
            <section class="data">换胎</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '位移报警', props: { typeid: '103025' }})">
            <section class="icon"><img width="40px" src="./outage.png"/></section>
            <section class="data">{{liftElectricity}}</section>
            <section class="data">搭电</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '拆卸报警', props: { typeid: '103040' } })">
            <section class="icon"><img height="40px" src="./gaveoil.png"/></section>
            <section class="data">{{oilDelivery}}</section>
            <section class="data">送油</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '24小时无信号', props: { typeid: '103020' } })">
            <section class="icon"><img width="40px" src="./connectless.png"/></section>
            <section class="data">{{maintainCount}}</section>
            <section class="data">保养维修</section>
          </article>
          <article @click="handlePush({path: '/main/alarm/deviceAlert', name: '三天无行驶', props:{ typeid: '5' }})">
            <section class="icon"><img width="40px" src="./cq.png"/></section>
            <section class="data">{{inflation}}</section>
            <section class="data">充气</section>
          </article>
        </el-card>
      </el-col>

      <el-col :span="4">
        <el-card class="box-card system-notice">
          <section slot="header">
            <h1>
              <i class="fa fa-bullhorn" aria-hidden="true"></i> &nbsp;系统公告
            </h1>
          </section>
          <section>
            <el-carousel trigger="click" height="170px">
              <el-carousel-item v-for="(item,  index) in noticeBoard" :key="index" class="">
                <h3>{{index + 1}}. {{item}}</h3>
              </el-carousel-item>
            </el-carousel>
          </section>
        </el-card>
      </el-col>
    </section>

    <section class="m-t-15">
      <el-col>
        <el-row :gutter="gutter" class="m-t-15">
          <el-col :span="24">
            <el-card class="box-card" v-loading="monthReportLoading" element-loading-text="拼命加载中...">
              <div slot="header">
                <h1>
                  <i class="fa fa-bar-chart" aria-hidden="true"></i>
                  &nbsp;
                  各类订单报表
                </h1>
                <div>
                  <el-select @change="fetchMonthReport" style="width: 80px" size="mini" v-model="monthReportParams.period" placeholder="请选择日期类型">
                    <el-option
                      v-for="item in periodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  &nbsp;<i @click="fetchMonthReport" :class="{ 'fa-spin': monthReportLoading }" class="fa fa-refresh pointer" aria-hidden="true"></i>
                </div>
              </div>
              <chart :options="monthReportBar" ref="monthReportBar" style="width: 100%; height: 170px"></chart>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col>
        <el-card class="box-card">
          <section slot="header">
            <h1>
              <i class="fa fa-bug" aria-hidden="true"></i> &nbsp;系统报警
            </h1>
            <div>
              <el-select @change="alertListParams.curPage = 1;fetchAlertList()" style="width: 80px" size="mini" v-model="alertListParams.timeType" placeholder="请选择日期类型">
                <el-option
                  v-for="item in periodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </section>
          <section>
            <div v-if="alertList.length">
              <ul class="alarm-list">
                <li v-for="({ devicename, alerttime, typename, typeid, address }, index) in alertList"
                    :key="index"
                    @click="() => $handleAlarmClick(typeid, alertListParams.timeType)">
                  <div class="title"><h3>{{devicename}}</h3> <span class="type" :style="{ color: $dangerTypes.indexOf(typeid) !== -1 ? 'red' : '#FF9933' }">{{typename}}</span></div>
                  <p class="time">时间: {{alerttime}}</p>
                  <p class="position">位置: {{address}}</p>
                </li>
              </ul>
              <el-pagination
                small
                class="tx-c"
                layout="prev, pager, next"
                :total="alertListParams.counts"
                :current-page.sync="alertListParams.curPage"
                @current-change="fetchAlertList">
              </el-pagination>
            </div>
            <p v-else class="tx-c c-gra">暂无数据</p>
          </section>
        </el-card>
      </el-col>
    </section>
  </div>
</template>

<script>
import http from '@/assets/js/http';
// import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

export default {
  name: escapeName('首页'),
  mixins: [http],
  components: {
    // ActiveDevicesDetail,
  },
  computed: {
    multiple() {
      return Lockr.get('securId') === 2 ? 1 : 1;
    },
  },
  data() {
    return {
      alertList: [],
      noticeBoard: [
        `热烈祝贺${this.$configuration.title}平台2.2上线成功!`,
        `热烈祝贺${this.$configuration.title}APP上线成功!`,
      ],
      gutter: 15,
      monthReportParams: {
        period: 3,
      },
      alertListParams: {
        alertstatus: 0,
        timeType: 1,
        pageSize: 10,
        status: 1,
        counts: 0,
        curPage: 1,
      },
      periodOptions: [
        { label: '今天', value: 1 },
        { label: '昨天', value: 2 },
        { label: '本周', value: 3 },
        { label: '上周', value: 4 },
        { label: '本月', value: 5 },
        { label: '上月', value: 6 },
      ],
      insuranceCount: null,
      maintainCount: null,
      trailer: null,
      liftElectricity: null,
      tireChange: null,
      inflation: null,
      oilDelivery: null,

      monthReportLoading: false,
      deviceAlertLoading: false,

      monthReportBar: {
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: '30px',
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
        },
        // dataRange: {
        //   show: false,
        //   min: 0,
        //   max: 12,
        //   calculable: true,
        //   color: ['#d94e5d', '#eac736', '#50a3ba'],
        //   y: 'center',
        // },

        xAxis: [
          {
            type: 'category',
            show: false,
            data: ['保险(单)', '拖车(单)', '换胎(次)', '搭电(次)', '送油(次)', '保养维修(次)', '充气'],
          },
        ],
        yAxis: [
          {
            type: 'value',
            show: false,
          },
        ],
        series: [
          {
            name: '各类月报表',
            type: 'bar',
            barGap: 0.1,
            barCategoryGap: 0.01,
            itemStyle: {
              normal: {
                color(params) {
                  // build a color map as your need.
                  const colorList = [
                    '#58B7FF',
                    '#20A0FF',
                    '#1D8CE0',
                  ];
                  return colorList[params.dataIndex];
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{b}\n{c}',
                },
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            data: [5, 8, 12, 14, 16, 10, 12],
          },
        ],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.resizeCharts();
      }, 1000);
      window.onresize = () => {
        if (this.$refs.homePageWrapper.parentNode.style.display === 'none') return;
        this.resizeCharts();
      };
      this.fetchitemNum();
      this.fetchMonthReport();
    });
  },
  destoryed() {
    window.onresize = null;
  },
  methods: {
    init() {
      // fetchitemNum();
    },
    resizeCharts() {
      for (const i in this.$refs) {
        if (typeof this.$refs[i].resize === 'function' && this.$refs[i].$el.offsetWidth !== 0) {
          this.$refs[i].resize();
        }
      }
    },
    async fetchitemNum() {
      this.deviceAlertLoading = true;
      try {
        const { data: { insuranceCount, maintainCount, trailer, liftElectricity, tireChange, inflation, oilDelivery } } = await this.apiPost('/backUser/getOrderCount', {});
        this.insuranceCount = insuranceCount;
        this.maintainCount = maintainCount;
        this.trailer = trailer;
        this.liftElectricity = liftElectricity;
        this.tireChange = tireChange;
        this.inflation = inflation;
        this.oilDelivery = oilDelivery;
        this.deviceAlertLoading = false;
      } catch (e) {
        this.deviceAlertLoading = false;
      }
    },
    async fetchMonthReport() {
      this.monthReportLoading = true;
      try {
        const { data: {
          insuranceCount,
          maintainCount,
          trailer,
          liftElectricity,
          tireChange,
          inflation,
          oilDelivery,
          } } = await this.apiPost('/backUser/getOrderCountByDate', this.monthReportParams);
        this.monthReportBar.series[0].data = [
          insuranceCount,
          trailer,
          tireChange,
          liftElectricity,
          oilDelivery,
          maintainCount,
          inflation,
        ];
        this.monthReportLoading = false;
      } catch (e) {
        this.monthReportLoading = false;
      }
    },
  },
};
</script>


<style lang="stylus">
  .homePage-wrapper
    height: 100%
    padding: 20px
    // background-image: linear-gradient(281deg, #b8b4cc 0%, #63d3e2 100%)
    background: rgba(240, 240, 240, 1)
    color: #555
    >section
      display: flex
      >div:first-child
        flex: 1 1 auto
        width: 0
        margin-right: 15px
      >div:last-child
        flex: 0 0 250px
    .box-card
      margin: 0px 0px 1px
      &.system-notice
        .el-card__body
          padding: 0px
          h3
            padding: 0px 15px
            margin-top: 50px
            line-height: 20px
            text-align: center
      .el-card__header
        line-height: 22px
        >div, section, h1
          display: flex
          align-items: center
          justify-content: space-between
          font-weight: bold
      .alarm-list
        li
          margin-top: 10px
          padding-bottom: 10px
          border-bottom: 1px solid #ccc
          cursor: pointer
          transition: all .2s
          &:hover
            text-decoration: underline
            // background: rgba(0, 0, 0, .2)
          &:first-child
            margin-top: 0px
          &:last-child
            padding-bottom: 0px
            border-bottom: none
          div, p
            line-height: 20px
          .title
            display: flex
            justify-content: space-between
            h3
              font-size: 16px
              font-weight: bold
            .type
              font-size: 14px
      &.system-info
        .el-card__body
          display: flex
          article
            display: flex
            flex-direction: column
            align-items: center
            justify-content: center
            margin-right: 15px
            flex: 1 1 18%
            height: 130px
            border-radius: 5px
            cursor: pointer
            transition: all .2s
            text-align: center
            &:last-child
              margin-right: 0px
            >section
              flex: 1 1 33%
              line-height: 43px
              color: #fff
              &:nth-child(1)
                line-height: 50px
                img
                  vertical-align: middle
              &:nth-child(2)
                line-height: 48px
                overflow: hidden
                font-weight: bold
                font-size: 24px
              &:nth-child(3)
                font-size: 14px
            &:nth-child(1)
              background: #32B4FA
            &:nth-child(2)
              background: #33CC00
            &:nth-child(3)
              background: #797979
            &:nth-child(4)
              background: #FF9933
            &:nth-child(5)
              background: #669999
            &:nth-child(6)
              background: #FC8556
            &:nth-child(7)
              background: #925ca3
            &:hover
              opacity: .70

</style>
