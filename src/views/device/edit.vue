<template>
  <el-dialog
      custom-class="body-p-b-15"
      ref="dialog"
      title="编辑设备"
      size="small"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <edit-form ref="editForm" @close="dialogVisible = false" @init="$emit('init')"></edit-form>
  </el-dialog>
</template>

<script>
import EditForm from './edit-form';

export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    async open(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.editForm.open(id);
      });
    },
  },
  components: {
    EditForm,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
