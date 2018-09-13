// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import R from 'ramda';
import axios from 'axios';
import Lockr from 'lockr';
import Cookies from 'js-cookie';
import moment from 'moment';
import _ from 'lodash';
import ElementUI from 'element-ui';

import VueAMap from 'vue-amap';
// import * as VueGoogleMaps from 'vue2-google-maps';

import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import ECharts from 'vue-echarts/components/ECharts';
import ZkTable from 'vue-table-with-tree-grid';
import nprogress from 'nprogress';
// import Vuebar from 'vuebar';
import { Base64 } from 'js-base64';
import 'babel-polyfill';
import 'nprogress/nprogress.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'animate.css/animate.min.css';
import util from '@/assets/js/util';
import bus from '@/assets/js/bus';
import { init, configuration } from '@/assets/js/init';
import App from './App';
import store from './store';
import router from './router';
import './icons';
import _g from './assets/js/global';

init();

Object.defineProperty(Vue.prototype, '$configuration', {
  value: configuration,
});

if (BUILD_MODE === 'prod') {
  Raven.config('https://c7c2d319cc9548738cc6f8ebd2e68eff@sentry.io/271084', {
    release: '2.2',
  })
  .addPlugin(RavenVue, Vue)
  .install();
}

Vue.component('chart', ECharts);

Vue.config.productionTip = false;

Vue.use(ZkTable);
Vue.use(ElementUI);
Vue.use(util);
Vue.use(bus);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'ba866a9d3f80bbd19df7bb63c43c90dc',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geocoder',
    'AMap.DistrictSearch',
    'AMap.MouseTool',
    'AMap.ToolBar',
    'AMap.RangingTool',
  ],
  uiVersion: '1.0',
});
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyCyoZ1_V_mKBotFsG7DizML0JIwqa3bnM0',
//     libraries: 'places',
//     // This is required if you use the Autocomplete plugin
//     // OR: libraries: 'places,drawing'
//     // OR: libraries: 'places,drawing,visualization'
//     // (as you require)

//     // // If you want to set the version, you can do so:
//     // v: '3.26',
//   },

//   // If you intend to programmatically custom event listener code
//   // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
//   // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
//   // you might need to turn this on.
//   // autobindAllEvents: false,

//   // If you want to manually install components, e.g.
//   // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
//   // Vue.component('GmapMarker', GmapMarker)
//   // then disable the following:
//   // installComponents: true,
// });

router.beforeEach((to, from, next) => {
  nprogress.start();
  next();
});

router.afterEach(() => {
  nprogress.done();
});

/* eslint-disable no-undef */
window.R = R;
window.HOST = HOST;
window.axios = axios;
window.router = router;
window.Lockr = Lockr;
window.Cookies = Cookies;
/* eslint-disable no-underscore-dangle */
window._g = _g;
window._ = _;
window.moment = moment;
window.escapeName = name => `zy${Base64.encode(name).replace(/[^a-zA-Z0-9]/g, '')}`;
window.sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

Object.defineProperty(Vue.prototype, '$moment', { value: moment });
Object.defineProperty(Vue.prototype, '$Base64', { value: Base64 });

window.bus = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
