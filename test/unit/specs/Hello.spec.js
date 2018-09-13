import Vue from 'vue';
import Login from '@/views/login';
import ElementUI from 'element-ui';

describe('login.vue', () => {
  it('login vue', () => {
    // 必须引入并use ElementUI
    Vue.use(ElementUI);
    const Constructor = Vue.extend(Login);
    const vm = new Constructor().$mount();
    expect(vm.ruleForm.useraccount).to.equal('');
  });
});
