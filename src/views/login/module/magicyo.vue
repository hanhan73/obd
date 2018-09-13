<template>
  <div class="login-wrapper">
    <img src="~static/website-setting/magicyo/logo.png" height="50px" class="logoImg" alt="">
    <h1 class="logo-title">深圳市高新兴物联科技有限公司</h1>
    <div class="login">
      <input-module></input-module>
    </div>
  </div>
</template>

<script>
import InputModule from '../inputModule';

export default {
  components: {
    InputModule,
  },
};
</script>

<style lang="stylus">
.login-wrapper
  position relative
  width: 100%
  height: 100%
  .logoImg
    float: left;
    margin-top: 10px;
    margin-left: 15%
  .logo-title
    float: left;
    margin-left: 15px;
    line-height 70px;
    font-size: 26px;
    // font-weight: bold;
  .login
    position: absolute
    top: 70px
    bottom: 0
    left: 0
    right: 0
    width: 100%
    background-image: url('~static/dcszx_login_bg.jpg')
    background-size: cover
    background-position: 50%
    .login-container
      // right: 5%
      top: 380px
</style>
