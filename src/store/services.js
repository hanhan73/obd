import http from '@/assets/js/http';

class Services {
  constructor() {
    this.axios = http.methods;
  }
  fetchResource() {
    return this.axios.obdApiPost('/roleMenu/getResource', {});
  }
  // fetchAlertList() {
  //   return this.axios.apiPost('/deviceAlert/queryAlertList',
  // { alertstatus: 0, timeType: 1, pageSize: 10, status: 1 });
  // }
  fetchPartners() {
    return this.axios.apiPost('/backUser/findAll', { pageSize: 10000 });
  }
  // fetchGroups() {
  //   return this.axios.apiPost('/vehicle/getGroups', { pageSize: 10000 });
  // }
  // fetchTypes() {
  //   return this.axios.apiPost('vehicleDanger/queryTypes', { pageSize: 10000 });
  // }
  fetchRoles() {
    return this.axios.apiPost('/roleMenu/queryList', { pageSize: 10000 });
  }
  // fetchUserPoint() {
  //   return this.axios.fkApiPost('/appUserPoint/getPointByUser', {});
  // }
}

export default new Services();
