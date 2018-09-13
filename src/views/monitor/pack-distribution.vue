<template>
  <div class="current-wrapper" v-show="dialogVisible">
    <i class="el-icon-close" @click.stop="close"></i>
    <section v-show="!showDetail">
      <el-button-group>
        <el-button size="mini" @click="handleSetTime(1)">1天</el-button>
        <el-button size="mini" @click="handleSetTime(3)">3天</el-button>
        <el-button size="mini" @click="handleSetTime(7)">7天</el-button>
      </el-button-group>
      <el-date-picker
        style="width: 125px"
        v-model="date"
        type="date"
        size="mini"
        placeholder="选择日期">
      </el-date-picker>
      <ul style="margin-top: 10px">
        <li v-for="(i, index) in data" :key="index" @click="$emit('markerClick', index)">
          <div class="left">
            <div class="locate-wrapper">
              <svg-icon icon-class="locate"></svg-icon>
              <span class="number">{{index + 1}}</span>
            </div>
          </div>
          <div class="right">
            <p class="time">{{i.startTime}} <span class="right-item">时长: <i>{{$secondsFormat(i.minuteSpan/1000)}}</i></span></p>
            <p class="address">{{i.address}}</p>
            <p class="counts" @click.stop="queryDetail(i.startLon, i.startLat)">近三月停留{{i.lastStopTimes}}次</p>
          </div>
        </li>
      </ul>
      <p class="tx-c c-gra fz-14" style="border-top: 1px solid #ccc; padding-top: 10px" v-show="data.length === 0">暂无数据</p>
    </section>
    <section v-show="showDetail" class="detail">
      <h1><i class="el-icon-arrow-left" @click="showDetail = false;pagination.curPage = 1"></i>三月内停留历史记录</h1>
      <el-table size="mini" :data="detailData" stripe>
        <el-table-column type="index" width="40px"></el-table-column>
        <el-table-column label="开始时间" prop="starttime" width="135px"></el-table-column>
        <el-table-column label="时长">
          <template slot-scope="{ row: { stoptime } }">
            时长: <span style="color: #FC6618">{{$secondsFormat(stoptime/1000)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination bg-wh">
        <el-pagination
          class="tx-c"
          small
          layout="prev, pager, next"
          :total="pagination.counts"
          :page-size="pagination.pageSize"
          :current-page.sync="pagination.curPage"
          @current-change="() => queryDetail()">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      showDetail: false,
      detailData: [],
      data: [],
      date: null,
      dialogVisible: false,
      params: {
        sn: null,
        startTime: null,
        endTime: null,
      },
      pagination: {
        counts: 0,
        curPage: 1,
        pageSize: 20,
      },
    };
  },
  watch: {
    date(newValue) {
      if (newValue) {
        this.params.startTime = this.$moment(newValue).format('YYYY-MM-DD 00:00:00');
        this.params.endTime = this.$moment(newValue).format('YYYY-MM-DD 23:59:59');
        this.getAll();
      }
    },
  },
  methods: {
    open(sn) {
      this.dialogVisible = true;
      this.params.sn = sn;
      this.params.startTime = this.$moment().format('YYYY-MM-DD 00:00:00');
      this.params.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
      this.getAll();
    },
    close() {
      this.dialogVisible = false;
      this.showDetail = false;
      this.$emit('clearMarkers');
    },
    async getAll() {
      try {
        const { data } = await this.apiPost('/vehicle/getStopData', this.params);
        // console.log(data);
        this.data = data.map((i, index) => {
          i.address = null;
          this.$parent.getAddress([i.startLon, i.startLat])
                      .then(({ regeocode: { formattedAddress } }) => {
                        this.data[index].address = formattedAddress;
                      });
          return i;
        });
        this.$emit('showMarkers', data);
      } finally {
        //
      }
    },
    handleSetTime(days) {
      this.params.startTime = this.$moment().add(-days + 1, 'days').format('YYYY-MM-DD 00:00:00');
      this.params.endTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
      this.getAll();
    },
    async queryDetail(lng, lat) {
      try {
        if (lng) this._lng = lng;
        if (lat) this._lat = lat;
        this.showDetail = true;
        const { data, page: { curPage, counts } } = await this.apiPost('/vehicle/getStopDataThreeMonths', { sn: this.params.sn, lng: this._lng, lat: this._lat, ...this.pagination });
        this.detailData = data;
        this.pagination.curPage = curPage;
        this.pagination.counts = counts;
      } catch (e) {
        //
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
  .current-wrapper
    position absolute
    left 0
    top 30px
    z-index 500
    width 350px
    height 600px
    padding 10px
    overflow-y auto
    box-sizing border-box
    background #fff
    border 1px solid #ccc
    .el-icon-close
      position absolute
      right 8px
      top 8px
      cursor pointer
    .detail
      display flex
      flex-direction column
      h1
        text-align center
        // font-weight bold
        // font-size 18px
        i
          float left
          cursor pointer
    ul
      li
        display flex
        align-items center
        border-bottom 1px solid #DCDFE6
        color #606266
        cursor pointer
        &:hover
          background #D1E6FF
        .left
          flex 0 0 auto
          padding 0px 5px
          .locate-wrapper
            position relative
            font-size 30px
            color #3475DC
            .number
              position absolute
              top 5px
              left 50%
              transform translateX(-50%)
              z-index 1
              font-size 14px
              color #fff
        .right
          flex 1 1 auto
          p
            margin 5px 0px
            font-size 14px
            &.address
              margin 10px 0px
            &.counts
              display inline-block
              &:hover
                text-decoration underline
            &.time,
            &.counts
              font-size 12px
              color #409EFF
          .right-item
            float right
            i
              font-weight bold
              color #FC6618
</style>
