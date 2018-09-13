<template>
  <components :is="$configuration.name"></components>
</template>

<script>
import Gps from './module/gps';
import Dcszx from './module/dcszx';
import Huaxin from './module/huaxin';
import magicyo from './module/magicyo';
import htdx from './module/htdx';

export default {
  components: {
    Gps,
    Dcszx,
    Huaxin,
    magicyo,
    htdx,
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
