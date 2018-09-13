<template>
  <div class="login-wrapper">
    <img src="~static/website-setting/htdx/title.png" class="logoImg" alt="">
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
    height 70px
    margin-left: 15%
  .login
    position: absolute
    top: 70px
    bottom: 0
    left: 0
    right: 0
    width: 100%
    background-image: url('~static/website-setting/htdx/banner.jpg')
    background-size: cover
    background-position: 50%
    .login-container
      // right: 5%
      top: 380px
</style>
