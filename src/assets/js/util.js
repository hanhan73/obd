const util = {
  // eslint-disable-next-line
  install(Vue, options) {
    Vue.prototype.$_ = _;

    const hashQueryTypes = {
      103020: '24小时无信号',
      101019: '断电报警',
      5: '三天无行驶',
    };
    const queryTypes = Object.keys(hashQueryTypes);

    Vue.prototype.$dangerTypes = queryTypes;

    Vue.prototype.$filterAlertTypes = i => queryTypes.indexOf(i) === -1;

    Vue.prototype.$secondsFormat = (seconds, showSeconds = true) => {
      let str = '';
      seconds = parseInt(seconds, 10);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds / 3600) % 24);
      const m = Math.floor((seconds / 60) % 60);
      const s = seconds % 60;
      if (d >= 1) {
        str = `${d}天${h}小时${m}分钟`;
      } else if (h >= 1) {
        str = `${h}小时${m}分钟`;
      } else if (m >= 1) {
        str = `${m}分钟`;
      }
      if (showSeconds) str += `${s}秒`;
      return str;
    };

    Vue.prototype.$checkMobileNo = (mobileNo) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(mobileNo)) {
        return true;
      }
      return false;
    };

    Vue.prototype.$routerPush = menu => window.$routerPush(menu);

    Vue.prototype.$handleAlarmClick = (typeid, timeType = null) => {
      typeid += '';
      const push = window.$routerPush;
      if (queryTypes.indexOf(typeid) !== -1) {
        return push({
          path: '/main/alarm/deviceAlert',
          name: hashQueryTypes[typeid],
          props: { typeid, timeType },
        });
      }
      return push({ path: '/main/alarm/deviceAlert', name: '警情总览', props: { typeid, timeType } });
    };

    Vue.prototype.$isIE = (() => {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
      return false;
    })();
  },
};

export default util;
