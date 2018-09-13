const commonFn = {
  j2s(obj) {
    return JSON.stringify(obj);
  },
  shallowRefresh(name) {
    router.replace({ path: '/refresh', query: { name } });
  },
  cloneJson(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  toastMsg(type, msg) {
    switch (type) {
      case 'normal':
        return bus.$message({
          message: msg,
          type: 'info',
          customClass: 'message-bottom',
        });
      case 'success':
        return bus.$message({
          message: msg,
          type: 'success',
          customClass: 'message-bottom',
        });
      case 'warning':
        return bus.$message({
          message: msg,
          type: 'warning',
          customClass: 'message-bottom',
        });
      case 'error':
        return bus.$message({
          message: msg,
          type: 'error',
          customClass: 'message-bottom',
        });
      default:
        return null;
    }
  },
  getHasRule(val) {
    const moduleRule = 'admin';
    const userInfo = Lockr.get('userInfo');
    if (userInfo.id === 1) {
      return true;
    }
    const authList = moduleRule + Lockr.get('authList');
    return _.includes(authList, val);
  },
};

export default commonFn;
