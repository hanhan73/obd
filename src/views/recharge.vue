<template>
  <div class="point-wrapper">
    点数: <i>{{point}}</i>
    <el-popover
      placement="bottom"
      width="280"
      trigger="click">
      <span slot="reference" class="recharge">(充值)</span>
      <el-radio-group v-model="form.totalFee" size="small">
        <el-radio v-for="i in rechargeOptions"
                  :label="i.value"
                  :key="i.value"
                  border>{{i.value}}元</el-radio>
      </el-radio-group>
      <div class="button-wrapper">
        <el-button type="primary" size="mini" @click.stop="toPay">充值</el-button>
      </div>
    </el-popover>
    <el-dialog
      title="微信扫码支付"
      width="500px"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <template slot="title">
        <img height="24px" src="/static/WePayLogo.png" alt="">
      </template>
      <div class="qrcode">
        <i v-if="qrcodeLoading" class="el-icon-loading" style="font-size: 24px"></i>
        <div v-else class="pay-container">
          <h2 class="c-main">金额: <span class="c-primary">{{form.totalFee}}</span> 元</h2>
          <img height="300px" width="300px" :src="`http://qr.liantu.com/api.php?text=${code_url}`" alt="">
          <img src="/static/wechatPayTxt.png" alt="">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" :loading="getWechatOrderLoading" @click="onPayDone">已完成支付</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import http from '@/assets/js/http';

export default {
  mixins: [http],
  computed: {
    ...mapGetters(['point']),
  },
  data() {
    return {
      qrcodeLoading: false,
      getWechatOrderLoading: false,
      code_url: null,
      dialogVisible: false,
      rechargeOptions: [
        { value: 10 },
        { value: 50 },
        { value: 100 },
        { value: 500 },
        { value: 1000 },
        { value: 5000 },
      ],
      form: {
        body: '掌云风控点数充值',
        totalFee: 100,
      },
    };
  },
  mounted() {
    this.fetchPoint();
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    toPay() {
      this.dialogVisible = true;
      const form = { ...this.form };
      form.totalFee *= 100;
      this.qrcodeLoading = true;
      this.fkApiPost('/wxpay/wxpayforweb', form).then((response) => {
        const { obj: { code_url, out_trade_no } } = response;
        // eslint-disable-next-line
        this.code_url = code_url;
        // eslint-disable-next-line
        this._outTradeNo = out_trade_no;
        this.qrcodeLoading = false;
      });
    },
    onPayDone() {
      this.getWechatOrderLoading = true;
      this.fkApiPost('/wxpay/orderQuery', { outTradeNo: this._outTradeNo })
        .then((response) => {
          this.getWechatOrderLoading = false;
          const { obj: { trade_state } } = response;
          // eslint-disable-next-line
          if (trade_state === 'SUCCESS') {
            this.$confirm(`成功支付 ${this.form.totalFee} 元`, '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              closeOnClickModal: false,
              showClose: false,
              type: 'success',
            })
              .then(() => {
                this.dialogVisible = false;
                this.fetchPoint();
              })
              .catch(() => {});
          } else {
            this.$confirm('查此订单尚未支付, 如有疑问请联系客服', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
            })
              .then(() => {})
              .catch(() => {});
          }
        })
        .catch(() => {
          this.getWechatOrderLoading = false;
        });
    },
    ...mapActions(['fetchPoint']),
  },
};
</script>

<style lang="stylus" scoped>
  .point-wrapper
    margin-right 15px
    padding-left 15px
    color #333
    line-height 40px
    border-left 1px solid rgb(220, 223, 230)
    i
      font-weight bold
    .recharge
      font-size 14px
      cursor pointer
      &:hover
        color #409EFF

  .button-wrapper
    padding-top 10px
    margin-top 10px
    border-top 1px solid #DCDFE6
    text-align center
  .el-radio-group
    display flex
    flex-wrap wrap
    justify-content space-between
    .el-radio
      width 90px
      margin-left 0px
      margin-bottom 5px
      text-align center
      +.el-radio
        margin-left 0px

  .qrcode
    text-align center
    .c-main
      font-weight bold
      font-size 18px
      .c-primary
        color #409EFF
    .pay-container
      display inline-block
  .dialog-footer
    text-align center
</style>
