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
          <el-button size="mini" type="primary" icon="el-icon-plus" 
             @click="$routerPush({name: '新建商品', path: '/main/mall/addGoods'})"
          >新建商品</el-button>
          <el-button size="mini" type="success" >上架</el-button>
          <el-button size="mini" type="info" >下架</el-button>
      </div>
    </div>

    <el-table :data="goodslist"  style="width: 100%" size="mini" stripe>
      <el-table-column
        prop="goods"
        label="商品"
        width="350">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <img
              class="g-img"
              :src="goodsimg"
              alt="">
            </el-col>
            <el-col :span="12">
              <span>大萨达所大所多所多所大所多所大</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="120">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        width="120">
      </el-table-column>
      <el-table-column
        prop="totalsales"
        label="总销量"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goodstype"
        label="所属分类"
        width="150">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="shelftime"
        label="上架时间"
        width="150">
      </el-table-column>
      <el-table-column
        prop="shelfday"
        label="上架天数"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button-group>
              <el-button type="success" size="mini" @click="$refs.edit.open(id)">上架</el-button>
              <el-button type="primary" size="mini" @click="$refs.edit.open(id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="$refs.sendinfo.open(carnum)">删除</el-button>
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
      goodsimg: '/static/website-setting/magicyo/logo.png',
      goodslist: [
        {
          goods: 'dsadasd',
          price: '20',
          stock: '999',
          totalsales: '10000',
          goodstype: 'cadcdc',
          createtime: '2017-05-10 20:00:20',
          shelftime: '2018/568/',
          shelfday: '10',
        },
      ],
    };
  },
};
</script>
<style lang="stylus" scoped>
.g-img
  width 100px
  height 100px
</style>


