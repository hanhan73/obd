<template>
  <el-popover
    placement="top-start"
    trigger="hover"
    @show="handlePopoverShow(id)">
    <div class="tx-c">
      <i class="el-icon-loading" v-show="isLoading"></i>
      {{detail}}
    </div>
    <el-button slot="reference" key="detail" type="primary" size="mini" @click.stop>查看处理详情</el-button>
  </el-popover>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  props: ['id'],
  data() {
    return {
      isLoading: false,
      detail: null,
    };
  },
  methods: {
    async handlePopoverShow(id) {
      this.isLoading = true;
      try {
        const { data: [{ handlecontent }] } = await this.apiPost('/deviceAlert/queryHandles', { devicealertid: id });
        this.detail = handlecontent;
      } catch (e) {
        this.detail = '获取失败, 请稍后再试';
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
