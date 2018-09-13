<template>
  <div class="">
    <div class="m-b-5 ovf-hd fz-14 search-bar">
        <el-input
        size="mini"
        class="w-200"
        placeholder="请输入关键词搜索"
        v-model="input10"
        clearable>
        </el-input>
        <div class="btn-wrapper inline">
            <el-button size="mini" type="primary" icon="search">搜索</el-button>
        </div>
    </div>
    <el-table :data="noticelist"  style="width: 100%" size="mini" stripe>
      <el-table-column
        prop="carOwnerName"
        label="车主姓名"
        width="180">
        </el-table-column>
        <el-table-column
        prop="carownerPhone"
        label="车主手机"
        width="120">
        </el-table-column>
        <el-table-column
        prop="carNum"
        label="车牌"
        width="120">
        </el-table-column>
        <el-table-column
        prop="carType"
        label="车型"
        width="120">
        </el-table-column>
        <el-table-column
        prop="messageInfo"
        label="信息内容"
        width="200">
        </el-table-column>
        <el-table-column
        prop="sendTime"
        label="发送时间"
        width="120">
        </el-table-column>
        <el-table-column
        prop="serviceStore"
        label="发送时间"
        width="180">
        </el-table-column>
        <el-table-column
        prop="storePhone"
        label="门店电话"
        width="160">
        </el-table-column>
        <el-table-column
        prop="serviceState"
        label="服务状态"
        width="120">
          <template slot-scope="{ row: { serviceState }}">
            <a v-bind:style="{ color: activeColor1 }" href="#" v-if="serviceState === 1">已分配</a>
            <a v-bind:style="{ color: activeColor2 }" href="#" v-if="serviceState === 0">未分配</a>
          </template>
        </el-table-column>
        <el-table-column
        prop="remark"
        label="备注"
        width="180">
        </el-table-column>
        <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-button-group>
                <el-button type="success" size="mini" @click="$refs.sendinfo.open(id)">发信息</el-button>
                <el-button type="info" size="mini" @click="$refs.serviceinfo.open(id)">历史记录</el-button>
            </el-button-group>
          </template>
      </el-table-column>
    </el-table>
    <sendinfo ref="sendinfo"></sendinfo>
  </div>
</template>

<script>
import Sendinfo from './send-info';

export default {
  data() {
    return {
      activeColor1: '#409EFF',
      activeColor2: '#909399',
      noticelist: [
        {
          carOwnerName: 'dsdad',
          serviceState: 1,
        },
        {
          carOwnerName: 'dsdad',
          serviceState: 0,
        },
      ],
    };
  },
  components: {
    // Add,
    Sendinfo,
  },
};
</script>

