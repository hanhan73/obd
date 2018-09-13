<template>
  <div class="panel">
    <section class="panel-left">
      <h1 class="system-title"
          style="background: #495060">
        <!-- <i class="fa fa-cloud" aria-hidden="true"></i> -->
        <img class="ve-m" :src="$configuration.miniLogoImg || $configuration.logoImg" :width="`${$configuration.miniLogoWidth || 50}px`"/>
        <!-- <i class="name ve-m" v-show="!leftMenuShrink">GPS</i> -->
        <i @click="pageShrink = !pageShrink; leftMenuShrink = pageShrink" class="fa fa-long-arrow-up"  :class="pageShrink ? 'expand' : 'shrink'" aria-hidden="true"></i>
      </h1>
      <div class="panel-menu tx-l h-100p" style="background: #495060;">
        <left-menu ref="leftMenu"
                    @handleSelect="handleSelect"
                    :leftMenuShrink="leftMenuShrink">
        </left-menu>
      </div>
      <div class="shrink" @click="leftMenuShrink = !leftMenuShrink">
        <i :class="`el-icon-d-arrow-${leftMenuShrink ? 'right' : 'left'}`"></i>
      </div>
    </section>
    <section class="panel-right">
      <section v-show="!pageShrink" class="panel-top-wrapper bg-wh">
        <el-input v-model.trim="title" placeholder="请输入名称" class="w-300 m-l-50 title-input" @change="handleTitleChange"></el-input>
        <div class="right">
          <span style="padding-right: 20px; border-right: 1px solid #DCDFE6; line-height: 40px; color: #909399">推荐使用google(谷歌)、firefox(火狐)浏览器</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-popover
            ref="qrcode"
            placement="bottom"
            width="200"
            popper-class="qrcode-popper"
            trigger="hover">
            <img width="200px" :src="$configuration.appDownloadImg" alt="">
          </el-popover>
          <div v-popover:qrcode class="m-r-30 pointer" style="color: #606266">
            <span>下载APP</span>
            <i class="fz-24 fa fa-qrcode ve-m" aria-hidden="true"></i>
          </div>
          <el-popover
            ref="bell"
            placement="bottom"
            width="650"
            trigger="hover"
            v-model="showAlarmPopover"
            :open-delay="300"
            @show="handleAlarmPopoverShow">
            <el-table ref="alarmPopoverTable" class="w-100p" size="mini" :data="alertList" height="400" @row-click="handleRowClick">
              <el-table-column width="80" property="devicename" label="设备名称"></el-table-column>
              <!-- <el-table-column width="80" property="alertcount" label="告警设备数"></el-table-column> -->
              <el-table-column property="typename" label="告警类型"></el-table-column>
              <el-table-column min-width="200" property="address" label="告警地址"></el-table-column>
              <el-table-column width="135" property="alerttime" label="告警时间"></el-table-column>
            </el-table>
            <audio src="/static/alert.mp3" ref="audio"></audio>
          </el-popover>
          <el-badge :value="unreadCount" class="m-r-20">
            <i class="fa fa-bell-o fz-22 pointer ve-m"
              v-popover:bell
              :class="`fa-bell${isAlarm ? '' : '-slash'}-o`"
              @click="isAlarm = !isAlarm"
              aria-hidden="true"></i>
          </el-badge>
          <i class="fa fz-24 pointer fullScreen-btn" :class="`fa-${isFullScreen ? 'compress' : 'arrows-alt'}`" v-if="showFullScreenBtn" @click="handleFullScreen" aria-hidden="true"></i>
          <!-- 点数模块 start -->
          <!-- <recharge></recharge> -->
          <!-- 点数模块 end -->
          <el-popover
            ref="exit"
            popper-class="exit-popover"
            placement="bottom"
            trigger="hover">
            <ul v-if="kidsList.length" class="kids-list">
              <li v-for="i in kidsList" @click="handleKidSelect(i)">{{i.partnername}}</li>
            </ul>
            <el-button type="danger" size="small" @click="handleExit">退出登陆</el-button>
          </el-popover>
          <span v-popover:exit class="c-blue fz-14 pointer">{{systemName}} <i class="el-icon-caret-bottom"></i></span>
        </div>
      </section>
      <section class="panel-center">
        <div class="panel-c-c">
          <el-tabs v-model="editableTabsValue" type="card" closable @edit="handleTabsEdit" @tab-click="handleTabClick" class="main-tabs">
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.random"
              :label="item.path"
              :name="`${item.name}${item.random}`"
              :path="item.path"
            >
              <span slot="label">{{item.name}} <i @click.stop="handleRefreshComponent(index)" class="el-icon-refresh"></i></span>
              <component v-if="item.isRefresh" :ref="`${item.name}${item.random}`" :key="item.random" :is="item.path.replace(/main|\//g, '')" :props="item.props"></component>
            </el-tab-pane>
            <el-tab-pane v-if="editableTabs.length > 1" key="command" :closable="true" :disabled="true">
              <el-dropdown slot="label" @command="handleTabsCommand" style="top: -3px">
                <el-button type="normal" icon="el-icon-caret-bottom" style="padding: 10px 2px">
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all">关闭全部</el-dropdown-item>
                  <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tab-pane>
          </el-tabs>
          <!-- <div class="router-view">
            <keep-alive :include="cachePage">
              <router-view></router-view>
            </keep-alive>
          </div> -->
        </div>
      </section>
    </section>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import http from '@/assets/js/http';
import LeftMenu from './left-menu';

import page from './page';
import Recharge from './recharge';

export default {
  mixins: [http],
  data() {
    this._defaultTitle = `${this.$configuration.title}风控平台`;
    this._homePage = {
      name: '首页',
      title: '首页',
      path: '/main/homePage',
      random: Math.random(),
      isRefresh: true,
    };
    return {
      kidsList: [],
      unreadCount: 0,
      showAlarmPopover: false,
      showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
      isFullScreen: false,
      isAlarm: true,
      systemName: Lockr.get('seusername'),
      editableTabsValue: '',
      editableTabs: [],
      leftMenuShrink: false,
      pageShrink: false,
      title: Lockr.get('title') || this._defaultTitle,
    };
  },
  // watch: {
  //   editableTabs(tabs) {
  //     Lockr.set('editableTabs', tabs);
  //   },
  // },
  computed: {
    ...mapGetters([
      'menu',
      'alertList',
    ]),
  },
  created() {
    this.init();
    this.showGreetings();
    window.$routerPush = (menu) => {
      this.handleSelect(menu);
    };
    window.onresize = () => {
      const width = document.body.clientWidth;
      if (width < 1450 && !this.leftMenuShrink) {
        this.leftMenuShrink = true;
      }
    };
  },
  destoryed() {
    window.onresize = null;
  },
  mounted() {
    this.editableTabs.push(this._homePage);
    this.timingAlert();
    // 全屏相关
    document.addEventListener('fullscreenchange', () => {
      this.changeFullScreenState();
    });
    document.addEventListener('mozfullscreenchange', () => {
      this.changeFullScreenState();
    });
    document.addEventListener('webkitfullscreenchange', () => {
      this.changeFullScreenState();
    });
    document.addEventListener('msfullscreenchange', () => {
      this.changeFullScreenState();
    });
  },
  methods: {
    async init() {
      // this.fetchPartners();
      // this.fetchGroups();
      // this.fetchTypes();
      // this.fetchKidAccount();
      await this.fetchMenu();
      const home = this.editableTabs[0];
      this.editableTabsValue = `${home.name}${home.random}`;
    },
    handleAlarmPopoverShow() {
      this.unreadCount = 0;
      setTimeout(() => {
        this.$refs.alarmPopoverTable.doLayout();
      });// 异步触发, 否则获取不到宽度
    },
    handleTabsEdit(targetName, action) {
      if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (`${tab.name}${tab.random}` === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = `${nextTab.name}${nextTab.random}`;
                Lockr.set('last_menu_name', nextTab.name);
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        const index = tabs.findIndex(tab => `${tab.name}${tab.random}` === targetName);
        this.editableTabs.splice(index, 1);
      }
    },
    handleTabClick(tab) {
      this.editableTabsValue = tab.name;
      Lockr.set('last_menu_name', tab.name.substr(0, tab.name.indexOf(0)));
      this.$bus.emit('tabClick');
    },
    handleSelect({ path, name, props }) {
      if (!path) return;
      const index = this.editableTabs.findIndex(i => i.name === name);
      //  || (name === '在线监控' && this.editableTabs.filter(i => i.name === '在线监控').length < 5)
      if (index === -1) {
        const random = Math.random();
        this.editableTabsValue = `${name}${random}`;
        this.editableTabs.push({
          name,
          path,
          props,
          title: name,
          random,
          isRefresh: true,
        });
      } else {
        const item = this.editableTabs[index];
        this.editableTabsValue = `${item.name}${item.random}`;
        this.editableTabs[index].props = props;
      }
      Lockr.set('last_menu_name', name);
    },
    handleTabsCommand(command) {
      if (command === 'all') {
        this.editableTabs = [this._homePage];
        this.editableTabsValue = `${this._homePage.name}${this._homePage.random}`;
      } else if (command === 'other') {
        this.editableTabs = [this._homePage].concat(this.editableTabs.filter(i => `${i.name}${i.random}` === this.editableTabsValue));
      } else if (command === 'refresh') {
        this.$refs[this.editableTabsValue][0].init();
      }
    },
    handleRefreshComponent(index) {
      this.editableTabs[index].isRefresh = false;
      this.$nextTick(() => {
        this.editableTabs[index].isRefresh = true;
      });
    },
    handleTitleChange(title) {
      if (title === '') {
        this.title = this._defaultTitle;
        _g.toastMsg('error', '名称不能为空或不大于25个字符');
        return;
      }
      Lockr.set('title', title);
    },
    timingAlert() {
      if (window._timingAlertTimer) {
        clearInterval(window._timingAlertTimer);
      }
      this.getAlertList(true);
      window._timingAlertTimer = setInterval(() => {
        this.getAlertList();
      }, 60 * 1000);
    },
    async getAlertList(isFirst) {
      const typeIds = [101019, 103040, 4, 103025, 102004, 102005, 103037, 103038, 103039];
      const oldData = [...this.alertList];
      const data = await this.fetchAlertList();
      if (this.isAlarm && !isFirst) {
        data.forEach(({ devicename, typename, typeid, id, alerttime, address }) => {
          if (oldData.findIndex(i => i.id === id) === -1
              && typeIds.indexOf(typeid) !== -1) {
            this.$refs.audio.play();
            this.unreadCount += 1;
            setTimeout(() => {
              this.$notify({
                offset: 60,
                type: 'warning',
                title: `${devicename}---${typename}`,
                message: (
                  <div>
                    <p><i class="el-icon-time"></i> {alerttime}</p>
                    <p><i class="fa fa-car" aria-hidden="true"></i> {address}</p>
                  </div>
                ),
              });
            });
          }
        });
      }
    },
    handleRowClick({ typeid }) {
      this.$handleAlarmClick(typeid);
      this.showAlarmPopover = false;
    },
    handleExit() {
      // this.$router.push('/');
      window.location.href = '/';
      this.clearMenu();
    },
    handleFullScreen() {
      const main = document.getElementById('app');
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else if (main.requestFullscreen) {
        main.requestFullscreen();
      } else if (main.mozRequestFullScreen) {
        main.mozRequestFullScreen();
      } else if (main.webkitRequestFullScreen) {
        main.webkitRequestFullScreen();
      } else if (main.msRequestFullscreen) {
        main.msRequestFullscreen();
      }
    },
    changeFullScreenState() {
      this.isFullScreen = !this.isFullScreen;
    },
    showGreetings() {
      const i = new Date();
      const s = i.getHours();
      let c = {};
      const l = Lockr.get('seusername');
      if (s < 6) {
        c = {
          title: '凌晨好~',
          words: '早起的鸟儿有虫吃~',
        };
      } else if (s >= 6 && s < 9) {
        c = {
          title: '早上好~',
          words: '来一杯咖啡开启美好的一天~',
        };
      } else if (s >= 9 && s < 12) {
        c = {
          title: '上午好~',
          words: '工作要加油哦~',
        };
      } else if (s >= 12 && s < 14) {
        c = {
          title: '中午好~',
          words: '午饭要吃饱~',
        };
      } else if (s >= 14 && s < 17) {
        c = {
          title: '下午好~',
          words: '下午也要活力满满哦~',
        };
      } else if (s >= 17 && s < 19) {
        c = {
          title: '傍晚好~',
          words: '下班没事问候下爸妈吧~',
        };
      } else if (s >= 19 && s < 21) {
        c = {
          title: '晚上好~',
          words: '工作之余品一品书香吧~',
        };
      } else {
        c = {
          title: '深夜好~',
          words: '夜深了，注意休息哦~',
        };
      }
      this.$notify.info({
        title: `${c.title} ${l}`,
        message: c.words,
        offset: 60,
      });
    },
    async handleKidSelect({ userid }) {
      try {
        const res = await this.apiPost('/backuser/kidLogin', { kidId: userid });
        res.data.securId = res.data.id;
        res.data.seusername = res.data.username;
        this.resetCommonData(res);
        const { obj: { tokenId } } = await this.fkApiPost('/appUser/GpsUserLogin', { userid: res.data.securId });
        Lockr.set('fkTokenId', tokenId);
        // console.log(res);
        window.location.reload();
      } catch (e) {
        //
      }
    },
    async fetchKidAccount() {
      const { data } = await this.apiPost('/partner/qryPartnerTree', { pageSize: 10000 });
      this.kidsList = data.filter(i => i.userid !== Lockr.get('securId') - 0 && i.parentid === Lockr.get('partnerid') - 0);
    },
    ...mapActions([
      'fetchPartners',
      'fetchGroups',
      'fetchTypes',
      'fetchAlertList',
      'fetchMenu',
      'clearMenu',
    ]),
  },
  components: {
    LeftMenu,
    Recharge,
    ...page,
  },
  destroyed() {
    clearInterval(window._timingAlertTimer);
  },
};
</script>

<style lang="css">
  .main-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .main-tabs>.el-tabs__header {
    flex: 0 0 auto;
    margin: 0;
  }
  .main-tabs>.el-tabs__content {
    margin-top: -4px;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    border-top: 2px solid #409EFF;
  }
  .main-tabs>.el-tabs__content>.el-tab-pane {
    box-sizing: border-box;
    padding-bottom: 0px;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav {
    height: 42px;
    border: none;
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item {
    border-left: none;
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:last-child {
    padding: 0 1px !important
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:last-child:hover {
    padding: 0 1px
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:first-child {
    padding: 0 9px !important
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:first-child:hover {
    padding: 0 9px
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.is-active {
    border: 2px solid;
    border-radius: 3px 3px 0px 0px;
    background: #F1F2F7;
    border-bottom: none;
  }
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:first-child .el-icon-close,
  .main-tabs>.el-tabs__header>.el-tabs__nav-wrap>.el-tabs__nav-scroll>.el-tabs__nav>.el-tabs__item:last-child .el-icon-close {
    display: none
  }
  .title-input .el-input__inner {
    margin-top: 12px;
    font-size: 20px;
    border-color: transparent
  }
  .title-input .el-input__inner:hover {
    border-color: #8391a5;
  }
  .title-input .el-input__inner:focus {
    border-color: #20a0ff;
  }
  .exit-popover {
    min-width: 68px;
  }
  /*滚动条垂直方向的宽度*/
  ::-webkit-scrollbar {
    height: 10px;
  	width: 10px;
  }
  /* 垂直滚动条的滑动块 */
  ::-webkit-scrollbar-thumb {
  	border-radius: 4px;
  	box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  	background-color:rgba(129,129,129,0.5);
  }
  /* nprogess进度条 */
  body #nprogress .spinner {
    top: 20px;
  }
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .panel
    display: flex
    position: relative
    z-index: 1
    width: 100%
    height: 100%
    overflow: hidden
    .panel-left
      flex: 0 0 auto
      position: relative
      .system-title
        position: relative
        line-height: 60px
        color: #fff
        text-align: center
        transition: .3s all
        font-size: 24px
        .fa-long-arrow-up
          position: absolute
          bottom: 0
          right: 3px
          font-size: 14px
          color: gray
          cursor: pointer
          &.shrink
            transform: rotate(-45deg)
          &.expand
            transform: rotate(135deg)
      .panel-menu
        height: 100%
      >.shrink
        display: inline-block
        box-sizing: border-box
        position: absolute
        bottom: 15%
        right: 0px
        z-index: 1001
        cursor: pointer
        height: 100px
        width: 0px
        border-right: 20px solid rgba(88, 96, 116, 0.36)
        border-top: 18px solid transparent
        border-bottom: 18px solid transparent
        .el-icon-d-arrow-left,
        .el-icon-d-arrow-right
          position: absolute
          top: 50%
          margin-top: -6px
          margin-left: 3px
          color: #fff
          font-size: 12px
    .panel-right
      width: 0
      flex: 1 1 auto
      display: flex
      flex-direction: column
      .panel-top-wrapper
        overflow: hidden
        position: relative
        flex: 0 0 60px
        display: flex
        box-sizing: border-box
        padding-right: 15px
        // line-height: 60px
        user-select: none
        color: #ccc
        border-bottom: 1px solid
      .panel-c-c
        width: 100%
        display: flex
        // flex-direction: column
        // flex: 1 1 auto
        background: #f1f2f7
        overflow-y: hidden
        overflow-x: hidden
        /* padding: 5px */
        .main-tabs
          height: 100%
          width: 100%
          // flex: 0 0 auto
      .panel-center
        flex: 1 1 auto
        display: flex
        width: 100%
        height: 100%
        overflow: hidden
        background-color: #F1F2F7
  .bars
    display: block
    padding: 0px 20px
    text-align: center
    cursor: pointer
    .fa-bars
      transform: rotate(0deg)
      transition: .3s all
      &.rotate
        transform: rotate(90deg)
  .right
    width: 0
    display: flex
    align-items: center
    justify-content: flex-end
    flex: 1 1 auto
    text-align: right
  .bell
    display: inline-block
    font-size: 25px
    transition: .1s all
    width: 65px
    text-align: center
    &.bell:hover
      background: #414a53
  .el-dropdown-link
    color: #20A0FF
    cursor: pointer
  .fullScreen-btn
    margin-right: 20px
  .kids-list
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6;
    li
      padding: 5px 0px;
      text-align: center;
      cursor: pointer;
      &:hover
        color: #409EFF
</style>
