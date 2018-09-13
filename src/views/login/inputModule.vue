<template>
  <el-card class="login-container">
    <div slot="header" class="header">
      <i class="fa fa-sign-in" aria-hidden="true"></i> 欢迎登陆
      <el-button @click="jumpToFK" class="m-l-30" type="text" size="mini" style="padding: 0px">贷前征信大数据查询</el-button>
    </div>
    <el-row type="flex">
      <el-col :span="13" style="padding: 0 30px 0 5px; border-right: 1px dashed #DCDFE6">
        <el-form :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-position="left"
                label-width="0px"
                class="login-ruleForm m-t-10">
          <el-form-item prop="useraccount">
            <el-input @keyup.native.enter="handleSubmit" type="text" v-model.trim="ruleForm.useraccount" auto-complete="off" placeholder="账号">
              <i slot="prefix" class="fa fa-user m-l-5" aria-hidden="true"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="userpwd">
            <el-input @keyup.native.enter="handleSubmit" type="password" v-model.trim="ruleForm.userpwd" auto-complete="off" placeholder="密码">
              <i slot="prefix" class="fa fa-lock m-l-5" aria-hidden="true"></i>
            </el-input>
          </el-form-item>
          <!-- <el-form-item prop="checkCode">
            <el-input class="checkCodeInput" :maxlength="4" @keyup.native.enter="handleSubmit" type="text" v-model.trim="ruleForm.checkCode" auto-complete="off" placeholder="验证码">
              <template slot="append"><img slot="suffix" @click="refreshRandom" title="点击刷新验证码" :src="captchaImgSrc" height="36px" width="92px" alt="点击刷新验证码" class="pointer ve-m"></template>
            </el-input>
          </el-form-item> -->
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
          <el-form-item  style="width:100%;">
            <el-button type="primary"
                        style="width:100%"
                        @click.native.prevent="handleSubmit"
                        :loading="logining">
              登录
            </el-button>
            <div class="tx-c">
              <el-tooltip placement="top">
                <div slot="content">
                  <h2 class="tx-c m-b-10 m-t-5">使用微信扫一扫申请账号</h2>
                  <img src="/static/apply-account.png" alt="">
                </div>
                <el-button type="text" size="mini">没有账号?点我</el-button>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="11" class="tx-c">
        <h1 class="m-b-5" style="color: #909399">扫码二维码下载APP</h1>
        <img width="200px" :src="$configuration.appDownloadImg" alt="">

        <h1 class="m-b-5 m-t-15" style="margin: 0 20px; color: #909399; padding-top: 15px; border-top: 1px dashed #DCDFE6">下载专用浏览器</h1>
        <el-button size="mini" type="text" @click="handleDownLoadChrome">Chrome谷歌浏览器</el-button>
        <el-button size="mini" type="text" @click="handleDownLoadFireFox">FireFox火狐浏览器</el-button>
      </el-col>
    </el-row>
    <template v-if="$configuration.appDownloadImg !== ''">
      <!-- <el-popover
        ref="qrcode"
        placement="bottom"
        width="200"
        popper-class="qrcode-popper"
        trigger="hover">
        <img width="200px" :src="$configuration.appDownloadImg" alt="">
      </el-popover>
      <h1 class="tx-c m-t-20 pointer" style="color: #909399">下载专用浏览器</i></h1>
      <h1 v-popover:qrcode class="tx-c m-t-20 pointer" style="color: #909399">下载{{$configuration.title}}APP <i class="fa fa-qrcode" aria-hidden="true"></i></h1> -->
    </template>
  </el-card>
</template>

<script>
import http from '@/assets/js/http';
import md5 from 'js-md5';
import { mapActions } from 'vuex';

export default {
  mixins: [http],
  data() {
    return {
      showAppQrCode: true,
      random: Math.random(),
      logining: false,
      ruleForm: {
        useraccount: '',
        userpwd: '',
        // checkCode: '',
      },
      rules: {
        useraccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        userpwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        checkCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      checked: true,
    };
  },
  computed: {
    captchaImgSrc() {
      // const domain = BUILD_MODE === 'local' ? 'http://zy.dtmobi.com:8080' : API_DOMAIN;
      // return `${domain}/new-gps-web/dync_captcha.jpg?random=${this.random}`;
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate(async (pass) => {
        if (pass) {
          const PASSWORD = md5(md5(this.ruleForm.userpwd));
          const form = _.cloneDeep(this.ruleForm);
          // form.userpwd = PASSWORD;
          this.logining = true;
          try {
            const res = await this.obdApiPost('/backUser/login', form);
            Lockr.set('PASSWORD', PASSWORD);
            this.resetCommonData(res);
            _g.toastMsg('success', '登录成功');
            setTimeout(() => {
              this.logining = false;
              // this.$router.push('/main');
              window.location.href = '/#/main';
              window.location.reload();
            }, 1000);
          } catch (e) {
            this.refreshRandom();
            this.logining = false;
          }
        }
      });
    },
    jumpToFK() {
      window.open('http://fk.dtmobi.com');
    },
    refreshRandom() {
      this.random = Math.random();
    },
    handleDownLoadChrome() {
      window.open('http://p2h0wfe9m.bkt.clouddn.com/ChromeStandalone_65.0.3325.146_Setup.exe');
    },
    handleDownLoadFireFox() {
      window.open('http://p2h0wfe9m.bkt.clouddn.com/Firefox-58.0.2.6611-setup.exe');
    },
    ...mapActions([
      'fetchMenu',
    ]),
  },
};
</script>

<style lang="stylus">
  .login-container
    position: absolute
    right: 30px
    top: 50%
    width: 580px
    transform: translateY(-60%)
    z-index: 1
    background: #fff
    .el-card__body
      padding-right: 0px
    .header
      font-size: 14px
      font-weight: bold
    .remember
      margin: 0px 0px 15px 0px
    .login-ruleForm
      >.el-form-item:last-child
        margin-bottom: 0px
      .checkCodeInput
        .el-input-group__append
          padding: 0px

  .qrcode-popper
    transform translateY(20px)
</style>
