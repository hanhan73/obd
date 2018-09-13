import * as types from './mutation-types';

const mutations = {
  [types.SET_MENU](state, menu) {
    state.menu = menu;
  },
  [types.SET_PARTNERS](state, partners) {
    state.partners = partners;
  },
  [types.SET_PARTNERS_TREE](state, partnersTree) {
    state.partnersTree = partnersTree;
  },
  [types.SET_GROUPS](state, groups) {
    state.groups = groups;
  },
  [types.SET_TYPES](state, _types) {
    state.types = _types;
  },
  [types.SET_ROLES](state, roles) {
    state.roles = roles;
  },
  [types.SET_ALERTLIST](state, alertList) {
    state.alertList = alertList;
  },
  [types.SET_POINT](state, point) {
    state.point = point;
  },
};

export default mutations;
