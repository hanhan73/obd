const page = [
  {
    name: '首页',
    path: 'homePage',
    component: () => import('views/homePage/index'),
  },
  {
    name: '设备列表',
    path: 'device',
    component: () => import('views/device/list'),
  },
  {
    name: '异常设备',
    path: 'unusualDevice',
    component: () => import('views/unusualDevice/list'),
  },
  {
    name: '入库列表',
    path: 'importList',
    component: () => import('views/importList/list'),
  },
  {
    name: '设备安装与绑定',
    path: 'userDevice',
    component: () => import('views/userDevice/list'),
  },
  {
    name: '设备类型',
    path: 'deviceType',
    component: () => import('views/deviceType/list'),
  },
  {
    name: '车辆列表',
    path: 'vehicle',
    component: () => import('views/vehicle/list'),
  },
  {
    name: '车辆分组',
    path: 'vehicleGroup',
    component: () => import('views/vehicle/group/list'),
  },
  // {
  //   name: '警情总览',
  //   path: 'alarm/deviceAlert',
  //   component: () => import('views/alarm/deviceAlert/list'),
  // },
  // {
  //   name: '进出围栏告警',
  //   path: 'alarm/inOutFence',
  //   component: () => import('views/alarm/inOutFence/list'),
  // },
  // {
  //   name: '二押点告警',
  //   path: 'alarm/secondBetPoint',
  //   component: () => import('views/alarm/secondBetPoint/list'),
  // },
  // {
  //   name: '车辆异地告警',
  //   path: 'alarm/vehicleAllopatric',
  //   component: () => import('views/alarm/vehicleAllopatric/list'),
  // },
  // {
  //   name: '停留汇总表',
  //   path: 'reportStat/stayStat',
  //   component: () => import('views/reportStat/stayStat/list'),
  // },
  // {
  //   name: '停车超时表',
  //   path: 'reportStat/packOvertime',
  //   component: () => import('views/reportStat/packOvertime/list'),
  // },
  // {
  //   name: '离线超时表',
  //   path: 'reportStat/offlineOvertime',
  //   component: () => import('views/reportStat/offlineOvertime/list'),
  // },
  // {
  //   name: '里程统计',
  //   path: 'reportStat/trip',
  //   component: () => import('views/reportStat/trip/list'),
  // },
  // {
  //   name: '剩余电量统计表',
  //   path: 'reportStat/surplusElectric',
  //   component: () => import('views/reportStat/surplusElectric/list'),
  // },
  // {
  //   name: '离线统计报表',
  //   path: 'reportStat/offlineStat',
  //   component: () => import('views/reportStat/offlineStat/list'),
  // },
  {
    name: '用户设备库存表',
    path: 'reportStat/stockDevice',
    component: () => import('views/reportStat/stockDevice/list'),
  },
  {
    name: '角色列表',
    path: 'role',
    component: () => import('views/role/list'),
  },
  {
    name: '告警类型',
    path: 'dangerType',
    component: () => import('views/dangerType/list'),
  },
  {
    name: '账号名称列表',
    path: 'partner',
    component: () => import('views/partner/list'),
  },
  {
    name: '后台用户列表',
    path: 'user',
    component: () => import('views/user/list'),
  },
  {
    name: '操作日志',
    path: 'operatedRecord',
    component: () => import('views/operatedRecord/list'),
  },
  // {
  //   name: '在线监控',
  //   path: 'monitor',
  //   component: () => import('views/monitor/index'),
  // },
  {
    name: '区域围栏',
    path: 'regionalFence',
    component: () => import('views/regionalFence/index'),
  },
  // OBD
  // {
  //   name: 'OBD里程统计',
  //   path: 'obd/vehicleMil',
  //   component: () => import('views/obd/vehicleMil/list'),
  // },
  // {
  //   name: 'OBD油耗统计',
  //   path: 'obd/obdMilOil',
  //   component: () => import('views/obd/obdMilOil/list'),
  // },
  // {
  //   name: 'OBD驾驶行为统计',
  //   path: 'obd/drivingBehaviorStat',
  //   component: () => import('views/obd/drivingBehaviorStat/list'),
  // },
  // {
  //   name: 'OBD驾驶行为日报',
  //   path: 'obd/drivingBehaviorDaily',
  //   component: () => import('views/obd/drivingBehaviorDaily/list'),
  // },
  // {
  //   name: 'OBD驾驶行为日报详情',
  //   path: 'obd/drivingBehaviorDaily/detail',
  //   component: () => import('views/obd/drivingBehaviorDaily/detail'),
  // },
  {
    name: '个人设置',
    path: 'personalSetting',
    component: () => import('views/personalSetting/index'),
  },
  {
    name: '风控查询',
    path: 'fkQuery',
    component: () => import('views/zyfk/query/index'),
  },
  {
    name: '订单列表',
    path: 'fkOrders',
    component: () => import('views/zyfk/orders/index'),
  },
  {
    name: '消费流水',
    path: 'consumeList',
    component: () => import('views/zyfk/consume-list/index'),
  },
  {
    name: '反欺诈',
    path: 'antiFraud',
    component: () => import('views/zyfk/anti-fraud/index'),
  },
  {
    name: '我的账户',
    path: 'account',
    component: () => import('views/zyfk/account/index'),
  },
  {
    name: '一键救援',
    path: 'orderManage/onekey',
    component: () => import('views/carOnet/orderManage/onekey/list'),
  },
  {
    name: '保养订单',
    path: 'orderManage/keepfit',
    component: () => import('views/carOnet/orderManage/keepfit/index'),
  },
  {
    name: '保险订单',
    path: 'orderManage/safe',
    component: () => import('views/carOnet/orderManage/safe/index'),
  },
  {
    name: '保养模板',
    path: 'templet/keepfit',
    component: () => import('views/carOnet/templet/keepfit/index'),
  },
  {
    name: '保险模板',
    path: 'templet/safe',
    component: () => import('views/carOnet/templet/safe/index'),
  },
  {
    name: '服务商保养',
    path: 'serviceOrder/keepfit',
    component: () => import('views/carOnet/serviceOrder/keepfit/index'),
  },
  {
    name: '服务商保险',
    path: 'serviceOrder/safe',
    component: () => import('views/carOnet/serviceOrder/safe/index'),
  },
  {
    name: '服务商救援',
    path: 'serviceOrder/onekey',
    component: () => import('views/carOnet/serviceOrder/onekey/list'),
  },
  {
    name: '救援人员',
    path: 'serviceOrder/rescueUser',
    component: () => import('views/carOnet/serviceOrder/rescueUser/list'),
  },
  {
    name: '客户管理',
    path: 'customManage',
    component: () => import('views/carOnet/customManage/index'),
  },
  {
    name: '客服中心',
    path: 'customService',
    component: () => import('views/carOnet/customService/index'),
  },
  {
    name: '消息',
    path: 'message',
    component: () => import('views/carOnet/message/index'),
  },
  {
    name: '服务商管理',
    path: 'serviceManage',
    component: () => import('views/carOnet/serviceManage/index'),
  },
  {
    name: '知识库',
    path: 'knowledgeBase',
    component: () => import('views/carOnet/knowledgeBase/index'),
  },
  {
    name: '通知',
    path: 'notice',
    component: () => import('views/carOnet/notice/index'),
  },
  {
    name: '商城管理',
    path: 'mall/goodsManage',
    component: () => import('views/mall/goodsManage/list'),
  },
  {
    name: '新建商品',
    path: 'addGoods',
    component: () => import('views/mall/addGoods/index'),
  },
];

const obj = {};
page.forEach((i) => {
  obj[i.path.replace(/\//g, '')] = i.component;
});

export default obj;
