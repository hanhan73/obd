<template>
  <el-dialog
      custom-class="w-700"
      ref="dialog"
      title="新增车辆"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <add-form ref="addForm" @close="dialogVisible = false" @init="$emit('init')" @handleAddDevice="$emit('handleAddDevice')"></add-form>
  </el-dialog>
</template>

<script>
import AddForm from './add-form';

export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    async open(isAddDevice) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addForm.open(isAddDevice);
      });
    },
  },
  components: {
    AddForm,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
