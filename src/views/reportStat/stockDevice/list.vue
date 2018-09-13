<template>
  <div class="">
    <!-- <div class="m-b-5 ovf-hd fz-14 search-bar">
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
    </div> -->
    <zk-table
      ref="table"
      :data="data"
      :columns="columns"
      :expand-type="false"
      :selection-type="false">
    </zk-table>
    <!-- <el-table
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
        width="160"
        property="partnername"
        label="账号名称">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="totalCount"
        label="总数量">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="totalActiveCount"
        label="总激活数">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="noActiveCount"
        label="未激活数">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="todayActiveCount"
        label="今日激活">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="onlineCount"
        label="在线设备数">
      </el-table-column>
      <el-table-column
        align="center"
        width="100"
        property="offlineCount"
        label="离线设备数">
      </el-table-column>
      <el-table-column
        property=""
        label="">
      </el-table-column>
    </el-table> -->
    <!-- <div class="pos-rel p-t-20 p-b-20 pages-footer">
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
    </div> -->
  </div>
</template>

<script>
import http from '@/assets/js/http';
// import listMixin from '@/assets/js/list_com';

import { mapGetters, mapActions } from 'vuex';

export default {
  // name: escapeName(''),
  mixins: [
    http,
  ],
  data() {
    return {
      data: [],
      partnerid: [],
      params: {
        partnerid: null,
      },
      columns: [
        {
          label: '账号名称',
          prop: 'partnername',
        },
        {
          label: '总数量',
          prop: 'totalCount',
        },
        {
          label: '总激活数',
          prop: 'totalActiveCount',
        },
        {
          label: '未激活数',
          prop: 'noActiveCount',
        },
        {
          label: '今日激活',
          prop: 'todayActiveCount',
        },
        {
          label: '在线设备数',
          prop: 'onlineCount',
        },
        {
          label: '离线设备数',
          prop: 'offlineCount',
        },
      ],
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
  computed: {
    multiple() {
      return Lockr.get('securId') === 2 ? 1 : 1;
    },
    ...mapGetters(['partnersTree']),
  },
  async mounted() {
    this.fetchPartners(true);
    const { data } = await this.apiPost('/device/getStockDeviceList', { pageSize: 10000 });
    this.data = this.listToTree(data);
  },
  methods: {
    listToTree(list) {
      const tree = (partnerid, data) => {
        const arr = [];
        data.forEach((item) => {
          if (item.parentid === partnerid) {
            const children = tree(item.partnerid, data);
            item.noActiveCount *= this.multiple;
            item.offlineCount *= this.multiple;
            item.onlineCount *= this.multiple;
            item.todayActiveCount *= this.multiple;
            item.totalActiveCount *= this.multiple;
            item.totalCount *= this.multiple;
            const temp = { ...item };
            item.children = [];
            if (children.length) {
              temp.partnername += '(自身)';
              item.children.push(temp);
            }
            item.children.push(...children);
            item.noActiveCount = Number(item.noActiveCount) +
                                  _.sumBy(children, i => i.noActiveCount - 0);
            item.offlineCount = Number(item.offlineCount) +
                                  _.sumBy(children, i => i.offlineCount - 0);
            item.onlineCount = Number(item.onlineCount) +
                                  _.sumBy(children, i => i.onlineCount - 0);
            item.todayActiveCount = Number(item.todayActiveCount) +
                                      _.sumBy(children, i => i.todayActiveCount - 0);
            item.totalActiveCount = Number(item.totalActiveCount) +
                                      _.sumBy(children, i => i.totalActiveCount - 0);
            item.totalCount = Number(item.totalCount) +
                                _.sumBy(children, i => i.totalCount - 0);
            arr.push(item);
          }
        });
        return arr;
      };
      const res = tree(String(Lockr.get('partnerid')), list);
      return res;
    },
    ...mapActions([
      'fetchPartners',
    ]),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
