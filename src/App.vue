<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~@/assets/stylus/index'
  @import '~@/assets/stylus/reset'
</style>

<style>
@import "assets/css/font-awesome.min.css";
@import "assets/css/global.css";
@import "assets/css/base.css";

body {
  width: 100%;
  /* overflow: hidden; */
  margin: 0px;
  padding: 0px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  min-height: 700px;
  min-width: 1250px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
}

</style>
