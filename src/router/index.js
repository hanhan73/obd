import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('views/login/index'),
    },
    // {
    //   path: '/trackReplay',
    //   component: () => import('views/trackReplay/index'),
    // },
    {
      path: '/onlineMonitoring',
      component: () => import('views/onlineMonitoring/index'),
    },
    {
      path: '/main',
      component: () => import('views/home'),
      children: [
        // {
        //   name: '首页',
        //   path: 'homePage',
        //   component: resolve => require(['views/homePage/index'], resolve),
        // },
        // {
        //   name: '设备列表',
        //   path: 'device',
        //   component: resolve => require(['views/device/list'], resolve),
        // },
        // {
        //   name: '异常设备',
        //   path: 'unusualDevice',
        //   component: resolve => require(['views/unusualDevice/list'], resolve),
        // },
        // {
        //   name: '入库列表',
        //   path: 'importList',
        //   component: resolve => require(['views/importList/list'], resolve),
        // },
        // {
        //   name: '设备安装与绑定',
        //   path: 'userDevice',
        //   component: resolve => require(['views/userDevice/list'], resolve),
        // },
        // {
        //   name: '设备类型',
        //   path: 'deviceType',
        //   component: resolve => require(['views/deviceType/list'], resolve),
        // },
        // {
        //   name: '车辆列表',
        //   path: 'vehicle',
        //   component: resolve => require(['views/vehicle/list'], resolve),
        // },
        // {
        //   name: '车辆分组',
        //   path: 'vehicleGroup',
        //   component: resolve => require(['views/vehicle/group/list'], resolve),
        // },
        // {
        //   name: '警情总览',
        //   path: 'alarm/deviceAlert',
        //   component: resolve => require(['views/alarm/deviceAlert/list'], resolve),
        // },
        // {
        //   name: '进出围栏告警',
        //   path: 'alarm/inOutFence',
        //   component: resolve => require(['views/alarm/inOutFence/list'], resolve),
        // },
        // {
        //   name: '二押点告警',
        //   path: 'alarm/secondBetPoint',
        //   component: resolve => require(['views/alarm/secondBetPoint/list'], resolve),
        // },
        // {
        //   name: '车辆异地告警',
        //   path: 'alarm/vehicleAllopatric',
        //   component: resolve => require(['views/alarm/vehicleAllopatric/list'], resolve),
        // },
        // {
        //   name: '停留汇总表',
        //   path: 'reportStat/stayStat',
        //   component: resolve => require(['views/reportStat/stayStat/list'], resolve),
        // },
        // {
        //   name: '停车超时表',
        //   path: 'reportStat/packOvertime',
        //   component: resolve => require(['views/reportStat/packOvertime/list'], resolve),
        // },
        // {
        //   name: '离线超时表',
        //   path: 'reportStat/offlineOvertime',
        //   component: resolve => require(['views/reportStat/offlineOvertime/list'], resolve),
        // },
        // {
        //   name: '里程统计',
        //   path: 'reportStat/trip',
        //   component: resolve => require(['views/reportStat/trip/list'], resolve),
        // },
        // {
        //   name: '角色列表',
        //   path: 'role',
        //   component: resolve => require(['views/role/list'], resolve),
        // },
        // {
        //   name: '告警类型',
        //   path: 'dangerType',
        //   component: resolve => require(['views/dangerType/list'], resolve),
        // },
        // {
        //   name: '合作伙伴列表',
        //   path: 'partner',
        //   component: resolve => require(['views/partner/list'], resolve),
        // },
        // {
        //   name: '后台用户列表',
        //   path: 'user',
        //   component: resolve => require(['views/user/list'], resolve),
        // },
        // {
        //   name: '操作日志',
        //   path: 'operatedRecord',
        //   component: resolve => require(['views/operatedRecord/list'], resolve),
        // },
        // {
        //   name: '车辆监控',
        //   path: 'monitor',
        //   component: resolve => require(['views/monitor/index'], resolve),
        // },
        // {
        //   name: '区域围栏',
        //   path: 'regionalFence',
        //   component: resolve => require(['views/regionalFence/index'], resolve),
        // },
        // // OBD
        // {
        //   name: 'OBD里程统计',
        //   path: 'obd/vehicleMil',
        //   component: resolve => require(['views/obd/vehicleMil/list'], resolve),
        // },
        // {
        //   name: 'OBD油耗统计',
        //   path: 'obd/obdMilOil',
        //   component: resolve => require(['views/obd/obdMilOil/list'], resolve),
        // },
        // {
        //   name: 'OBD驾驶行为统计',
        //   path: 'obd/drivingBehaviorStat',
        //   component: resolve => require(['views/obd/drivingBehaviorStat/list'], resolve),
        // },
        // {
        //   name: 'OBD驾驶行为日报',
        //   path: 'obd/drivingBehaviorDaily',
        //   component: resolve => require(['views/obd/drivingBehaviorDaily/list'], resolve),
        // },
        // {
        //   name: 'OBD驾驶行为日报详情',
        //   path: 'obd/drivingBehaviorDaily/:id',
        //   component: resolve => require(['views/obd/drivingBehaviorDaily/detail'], resolve),
        // },
        // {
        //   name: '个人设置',
        //   path: 'personalSetting',
        //   component: resolve => require(['views/personalSetting/index'], resolve),
        // },
      ],
    },
  ],
});
