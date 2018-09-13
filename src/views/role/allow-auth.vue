<template>
  <el-dialog
      ref="dialog"
      title="分配权限"
      size="tiny"
      top="60px"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible">
    <section v-if="preLoading" class="tx-c">
      <span class="fz-30 el-icon-loading"></span>
    </section>
    <section v-else>
      <el-tree
        ref="tree"
        show-checkbox
        default-expand-all
        node-key="menuid"
        :data="menu"
        :default-expanded-keys="[]"
        :default-checked-keys="[]"
        check-strictly="true"
        :props="defaultProps">
      </el-tree>
    </section>
    <div slot="footer" v-show="!preLoading">
      <el-button type="primary" @click="add()" :loading="isLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import http from '@/assets/js/http';
import formMixin from '@/assets/js/form_com';

export default {
  mixins: [http, formMixin],
  data() {
    return {
      menu: [],
      defaultProps: {
        children: 'childMenu',
        label: 'menuname',
      },
      form: {
        typeid: null,
        company: null,
      },
      rules: {
        login_name: [{ required: true, message: '请输入登录名' }],
      },
    };
  },
  computed: {},
  methods: {
    init() {},
    async open(roleid) {
      this.roleId = roleid;
      this.dialogVisible = true;
      this.preLoading = true;
      const { data } = await this.apiPost('/roleMenu/getResource', {});
      this.menu = this.normalizeMenu(data);
      const resource = await this.apiPost('/roleMenu/getResourceByRoleId', { roleid });
      this.preLoading = false;
      this.setCheckedKeys(resource.data);
    },
    setCheckedKeys(data) {
      this.$nextTick(() => {
        const keys = data.map(item => item.menuid);
        console.log(keys);
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    normalizeMenu(menu) {
      return menu.map((item) => {
        let child = [];
        item.menuid = item.m.menuid;
        item.menuname = item.m.menuname;
        if (item.childMenu instanceof Array && item.childMenu.length) {
          child = this.normalizeMenu(item.childMenu);
        }
        item.childMenu = child;
        return item;
      });
    },
    async add() {
      const roleId = this.roleId;
      let menuIds = this.$refs.tree.getCheckedKeys(true);
      menuIds = menuIds.map((item) => {
        const str = item.toString();
        // if (str.length <= 3) {
        //   return [str.substring(0, 3)];
        // } else if (str.length <= 5) {
        //   return [str.substring(0, 3), str.substring(0, 5)].join('_');
        // }
        return [str.substring(0, 3), str.substring(0, 5), str].join('_');
      }).join(';');
      this.isLoading = true;
      try {
        await this.apiPost('/roleMenu/addPower', { menuIds, roleId });
        _g.toastMsg('success', '分配成功');
        setTimeout(() => {
          this.isLoading = false;
          this.dialogVisible = false;
        }, 1000);
      } catch (e) {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
