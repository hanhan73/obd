import http from './http';

const install = function install(Vue) {
  const Bus = new Vue({
    mixins: [http],
    methods: {
      emit(event, ...args) {
        this.$emit(event, ...args);
      },
      on(event, callback) {
        this.$on(event, callback);
      },
      off(event, callback) {
        this.$off(event, callback);
      },
    },
  });

  Vue.prototype.$bus = Bus;
};

export default install;
