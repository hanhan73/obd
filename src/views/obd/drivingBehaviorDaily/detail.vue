<template>
  <div class="drivingBehaviorDetail">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title">
          &nbsp;&nbsp;车辆信息
        </template>
        <el-table size="small" :data="vehicleData">
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="车牌" prop="carnumber"></el-table-column>
          <el-table-column label="车架号" prop="vinnumber"></el-table-column>
          <el-table-column label="所属分类" prop=""></el-table-column>
          <el-table-column label="IMEI" prop="sn"></el-table-column>
          <el-table-column label="日报时间" prop="createTime"></el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          &nbsp;&nbsp;行程信息
        </template>
        <el-table
          stripe
          size="small"
          :data="tableData"
          v-loading="tableLoading"
          highlight-current-row>
          <el-table-column
            type="index"
            width="50px">
          </el-table-column>
          <el-table-column
            min-width="170"
            property="accOnTime"
            label="点火时间">
          </el-table-column>
          <el-table-column
            min-width="170"
            property="accOffTime"
            label="熄火时间">
          </el-table-column>
          <el-table-column
            :formatter="({ durTotal }) => durTotal ? $secondsFormat(durTotal) : ''"
            property="durTotal"
            label="行程时长">
          </el-table-column>
          <el-table-column
            property="mileages"
            label="里程">
          </el-table-column>
          <el-table-column
            :formatter="({ fuelConsum }) => fuelConsum ? `${fuelConsum/1000} L` : ''"
            label="耗油量">
          </el-table-column>
          <el-table-column
            :formatter="({ idleDur }) => idleDur ? $secondsFormat(idleDur) : ''"
            label="怠速时长">
          </el-table-column>
          <el-table-column
            :formatter="({ overspdCount }) => overspdCount ? `${overspdCount} 次` : ''"
            label="超速累计次数">
          </el-table-column>
          <el-table-column
            :formatter="({ overspdDur }) => overspdDur ? $secondsFormat(overspdDur) : ''"
            label="超速时长">
          </el-table-column>
          <el-table-column
            :formatter="({ speedAvg }) => speedAvg ? `${speedAvg} KM/H` : ''"
            label="平均车速">
          </el-table-column>
          <el-table-column
            :formatter="({ speedMax }) => speedMax ? `${speedMax} KM/H` : ''"
            label="最大车速">
          </el-table-column>
          <el-table-column
            :formatter="({ numOfBrak }) => numOfBrak ? `${numOfBrak} 次` : ''"
            label="脚刹次数">
          </el-table-column>
          <el-table-column
            :formatter="({ accCount }) => accCount ? `${accCount} 次` : ''"
            label="急加速">
          </el-table-column>
          <el-table-column
            :formatter="({ decCount }) => decCount ? `${decCount} 次` : ''"
            label="急减速">
          </el-table-column>
          <el-table-column
            :formatter="({ shpturnCount }) => shpturnCount ? `${shpturnCount} 次` : ''"
            label="急转弯">
          </el-table-column>
          <el-table-column
            width="100"
            label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="handleTrackPlay(row)">轨迹回放</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pos-rel p-t-20 pages-footer">
          <div class="stat">
          </div>
          <div class="block pages m-t-15">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[15, 30, 60, 100]"
              :page-size="pagination.pageSize"
              :current-page="pagination.curPage"
              :total="pagination.dataCount">
            </el-pagination>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          &nbsp;&nbsp;轨迹信息
        </template>
        <track-play ref="trackPlay" v-loading="isLoading" element-loading-text="正在加载轨迹中..."></track-play>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';

import TrackPlay from './track-play';

export default {
  props: ['props'],
  mixins: [
    http,
    listMixin,
  ],
  data() {
    return {
      isLoading: false,
      vehicleData: [],
      activeNames: ['1', '2', '3'],
      params: {
        tripDetailIds: null,
      },
    };
  },
  computed: {
    time: {
      set(val) {
        this.params.beginTime = val ? moment(val[0]).format('YYYY-MM-DD HH:mm:ss') : null;
        this.params.endTime = val ? moment(val[1]).format('YYYY-MM-DD HH:mm:ss') : null;
      },
      get() {
        return [this.params.beginTime, this.params.endTime];
      },
    },
  },
  watch: {
    'props.tripDetailIds': function init() {
      this.init();
    },
  },
  beforeCreate() {
    this.name = '/obd/getDetailsListById';
  },
  methods: {
    init() {
      if (this.$refs.trackPlay) this.$refs.trackPlay.handleEscapeReplay();
      this.params.tripDetailIds = this.props.tripDetailIds;
      try {
        this.vehicleData = [this.props.row];
      } catch (e) {
        //
      }
      this.getAll();
    },
    handleChange() {
      //
    },
    async handleTrackPlay(row) {
      const params = {
        sn: row.sn,
        sTime: row.accOnTime,
        eTime: row.accOffTime,
      };
      this.isLoading = true;
      try {
        const { data } = await this.apiPost('/device/findTrackHis', params);
        if (data.length) {
          const el = document.querySelector('.drivingBehaviorDetail').parentNode;
          el.scrollTop = el.scrollHeight;
          this.$refs.trackPlay.play(data, this.vehicleData);
        } else {
          _g.toastMsg('warning', '查询暂无轨迹');
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  components: {
    TrackPlay,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .drivingBehaviorDetail
    padding: 5px
</style>
