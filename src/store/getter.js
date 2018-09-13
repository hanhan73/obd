/* eslint-disable import/prefer-default-export */
export const menu = state => state.menu;

export const partners = state => state.partners;

export const partnersTree = state => state.partnersTree;

export const groups = state => state.groups;

export const types = state => state.types;

export const roles = state => state.roles;

export const point = state => state.point;

export const alertList = state => state.alertList;

export const curSecurId = () => Lockr.get('securId');

export const curPartnerid = () => Lockr.get('partnerid');

export const curSeusername = () => Lockr.get('seusername');

export const curPartnername = () => Lockr.get('partnername');
