/* eslint-disable import/prefer-default-export */
import * as types from './mutation-types';
import Services from './services';

function partnerListToTree(data, pId) {
  const arr = [];
  data.forEach((i) => {
    if (i.parentid === pId) {
      const children = partnerListToTree(data, i.id);
      if (children.length) i._children = children;
      arr.push(i);
    }
  });
  console.log(arr);
  return arr;
}

function normalizeMenu(data) {
  const arr = [];
  data.forEach((item) => {
    let child = [];
    const url = item.m.menuurl;
    const props = {};
    if (item.childMenu instanceof Array && item.childMenu.length) {
      child = normalizeMenu(item.childMenu);
    }
    const reqIndex = url.indexOf('?');
    if (url.indexOf('?') !== -1) {
      const req = url.substr(reqIndex + 1, url.length).split('&');
      req.forEach((i) => {
        const temp = i.split('=');
        props[temp[0]] = temp[1];
      });
    }
    arr.push({
      props,
      path: reqIndex === -1 ? url : url.substr(0, reqIndex),
      name: item.m.menuname,
      icon: item.m.icon,
      children: child,
    });
  });
  return arr;
}

export const clearMenu = async function clearMenu({ commit }) {
  commit(types.SET_MENU, []);
};

export const fetchMenu = async function fetchMenu({ commit }) {
  const { data } = await Services.fetchResource();
  const menu = normalizeMenu(data);
  commit(types.SET_MENU, menu);
};

// export const fetchAlertList = async function fetchAlertList({ commit }) {
//   const { data } = await Services.fetchAlertList();
//   commit(types.SET_ALERTLIST, data);
//   // Lockr.set('latestAlertList', data);
//   return data;
// };

export const fetchPartners =
  async function fetchPartners({ commit, getters }, isListToTree = false) {
    const { data } = await Services.fetchPartners();
    commit(types.SET_PARTNERS, data);
    if (isListToTree) {
      let partnerid = parseInt(getters.curPartnerid, 10);
      if (partnerid !== 1) {
        const index = data.findIndex(i => i.id === partnerid);
        partnerid = data[index].parentid;
      }
      commit(types.SET_PARTNERS_TREE, partnerListToTree(data, partnerid));
    }
  };

export const fetchPoint = async function fetchPoint({ commit }) {
  const { obj } = await Services.fetchUserPoint();
  commit(types.SET_POINT, obj);
};

export const fetchGroups = async function fetchGroups({ commit }) {
  const { data } = await Services.fetchGroups();
  commit(types.SET_GROUPS, data);
};

export const fetchTypes = async function fetchTypes({ commit }) {
  const { data } = await Services.fetchTypes();
  commit(types.SET_TYPES, data);
};

export const fetchRoles = async function fetchRoles({ commit }) {
  const { data } = await Services.fetchRoles();
  commit(types.SET_ROLES, data);
};
