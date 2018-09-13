/* eslint-disable no-console */
import axios from 'axios';

const backEnd = axios.create({
  baseURL: HOST,
  timeout: 1000 * 30,
});
const DeviceBackEnd = axios.create({
  baseURL: DEVICE_HOST,
  timeout: 1000 * 30,
});
const fkBackEnd = axios.create({
  baseURL: FK_HOST,
  timeout: 1000 * 30,
});
const obdBackEnd = axios.create({
  baseURL: OBD_HOST,
  timeout: 1000 * 30,
});

const apiMethods = {
  methods: {
    transformRequest(requestData) {
      let ret = '';
      for (const it in requestData) {
        if (Object.prototype.hasOwnProperty.call(requestData, it) && requestData[it] !== null) {
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(requestData[it])}&`;
        }
      }
      return ret.substring(0, ret.length - 1);
    },
    apiGet(url, data) {
      return new Promise((resolve, reject) => {
        backEnd.get(url, data).then(
          (response) => {
            resolve(response.data);
          },
          (response) => {
            reject(response);
            bus.$message({
              message: '请求超时，请检查网络',
              type: 'warning',
            });
          },
        );
      });
    },
    apiPost(url, data, handleResponse) {
      return new Promise((resolve, reject) => {
        const tokenId = Lockr.get('tokenId');
        if (tokenId) {
          data.tokenId = tokenId;
        }
        backEnd
          .post(url, R.filter(i => i !== null)(data), {
            transformRequest: [this.transformRequest],
          })
          .then((response) => {
            if (typeof handleResponse === 'function') {
              resolve(response.data);
              return handleResponse(response.data);
            }
            this.handelResponse(
              response.data,
              res => resolve(res),
              (err) => {
                reject(err);
              },
            );
            return null;
          })
          .catch(({ response }) => {
            bus.$message({
              message: `请求超时，请检查网络 ${response.status}:${response.statusText}`,
              type: 'warning',
            });
            reject(new Error('internet error!'));
          });
      });
    },
    obdApiPost(url, data, handleResponse) {
      return new Promise((resolve, reject) => {
        const tokenId = Lockr.get('tokenId');
        if (tokenId) {
          data.tokenId = tokenId;
        }
        obdBackEnd
          .post(url, R.filter(i => i !== null)(data), {
            transformRequest: [this.transformRequest],
          })
          .then((response) => {
            if (typeof handleResponse === 'function') {
              resolve(response.data);
              return handleResponse(response.data);
            }
            this.handelResponse(
              response.data,
              res => resolve(res),
              (err) => {
                reject(err);
              },
            );
            return null;
          })
          .catch(({ response }) => {
            bus.$message({
              message: `请求超时，请检查网络 ${response.status}:${response.statusText}`,
              type: 'warning',
            });
            reject(new Error('internet error!'));
          });
      });
    },
    deviceApiPost(url, data, handleResponse) {
      return new Promise((resolve, reject) => {
        const tokenId = Lockr.get('tokenId');
        if (tokenId) {
          data.tokenId = tokenId;
        }
        DeviceBackEnd.post(url, R.filter(i => i !== null)(data), {
          transformRequest: [this.transformRequest],
        })
          .then((response) => {
            if (typeof handleResponse === 'function') {
              resolve(response.data);
              return handleResponse(response.data);
            }
            this.handelResponse(response.data, res => resolve(res), () => {
              reject(new Error('Go wrong!'));
            });
            return null;
          })
          .catch(({ response }) => {
            // console.log(JSON.stringify(response));
            bus.$message({
              message: `请求超时，请检查网络 ${response.status}:${
                response.statusText
              }`,
              type: 'warning',
            });
            reject(new Error('internet error!'));
          });
      });
    },
    fkApiPost(url, data, handleResponse) {
      return new Promise((resolve, reject) => {
        const tokenId = Lockr.get('fkTokenId');
        if (tokenId) {
          data.tokenId = tokenId;
        }
        fkBackEnd.post(url, R.filter(i => i !== null)(data), {
          transformRequest: [this.transformRequest],
        })
          .then((response) => {
            if (typeof handleResponse === 'function') {
              resolve(response.data);
              return handleResponse(response.data);
            }
            this.handelFkResponse(response.data, res => resolve(res), () => {
              reject(new Error('Go wrong!'));
            });
            return null;
          })
          .catch(({ response }) => {
            // console.log(JSON.stringify(response));
            bus.$message({
              message: `请求超时，请检查网络 ${response.status}:${
                response.statusText
              }`,
              type: 'warning',
            });
            reject(new Error('internet error!'));
          });
      });
    },
    apiDelete(url, id) {
      return new Promise((resolve, reject) => {
        backEnd.delete(url + id).then(
          (response) => {
            resolve(response.data);
          },
          (response) => {
            reject(response);
            bus.$message({
              message: '请求超时，请检查网络',
              type: 'warning',
            });
          },
        );
      });
    },
    apiPut(url, id, obj) {
      return new Promise((resolve, reject) => {
        backEnd.put(url + id, obj).then(
          (response) => {
            resolve(response.data);
          },
          (response) => {
            bus.$message({
              message: '请求超时，请检查网络',
              type: 'warning',
            });
            reject(response);
          },
        );
      });
    },
    handelResponse(res, cb, errCb) {
      if (res.retCode === 0) {
        cb(res);
      } else {
        if (typeof errCb === 'function') {
          errCb(res);
        }
        this.handleError(res);
      }
    },
    handleError(res) {
      if (res.retCode !== undefined) {
        switch (res.retCode) {
          case 99:
            _g.toastMsg('error', '登录已失效, 请重新登录');
            router.push('/');
            break;
          case 103:
            _g.toastMsg('error', res.error);
            setTimeout(() => {
              router.replace('/');
            }, 1500);
            break;
          default:
            _g.toastMsg('error', res.message);
        }
      } else {
        console.log('default error');
      }
    },
    handelFkResponse(res, cb, errCb) {
      if (res.errCode === 0) {
        cb(res);
      } else {
        if (typeof errCb === 'function') {
          errCb(res);
        }
        this.handleFKError(res);
      }
    },
    handleFKError(res) {
      if (res.errCode !== undefined || res.errId !== undefined) {
        switch (res.errCode || res.errId) {
          // case 99:
          //   _g.toastMsg('error', '登录已失效, 请重新登录');
          //   router.push('/');
          //   break;
          case '-1003':
            _g.toastMsg('error', '-1003: 登录已失效, 请重新登录');
            router.push('/');
            break;
          default:
            _g.toastMsg('error', res.errMsg);
        }
      } else {
        console.log('default error');
      }
    },
    resetCommonData(res) {
      const { data: { id, username, partnerid, partnername, roleid, accounttype, tokenId } } = res;
      Cookies.set('securId', id);
      Cookies.set('seusername', username);
      // Cookies.set('mobile', mobile);
      Cookies.set('accounttype', accounttype);
      Cookies.set('partnerid', partnerid);
      Cookies.set('roleid', roleid);
      Cookies.set('partnername', partnername);
      Cookies.set('backuser', res.data);
      Lockr.set('securId', id);
      Lockr.set('seusername', username);
      // Lockr.set('mobile', mobile);
      Lockr.set('partnerid', id);
      Lockr.set('roleid', roleid);
      Lockr.set('partnername', partnername);
      Lockr.set('backuser', res.data);
      Lockr.set('accounttype', accounttype);

      Lockr.set('tokenId', tokenId);
      Lockr.set('editableTabs', '');
    },
    reAjax(url, data) {
      return new Promise((resolve, reject) => {
        backEnd.post(url, data).then(
          (response) => {
            resolve(response.data);
          },
          (response) => {
            reject(response);
            bus.$message({
              message: '请求超时，请检查网络',
              type: 'warning',
            });
          },
        );
      });
    },
  },
};

export default apiMethods;
