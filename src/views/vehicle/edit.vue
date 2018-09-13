<template>
  <el-dialog
      custom-class="w-700 body-p-b-15"
      ref="dialog"
      title="编辑车辆"
      size="small"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane name="editForm" label="基本信息">
          <edit-form ref="editForm" @close="dialogVisible = false" @init="$emit('init')"></edit-form>
        </el-tab-pane>
        <el-tab-pane name="otherEditForm" label="保险/保养/年检信息">
          <other-edit-form ref="otherEditForm" @close="dialogVisible = false" @init="$emit('init')"></other-edit-form>
        </el-tab-pane>
      </el-tabs>
  </el-dialog>
</template>

<script>
import EditForm from './edit-form';
import OtherEditForm from './other-edit-form';

export default {
  data() {
    return {
      activeName: 'editForm',
      dialogVisible: false,
    };
  },
  methods: {
    async open(id) {
      this.dialogVisible = true;
      this.id = id;
      this.activeName = 'editForm';
      this.$nextTick(() => {
        this.$refs.editForm.open(id);
      });
    },
    handleTabClick({ name }) {
      this.$nextTick(() => {
        this.$refs[name].open(this.id);
      });
    },
  },
  components: {
    EditForm,
    OtherEditForm,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
