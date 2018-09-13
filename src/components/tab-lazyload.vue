<template lang="html">
  <el-tabs :type="type" @tab-click="onTabClick">
    <el-tab-pane :label="tab.label"
                 v-for="(tab,index) in tabs"
                 :key="index">
      <span slot="label" v-html="tab.label"></span>
      <component :is="tab.component" :ref="tab.label"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'border-card',
    },
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.onTabClick(this.tabs[0]);
  },
  methods: {
    onTabClick(tab) {
      const index = this.tabs.findIndex(item => item.label === tab.label);
      if (!this.tabs[index]) return;
      this.tabs[index].component = this.tabs[index].name;
      if (this.$refs[this.tabs[index].label]) {
        const el = this.$refs[this.tabs[index].label][0];
        /* eslint-disable no-unused-expressions */
        el && typeof el.refresh === 'function' && el.refresh();
      }
    },
  },
};
</script>

<style lang="css">
</style>
