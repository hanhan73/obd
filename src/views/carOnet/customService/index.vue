<template>
    <div class="">
        <div>
            <div class="m-b-5 ovf-hd fz-14 search-bar">
                <h2>客服</h2>
                <el-input
                size="mini"
                class="w-200"
                placeholder="请输入关键词搜索"
                v-model="input10"
                clearable>
                </el-input>
                <div class="btn-wrapper inline">
                    <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button size="mini" type="success" icon="el-icon-plus" @click="$refs.newpush.open()">新建推送</el-button>
                    <el-button size="mini" type="info" icon="el-icon-message" @click="$refs.newpush.open()">发信息</el-button>
                    <el-button size="mini" type="success" icon="el-icon-tickets" @click="$refs.newcustom.open()">新建记录</el-button>
                </div>
            </div>
            <el-table :data="oneBtuHelp" height="350px" style="width: 100%" size="mini" stripe>
                <el-table-column
                prop="name"
                label="车主姓名"
                width="180">
                </el-table-column>
                <el-table-column
                prop="phone"
                label="车主手机">
                </el-table-column>
                <el-table-column
                prop="carnum"
                label="车牌">
                </el-table-column>
                <el-table-column
                prop="cartype"
                label="车型">
                </el-table-column>
                <el-table-column
                prop="helpTime"
                label="呼出时间">
                </el-table-column>
                <el-table-column
                prop="serviceItem"
                label="服务项目">
                </el-table-column>
                <el-table-column
                prop="remark"
                width="280"
                label="备注">
                </el-table-column>
                <el-table-column
                prop="servicePerson"
                label="服务人员">
                </el-table-column>
                <el-table-column
                prop="servicePersonPhone"
                label="服务人员手机">
                </el-table-column>
            </el-table>
             <div class="pos-rel p-t-10 pages-footer">
                <div class="stat">
                </div>
                <div class="block pages">
                    <el-pagination
                    @current-change="getRechargeInfo"
                    :current-page.sync="listQuery.currentPage"
                    :page-size="listQuery.pageSize"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, prev, pager, next, jumper"
                    :total="counts2">
                    </el-pagination>
                </div>
             </div>
        </div>
        <div>
            <div class="m-b-5 ovf-hd fz-14 search-bar">
                <h2>客服资料</h2>
                <el-input
                size="mini"
                class="w-200"
                placeholder="请输入关键词搜索"
                v-model="input10"
                clearable>
                </el-input>
                <div class="btn-wrapper inline">
                    <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
                     <el-button size="mini" type="success" icon="search" @click="$refs.newbuit.open()">新建</el-button>
                      <el-button size="mini" type="danger" icon="search">注销</el-button>
                       <el-button size="mini" type="primary" icon="search">编辑</el-button>
                </div>
            </div>
            <el-table :data="oneBtuHelp" height="350px" style="width: 100%" size="mini" stripe>
              <el-table-column
                prop="serviceNum"
                label="服务编号">
                </el-table-column>
                <el-table-column
                prop="servicePerson"
                label="服务人员">
                </el-table-column>
                <el-table-column
                prop="servicePersonPhone"
                label="服务人员电话">
                </el-table-column>
                <el-table-column
                prop="sex"
                label="性别">
                </el-table-column>
                <el-table-column
                prop="department"
                label="部门">
                </el-table-column>
                <el-table-column
                prop="remark"
                label="备注">
                </el-table-column>
                <el-table-column
                min-width="100px"
                label="操作">
                    <template slot-scope="{ row: { serviceplan, carnum, helpstore, helpstate} }">
                        <el-button-group>
                            <el-button type="primary" size="mini" @click="$refs.edit.open(id)">编辑</el-button>
                            <el-button type="warning" size="mini" @click="$refs.sendinfo.open(carnum)">注销</el-button>
                            <el-button type="danger" size="mini" @click="$refs.sendinfo.open(carnum)">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
      <newbuit ref="newbuit"></newbuit>
      <newpush ref="newpush"></newpush>
      <newcustom ref="newcustom"></newcustom>
    </div>
</template>

<script>
import Newbuit from './newbuit';
import Newpush from './newpush';
import Newcustom from './newcustom';

export default {
  data() {
    return {
      oneBtuHelp: [
        {
          ordernum: '124565',
          name: '辅导费',
          phone: '1234789794',
          carnum: '445454545',
          cartype: 'dad',
          service: 'fafda',
          address: 'dadfddfdfdfdfd',
          serviceplan: 'daddada',
          helpstore: '5',
          phonestore: '深圳南山西丽',
          helpstate: '2',
        },
      ],
      listQuery: {
        pageSize: 10,
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
      listQuery2: {
        pageSize: 10,
        fatherid: null,
        currentPage: 1,
        loginId: Lockr.get('securId'),
      },
    };
  },
  components: {
    // Add,
    Newbuit,
    Newpush,
    Newcustom,
  },
};
</script>


<style lang="stylus" scoped>
h2 {
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-left: 4px solid #409EFF;
    background: #fff;
    // &.bottom
}
</style>



