<template>
  <el-dialog
      ref="dialog"
      :title="`${activeDate}---新增激活设备详情`"
      :append-to-body="true"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section class="main" v-else>
      <el-tree highlight-current
              node-key="partnerid"
              :data="data"
              :props="{ label: 'partnername' }"
              :expand-on-click-node="false"
              :render-content="renderContent"
              :default-expanded-keys="defaultExpandedKeys"
              @node-click="handleNodeClick"
              ref="tree">
      </el-tree>
      <el-table :data="list" size="mini" border stripe >
        <el-table-column prop="devicename" label="设备名称">
        </el-table-column>
        <el-table-column prop="partnername" label="账号名称">
        </el-table-column>
        <el-table-column width="125" prop="sn" label="IMEI">
        </el-table-column>
        <el-table-column width="135" prop="activeDate" label="激活日期">
        </el-table-column>
      </el-table>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';

import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [http],
  data() {
    return {
      preLoading: false,
      dialogVisible: false,
      data: [],
      activeDate: null,
      list: [],
    };
  },
  computed: {
    defaultExpandedKeys() {
      return [this.partnerid];
    },
    partnername() {
      return Lockr.get('partnername');
    },
    partnerid() {
      return Lockr.get('partnerid') - 0;
    },
    action() {
      return `${HOST}/device/importDevice`;
    },
    ...mapGetters(['partnersTree']),
  },
  methods: {
    init() {},
    async open(activeDate) {
      this.resetData();
      this.dialogVisible = true;
      this.preLoading = true;
      this.activeDate = activeDate;
      // await this.fetchPartners(true);
      const { data } = await this.apiPost('/device/getActDeviceNum', { activeDate });
      this.data = this.listToTree(data);
      this.preLoading = false;
    },
    resetData() {
      this.list = [];
      this.data = [];
    },
    listToTree(list) {
      function tree(data, pId) {
        const arr = [];
        data.forEach((item) => {
          if (parseInt(item.parentid, 10) === pId) {
            const subArr = tree(data, item.partnerid);
            item.children = subArr;
            item.activeNum = (item.activeNum - 0) + _.sumBy(subArr, 'activeNum');
            arr.push(item);
          }
        });
        return arr;
      }
      const children = tree(list, this.partnerid);
      return [
        {
          partnerid: this.partnerid,
          partnername: this.partnername || Lockr.get('seusername'),
          activeNum: _.sumBy(children, 'activeNum'),
          children,
        },
      ];
    },
    async handleNodeClick({ partnerid }) {
      const activeDate = this.activeDate;
      const { data } = await this.apiPost('/device/getActDeviceByDate', { partnerid, activeDate, pageSize: 10000 });
      this.list = data;
    },
    renderContent(h, { node, data }) {
      return (
        <span
          class={{
            'el-tree-node__label': true,
            'c-sliver': data.isonline === false,
            'c-green': data.isonline === true,
          }}
        >
          <i class={`c-blue fa fa-${data.icon}`} aria-hidden="true" />
          &nbsp;
          {node.label}
          &nbsp;
          (<i class="f-w-b c-green">{data.activeNum}</i>)
        </span>
      );
    },
    ...mapActions(['fetchPartners']),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .main
    display flex
    .el-tree
      flex 0 0 150px
      margin-right: 5px

</style>
