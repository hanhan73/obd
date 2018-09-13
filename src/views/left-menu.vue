<template>
  <div>
    <el-menu class="leftMenu"
             background-color="#495060"
             text-color="#fff"
             active-text-color="#ffd04b"
             :class="leftMenuShrink ? 'shrink' : ''"
             :collapse="true">
      <el-submenu v-for="(item, index) in menu"
                  :key="item.name"
                  :index="item.name"
                  @click.native="handleSelect(item)">
        <template slot="title">
          <i class="fa" style="width: 16px" :class="`fa-${item.icon}`" aria-hidden="true"></i>
          &nbsp;
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item-group v-if="item.children.length" class="leftMenuGroup" v-for="(item1, index1) in item.children" :key="index1">
          <!-- <el-tag class="w-100p" style="border-radius: 0px">{{item1.name}}</el-tag> -->
          <el-menu-item v-for="(item2, index2) in item1.children"
                        :key="`${item2.name}${item1.name}`"
                        :index="`${item2.name}${item1.name}`"
                        @click.native="handleSelect(item2)">
            {{item2.name}}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['leftMenuShrink'],
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'menu',
    ]),
  },
  methods: {
    handleSelect(item) {
      if (!item.path) return;
      this.$emit('handleSelect', item);
    },
  },
};
</script>

<style lang="stylus">
  .leftMenu.el-menu
    border: none
    width: 120px
    >.el-menu-item span,
    >.el-submenu>.el-submenu__title span
      height: auto
      width: 50px
      overflow: visible
      visibility: visible
      display: inline-block
    >.el-submenu .el-menu
      z-index: 10001
    &.shrink
      width: 60px
      >.el-menu-item span,
      >.el-submenu>.el-submenu__title span
        display: none

  .leftMenuGroup
    .el-menu-item-group__title
      padding: 0px

  .el-menu--popup
    padding: 0px;
</style>
