<template>
  <div class="login">
    <input-module class="login-container"></input-module>
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
  .login
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    width: 100%
    height: 100%
    background-image: url('~static/home-bg1.jpg')
    background-size: cover
    background-position: 50%
</style>
