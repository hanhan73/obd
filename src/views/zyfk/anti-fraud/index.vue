<template>
  <div>
    <div class="m-b-5 ovf-hd fz-14 search-bar">
      <el-cascader
        size="mini"
        style="margin: 2px 5px 0 0"
        placeholder="请选择账号名称"
        v-model="partnerid"
        :options="partnersTree"
        :props="{label: 'partnername', value: 'id', children: '_children'}"
        filterable
        clearable
        change-on-select
      ></el-cascader>
      <el-select v-model="params.companyDeviation"
                 size="mini"
                 placeholder="请选择单位地址偏差"
                 clearable
                 @change="getAll">
        <el-option value="3" label="0-3km"></el-option>
        <el-option value="5" label="3-5km"></el-option>
        <el-option value="10" label="5-10km"></el-option>
        <el-option value="50" label="10-50km"></el-option>
        <el-option value="60" label="50km以上"></el-option>
      </el-select>
      <el-select v-model="params.homeDeviation"
                 size="mini"
                 placeholder="请选择家庭地址偏差"
                 clearable
                 @change="getAll">
        <el-option value="3" label="0-3km"></el-option>
        <el-option value="5" label="3-5km"></el-option>
        <el-option value="10" label="5-10km"></el-option>
        <el-option value="50" label="10-50km"></el-option>
        <el-option value="60" label="50km以上"></el-option>
      </el-select>
      <div class="btn-wrapper inline">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll">搜索</el-button>
      </div>
    </div>
    <el-table
      stripe
      size="mini"
      :data="tableData"
      v-loading="tableLoading"
      highlight-current-row>
      <el-table-column
        type="index"
        width="50px">
      </el-table-column>
      <el-table-column
        width="80px"
        prop="carnumber"
        label="车牌号码">
      </el-table-column>
      <el-table-column
        prop="vehicleUser"
        label="车主姓名">
      </el-table-column>
      <el-table-column
        width="120px"
        prop="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        prop="companyForecast"
        label="预测单位">
      </el-table-column>
      <el-table-column
        prop="companyRegister"
        label="登记单位">
      </el-table-column>
      <el-table-column
        prop="companyDeviation"
        label="单位地址偏差">
      </el-table-column>
      <el-table-column
        prop="homeForecast"
        label="预测住址">
      </el-table-column>
      <el-table-column
        prop="homeRegister"
        label="登记住址">
      </el-table-column>
      <el-table-column
        prop="homeDeviation"
        label="家庭地址偏差">
      </el-table-column>
      <el-table-column
        prop=""
        label="近7天回家次数">
      </el-table-column>
      <el-table-column
        prop=""
        label="近7天回单位次数">
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" size="mini" @click.stop="$refs.register.open(row)">登记</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-10 p-b-20 pages-footer">
      <div class="stat">
      </div>
      <div class="block pages">
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
    <register ref="register" @init="getAll"></register>
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap';
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import { mapGetters, mapActions } from 'vuex';

import Register from './register';

export default {
  components: {
    Register,
  },
  mixins: [
    http,
    listMixin,
  ],
  computed: {
    ...mapGetters(['partnersTree']),
  },
  data() {
    return {
      partnerid: [],
      params: {
        partnerid: null,
        homeDeviation: null,
        companyDeviation: null,
      },
    };
  },
  watch: {
    partnerid(newValue) {
      if (newValue.length) {
        this.params.partnerid = newValue[newValue.length - 1];
      } else {
        this.params.partnerid = null;
      }
      this.getAll();
    },
  },
  beforeCreate() {
    this.name = '/vehicle/getAntiFraudVehicle';
  },
  created() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.$_geocoder = new AMap.Geocoder();
    });
  },
  methods: {
    init() {
      this.getAll();
      this.fetchPartners(true);
    },
    async getAll() {
      const { paging, dataPath } = this.getAllConfig;
      this.tableLoading = true;
      let params = {};
      if (paging) {
        // _.merge 会修改第一个参数原对象, 所以这里使用空对象 {}
        params = _.merge({}, this.params, this.pagination);
      } else {
        params = this.params;
      }
      try {
        const data = await this.apiPost(this.name, params);
        this.tableLoading = false;
        this.tableData = R.path(dataPath)(data).map((i) => {
          if (i.lngCompanyForecast && i.latCompanyForecast) {
            this.getAddress([i.lngCompanyForecast, i.latCompanyForecast])
                .then(({ regeocode: { formattedAddress } }) => {
                  i.companyForecast = formattedAddress;
                });
          }
          if (i.lngHomeForecast && i.latHomeForecast) {
            this.getAddress([i.lngHomeForecast, i.latHomeForecast])
                .then(({ regeocode: { formattedAddress } }) => {
                  i.homeForecast = formattedAddress;
                });
          }
          return i;
        });
        this.pagination.dataCount = data.page.counts;
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        this.tableLoading = false;
      }
    },
    getAddress(position) {
      return new Promise((resolve, reject) => {
        this.$_geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style lang="stylus" scoped>

</style>
