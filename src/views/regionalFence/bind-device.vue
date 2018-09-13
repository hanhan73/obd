<template>
  <el-dialog
      ref="dialog"
      :title="`围栏【${desc}】关联设备列表`"
      custom-class="w-1000"
      :modal-append-to-body="false"
      :append-to-body="true"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else class="bindDeviceWrapper">
      <div class="left">
        <el-tree
          style="height: 100%; overflow-y: auto;border: 1px solid #ccc;"
          ref="tree"
          node-key="id"
          :data="treeData"
          :default-checked-keys="[]"
          :render-content="renderContent"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expanded-keys="defaultExpandedKeys"
          @node-click="handleNodeClick">
        </el-tree>
      </div>
      <div class="right">
        <div class="search-bar">
          <el-radio-group v-model="params.isbind" size="mini" @change="handleChange">
            <el-radio-button :label="1">绑定新设备</el-radio-button>
            <el-radio-button :label="0">已绑定设备</el-radio-button>
          </el-radio-group>
          <el-select size="mini" v-model="params.type" class="w-100">
            <el-option :value="0" label="设备名称"></el-option>
            <el-option :value="1" label="SN"></el-option>
          </el-select>
          <el-input size="mini" v-model="params.devicename" placeholder="请输入" class="w-200"></el-input>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getAll"></el-button>
          <el-button v-if="params.isbind === 1" key="bind" size="mini" type="primary" @click="handleBatchBind">绑定</el-button>
          <el-button v-else key="unbind" size="mini" type="danger" @click="handleBatchRemoveRelation">取消绑定</el-button>
        </div>
        <el-table key="unbind"
                  stripe
                  :data="tableData"
                  size="mini"
                  height="auto"
                  class="w-100p"
                  v-loading="tableLoading"
                  @selection-change="(selection) => this.selection = selection">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="devicename"
            label="设备名称">
          </el-table-column>
          <el-table-column
            v-if="params.isbind === 1"
            key="unbind"
            prop="sn"
            label="SN">
          </el-table-column>
          <el-table-column
            v-else
            key="bound"
            label="报警类型">
            <template slot-scope="{ row: { mindType, isEdit }, $index }">
              <span v-if="!isEdit">{{mindType | showMindType}}</span>
              <el-select v-else v-model="tableData[$index].editMindType" size="mini">
                <el-option :value="1" label="进围栏"></el-option>
                <el-option :value="2" label="出围栏"></el-option>
                <el-option :value="0" label="进出围栏"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="{ row: { sn, isEdit }, $index }">
              <el-button v-if="params.isbind === 1" size="mini" type="text" @click.stop="handleSingleBind(sn)">绑定</el-button>
              <div v-else>
                <el-button v-if="!isEdit" key="edit" size="mini" type="text" @click.stop="tableData[$index].isEdit = true">修改</el-button>
                <el-button v-else key="save" size="mini" type="text" @click.stop="handleSaveEditMindType($index)">保存</el-button>
                <el-button size="mini" type="text" @click.stop="handleRemoveRelation(sn)">移除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="tx-c pagination"
          small
          layout="prev, pager, next"
          :total="pagination.dataCount"
          :page-size="pagination.pageSize"
          :current-page.sync="pagination.curPage"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import listMixin from '@/assets/js/list_com';
import PartnerMixin from '@/assets/js/partner_com';

export default {
  mixins: [
    http,
    listMixin,
    PartnerMixin,
  ],
  filters: {
    showMindType(mindType) {
      if (mindType === 0) {
        return '进出围栏';
      } else if (mindType === 1) {
        return '进围栏';
      } else if (mindType === 2) {
        return '出围栏';
      }
      return '';
    },
  },
  data() {
    const params = {
      isbind: 0,
      type: 0,
      q: null,
      partnerid: null,
      userId: null,
      groupId: null,
    };
    this._params = _.cloneDeep(params);
    return {
      desc: null,
      preLoading: false,
      selection: [],
      dialogVisible: false,
      treeData: [],
      params,
      form: {
      },
      rules: {
        desc: [{ required: true, message: '请输入围栏名称' }],
        mindType: [{ required: true, message: '请输入围栏类型' }],
      },
    };
  },
  beforeCreate() {
    this.name = '/fence/queryRelationByFenceId';
  },
  computed: {
    defaultExpandedKeys() {
      return [Lockr.get('partnerid')];
    },
  },
  methods: {
    init() {
    },
    async open(fenceId, type, desc) {
      this.resetParams();
      this.desc = desc;
      this.dialogVisible = true;
      this.preLoading = true;
      this.params.fenceId = fenceId;
      const { data } = await this.apiPost('/partner/qryPartnerUserByPId', {});
      // this.treeData = this.normalizePartner(data, true);
      const children = this.normalizePartner(data, true);
      this.treeData = [{
        id: Lockr.get('partnerid'),
        userid: Lockr.get('securId'),
        name: Lockr.get('seusername'),
        icon: 'home',
        total: _.sumBy(children, 'total'),
        online: _.sumBy(children, 'online'),
        children,
      }];
      this.getAll();
      this.params.isbind = type;
      this.preLoading = false;
    },
    handleChange() {
      this.pagination.curPage = 1;
      this.getAll();
    },
    handleClose() {
      //
    },
    resetParams() {
      this.pagination.curPage = 1;
      this.params = _.cloneDeep(this._params);
    },
    async handleSaveEditMindType($index) {
      const { editMindType, sn } = this.tableData[$index];
      try {
        await this.apiPost('/fence/upRelation', { mindType: editMindType, sn, fenceId: this.params.fenceId });
        _g.toastMsg('success', '修改成功');
        this.getAll();
      } catch (e) {
        //
      }
    },
    handleSingleBind(sns) {
      this.$emit('handleBindDevice', { fenceid: this.params.fenceId, sns });
    },
    handleBatchBind() {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请选择需要绑定的设备');
        return;
      }
      this.$emit('handleBindDevice', { fenceid: this.params.fenceId, sns: this.selection.map(i => i.sn).join(',') });
    },
    handleRemoveRelation(sns) {
      this.$confirm('确定移除该设备与围栏的绑定关系吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await this.apiPost('/fence/delRelation', { fenceId: this.params.fenceId, sns });
          _g.toastMsg('success', '移除成功');
          this.getAll();
        } catch (e) {
          //
        }
      }).catch(() => {});
    },
    handleBatchRemoveRelation() {
      if (!this.selection.length) {
        _g.toastMsg('warning', '请先选择设备');
        return;
      }
      this.$confirm('确定移除这些设备与围栏的绑定关系吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          await this.apiPost('/fence/delRelation', { fenceId: this.params.fenceId, sns: this.selection.map(i => i.sn) });
          _g.toastMsg('success', '批量移除成功');
          this.getAll();
        } catch (e) {
          //
        }
      }).catch(() => {});
    },
    handleNodeClick(node) {
      this.pagination.curPage = 1;
      this.params.partnerid = null;
      this.params.userId = null;
      this.params.groupId = null;
      const { id, userid } = node;
      if (typeof id === 'number') {
        this.params.partnerid = id;
        this.params.userId = userid;
      } else if (typeof id === 'string') {
        // n: 车辆, z: 分组 d: 设备
        const _id = id.substring(2);
        const prefix = id.substring(0, 1);
        if (prefix === 'z') {
          this.params.groupId = _id;
        }
      }
      this.getAll();
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
        if (paging) {
          // 是否包含报表数据
          this.tableData = R.path(dataPath)(data).map((i) => {
            i.isEdit = false;
            i.editMindType = i.mindType;
            return i;
          });
          this.pagination.dataCount = data.page.counts;
        } else {
          this.tableData = data.data;
        }
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        this.tableLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .bindDeviceWrapper
    display: flex
    height: 400px
    .left
      flex: 0 0 250px
    .right
      width: 0
      margin-left: 5px
      flex: 1 1 auto
      display: flex
      flex-direction: column
      .search-bar
        flex: 0 0 auto
        margin-bottom: 5px
      .table
        flex: 1 1 auto
      .pagination
        flex: 0 0 auto
</style>
