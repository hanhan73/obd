<template>
  <el-dialog
    custom-class="report-dialog"
    title="风险评估报告"
    top="7vh"
    width="900px"
    :append-to-body="true"
    :visible.sync="dialogFormVisible">
    <section v-if="loading" class="loading">
      <i class="el-icon-loading"></i>
    </section>
    <report-table v-else ref="reportTable"></report-table>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import ReportTable from './report-table';

export default {
  mixins: [http],
  components: {
    ReportTable,
  },
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
    open(row) {
      const { queryType, id } = row;
      this.dialogFormVisible = true;
      this.row = row;
      this.loading = true;
      this.fkApiPost('/appOrderResult/NewGetResultById2', { queryType, id }).then((response) => {
        this.loading = false;
        this.report = response.obj.orderresult;
        this.$nextTick(() => {
          this.$refs.reportTable.open(this.row, this.report);
        });
      });
    },
  },
};
</script>

<style lang="stylus">
  .report-dialog {
    margin-bottom: 7vh;
  }
</style>

<style lang="stylus" scoped>
  .loading {
    text-align: center;
    padding: 20px 0px;
    font-size: 20px;
  }
  .container {
    background-position: center right;
    background-repeat: no-repeat;
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
