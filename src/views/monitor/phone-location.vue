<template>
  <div class="wrapper">
    <h1>手机定位 <i class="el-icon-circle-close pointer" @click.stop="$emit('close')"></i></h1>
    <el-alert
      title="短信授权后才能通过手机号码查询位置"
      type="warning"
      show-icon>
    </el-alert>
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px" class="m-r-30 m-t-20">
      <el-form-item label="姓名:">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="手机:" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="formLoading" @click="onSubmit">授权</el-button>
      </el-form-item>
    </el-form>
    <h1>授权记录<i :class="`el-icon-${ listLoading ? 'loading' : 'refresh'} m-l-5 pointer c-blue`" @click.stop="getList"></i> <i @click.stop="$emit('clearMarkers')" class="handle-button">清除坐标</i></h1>
    <el-table height="auto" :data="data" size="mini" border>
      <el-table-column
        align="center"
        prop="username"
        label="姓名"
        width="75px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="手机号"
        width="95px">
      </el-table-column>
      <el-table-column
        align="center"
        prop="date"
        label="位置">
        <template slot-scope="{ row: { phone } }">
          <el-button size="mini" type="text" @click.stop="getRTAddress(phone)">实时</el-button>
          <el-button size="mini" type="text" @click.stop="getAddressList(phone)">历史</el-button>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="date"
        label="删除"
        width="45px">
        <template slot-scope="{ row: { phone } }">
          <el-button size="mini" type="text" icon="el-icon-delete" @click.stop="handlePhoneLocationClose(phone)"></el-button>
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
        @current-change="getList">
      </el-pagination>
    </div>
    <el-dialog
      id="phoneLocationHisDialog"
      :title="`历史手机定位(${currentPhone})`"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="30%">
      <el-table size="mini" :data="locationHisData" border @row-click="showPhoneLocationMarkers">
        <el-table-column
          align="center"
          type="index"
          width="30px">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createtime"
          label="时间"
          width="135px">
        </el-table-column>
        <el-table-column
          align="center"
          prop="location"
          label="地址">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import http from '@/assets/js/http';
import { phone } from '@/assets/js/regular-expression';

export default {
  mixins: [http],
  computed: {
    ...mapGetters(['point']),
  },
  data() {
    return {
      currentPhone: null,
      dialogVisible: false,
      locationHisData: [],
      pagination: {
        counts: 0,
        curPage: 1,
        pageSize: 20,
      },
      listLoading: false,
      formLoading: false,
      data: [],
      form: {
        username: null,
        phone: null,
      },
      rules: {
        // username: [
        //   { required: true, message: '请输入姓名' },
        // ],
        phone: [
          { required: true, message: '请输入手机号' },
          { pattern: phone, message: '请输入正确的手机号', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      await window.sleep(500);
      const { data, page: { curPage, counts } } = await this.apiPost('/phoneLocation/getPhoneList', this.pagination);
      this.data = data;
      this.pagination.curPage = curPage;
      this.pagination.counts = counts;
      this.listLoading = false;
    },
    onSubmit() {
      this.$refs.form.validate((pass) => {
        if (pass) {
          this.$confirm('本次授权将扣除 <i class="c-blue">20点数</i> ,是否进行短信授权?', '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            try {
              this.formLoading = true;
              const { message } = await this.apiPost('/phoneLocation/open', this.form);
              // const type = retCode === 0 ? 'success' : 'danger';
              this.$alert(message, '提示', {
                confirmButtonText: '确定',
              });
              this.getList();
              this.fetchPoint();
            } finally {
              this.formLoading = false;
            }
          }).catch(() => {
          });
        }
      });
    },
    handlePhoneLocationClose(phoneNum) {
      this.$confirm('确认取消此手机授权吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await this.apiPost('/phoneLocation/close', { phone: phoneNum });
        this.$message({
          message: '操作成功',
          type: 'success',
        });
        this.getList();
      }).catch(() => {
      });
    },
    showPhoneLocationMarkers(data) {
      this.$emit('showPhoneLocationMarkers', data);
    },
    getRTAddress(phoneNum) {
      this.$confirm('获取实时位置将扣除 <i class="c-blue">20点数</i> ,是否继续?', '提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: '正在获取位置...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        try {
          const { data, retCode, message } = await this.apiPost('/phoneLocation/query', { phone: phoneNum });
          if (retCode === 0 && data === '') {
            this.$alert(message, '提示', {
              confirmButtonText: '确定',
            });
            return;
          }
          this.showPhoneLocationMarkers(data[0]);
          this.fetchPoint();
        } finally {
          loading.close();
        }
      }).catch(() => {
      });
    },
    async getAddressList(phoneNum) {
      const { data } = await this.apiPost('/phoneLocation/getPhoneLocationHis', { phone: phoneNum });
      this.locationHisData = data;
      this.currentPhone = phoneNum;
      this.dialogVisible = true;
    },
    ...mapActions(['fetchPoint']),
  },
};
</script>

<style lang="stylus" scoped>
  .wrapper
    display flex
    flex-direction column
    width 100%
    height 100%
    background #fff
    h1
      box-sizing border-box
      width 100%
      padding 10px 0px 10px 15px
      background #F1F2F7
      color #333
      line-height 14px
      font-size 14px
      border-top 1px solid #ddd
      border-bottom 1px solid #ddd
      i:last-child
        float right
        margin-right 10px
        &.handle-button
          font-style normal
          color #409EFF
          cursor pointer
          font-size 12px
</style>

<style>
  #phoneLocationHisDialog>.el-dialog {
    left: 435px;
    top: -40px;
  }
</style>

