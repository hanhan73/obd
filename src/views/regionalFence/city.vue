<template>
  <div class="city-wrapper">
    <!-- <el-input
      class="filter"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      @change="handleFilter">
    </el-input> -->
    <h2 class="title">城市列表</h2>
    <el-tree class="tree"
             lazy
             :data="areaNode"
             :props="defaultProps"
             :filter-node-method="filterNode"
             :load="handleTreeLoad"
             :highlight-current="true"
             @node-click="handleNodeClick"
             ref="tree">
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    areaNode: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        // children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
      },
    };
  },
  computed: {},
  methods: {
    init() {
      // TODO
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleFilter(text) {
      this.$refs.tree.filter(text);
    },
    handleNodeClick(data) {
      this.$emit('handleNodeClick', data);
    },
    handleTreeLoad(node, resolve) {
      this.$emit('handleTreeLoad', { node, resolve });
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .city-wrapper
    display: flex
    height: 100%
    flex-direction: column
    .title
      padding: 8px  0px
      background: #fff
      text-align: center
      font-weight: bold
      color: #666
    .tree
      flex: 1 1 auto
      overflow-y: auto
</style>
