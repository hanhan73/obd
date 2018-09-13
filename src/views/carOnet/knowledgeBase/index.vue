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
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-download">批量导入</el-button>
      </div>
    </div>
      <el-table :data="knowledgeList" height="350px" style="width: 100%" size="mini" stripe>
        <el-table-column
        prop="title"
        label="标题"
        width="200">
        </el-table-column>
        <el-table-column
        prop="updateTime"
        label="更新时间"
        width="200">
        </el-table-column>
        <el-table-column
        prop="essayType"
        label="文章类别"
        width="160">
        </el-table-column>
        <el-table-column
        prop="link"
        label="链接"
        width="180">
        </el-table-column>
        <el-table-column
        prop="remark"
        label="备注"
        width="160">
        </el-table-column>
        <el-table-column
          min-width="100px"
          label="操作">
              <template slot-scope="{ row: { serviceplan, carnum, helpstore, helpstate} }">
                  <el-button-group>
                      <el-button type="success" size="mini" @click="$refs.edit.open(id)">查看</el-button>
                      <el-button type="primary" size="mini" @click="$refs.sendinfo.open(carnum)">编辑</el-button>
                  </el-button-group>
              </template>
          </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      knowledgeList: [
        {
          title: 'dadadadaadadad',
          updateTime: '2018-10-20 :0000',
        },
      ],
    };
  },
};
</script>

      