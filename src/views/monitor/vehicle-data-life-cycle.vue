<template>
  <ul class="custom-timeline">
    <li v-for="(i, index) in list" :key="index" class="item">
      <div class="item-tail"></div>
      <div class="item-head blue"></div>
      <div class="item-content">
        <p class="time">{{i.time.substring(0, 10)}}<span class="hhmmss">{{i.time.substring(10)}}</span></p>
        <p class="content">{{i.title}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    return {
      list: [],
    };
  },
  methods: {
    open(sn) {
      this.getDeviceLife(sn);
    },
    async getDeviceLife(sn) {
      const { data: {
        storageTime,
        activateTime,
        bindVehicleTime,
        exServicetime,
        // serviceLife,
      } } = await this.apiPost('/device/getDeviceLife', { sn });
      this.list = [
        { title: '设备入库', time: storageTime },
        { title: '设备激活', time: activateTime },
        { title: '设备绑定车辆', time: bindVehicleTime },
        { title: '设备服务到期', time: exServicetime },
      ].filter(i => i.time !== '').sort((a, b) => a.time < b.time);
    },
  },
};
</script>

<style lang="stylus" scoped>
  .custom-timeline
    list-style: none;
    margin: 0;
    padding: 20px 0 0 20px;
    .item
      margin: 0!important;
      padding: 0 0 12px;
      list-style: none;
      position: relative;
      &:last-child
        .item-tail
          display: none;
      .item-tail
        height: 100%;
        border-left: 1px solid #e9eaec;
        position: absolute;
        left: 8px;
        top: 0;
      .item-head
        width: 15px;
        height: 15px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        &.blue
          border-color: #2d8cf0;
          color: #2d8cf0;
      .item-content
        padding: 1px 1px 10px 24px;
        font-size: 12px;
        position: relative;
        top: -3px;
        .time
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          .hhmmss
            font-size: 14px;
        .content
          padding-left: 5px;
</style>
