<template>
  <div class="photo-wrapper">
    <section>
      <h1>设备和车牌照片</h1>
      <img @click="handleOpen(devACarImage)" v-if="devACarImage !== ''" :src="devACarImage" alt="暂无照片">
      <p v-else>暂无照片</p>
    </section>
    <section>
      <h1>安装位置照片</h1>
      <img @click="handleOpen(positionImage)" v-if="positionImage !== ''" :src="positionImage" alt="暂无照片">
      <p v-else>暂无照片</p>
    </section>
    <section>
      <h1>行驶证照片</h1>
      <img @click="handleOpen(driLicenseImage)" v-if="driLicenseImage !== ''" :src="driLicenseImage" alt="暂无照片">
      <p v-else>暂无照片</p>
    </section>
  </div>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      devACarImage: null,
      positionImage: null,
      driLicenseImage: null,
    };
  },
  methods: {
    async open(id) {
      const { data } = await this.apiPost('/device/getDeviceById', { id });
      this.devACarImage = data.devACarImage;
      this.positionImage = data.positionImage;
      this.driLicenseImage = data.driLicenseImage;
    },
    handleOpen(src) {
      window.open(src);
    },
  },
};
</script>

<style lang="stylus" scoped>
  .photo-wrapper
    display flex
    section
      flex 1 1 50%
      width 0
      text-align center
      margin-right 7px
      h1
        margin-bottom 15px
        border-bottom 1px solid #ccc
      img
        width 100%
        height 400px
      p
        color #C0C4CC
</style>
