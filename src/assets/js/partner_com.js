import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
      },
    };
  },
  computed: {
    ...mapGetters(['curPartnerid']),
  },
  methods: {
    normalizePartner(data, hideUser = false) {
      this._partner = data;
      const list = data;
      const zNodes = [];
      let obj = null;
      let ids = '';
      let gids = '';
      let pids = '';
      // monitor.selFId = list[0].pId;
      for (let i = 0; i < list.length; i += 1) {
        obj = list[i];
        if (obj.ispartner === 0) {
          obj.pId = `g_${obj.pId}`;
          obj.vId = `d${obj.vId}`;
          obj.name = `${obj.name}(管理员)`;
        }
        if (obj.vId) {
          if (ids.indexOf(`_${obj.pId}_`) < 0 && obj.parentid === 0) {
            zNodes.push({
              id: obj.pId,
              userid: obj.userid,
              pId: 0,
              name: obj.name,
              icon: 'home',
            });
            ids += `_${obj.pId}_,`;
          }
          if (obj.parentid !== null && obj.parentid !== 0 && pids.indexOf(`_${obj.pId}_`) < 0) {
            zNodes.push({
              id: obj.pId,
              userid: obj.userid,
              pId: obj.parentid,
              name: obj.name,
              icon: 'home',
            });
            pids += `_${obj.pId}_,`;
          }
          const carst = obj.isonline ? '在线' : '离线';
          if (obj.gId) {
            if (gids.indexOf(`_g_${obj.gId}_`) < 0) {
              zNodes.push({
                id: `z_${obj.gId}`,
                pId: obj.pId,
                name: obj.gName,
                icon: 'building',
              });
              gids += `_g_${obj.gId}_,`;
            }
            zNodes.push({
              id: `n_${obj.vId}`,
              pId: `z_${obj.gId}`,
              name: `${obj.carnumber}/${carst}`,
              icon: 'user',
              isonline: obj.isonline,
            });
          } else {
            zNodes.push({
              id: `n_${obj.vId}`,
              pId: obj.pId,
              name: `${obj.carnumber}/${carst}`,
              icon: 'user',
              isonline: obj.isonline,
            });
          }
          // monitor.prioritySns.push(obj.prioritySn);
        } else {
          if (ids.indexOf(`_${obj.pId}_`) < 0 && obj.parentid === 0) {
            zNodes.push({
              id: obj.pId,
              userid: obj.userid,
              pId: 0,
              name: obj.name,
              icon: 'home',
            });
            ids += `_${obj.pId}_,`;
          }
          if (obj.parentid !== null && obj.parentid !== 0 && pids.indexOf(`_${obj.pId}_`) < 0) {
            zNodes.push({
              id: obj.pId,
              userid: obj.userid,
              pId: obj.parentid,
              name: obj.name,
              icon: 'home',
            });
            pids += `_${obj.pId}_,`;
          }
        }
      }
      // console.log(zNodes);
      zNodes.map((i) => {
        i.pId = i.pId === '' ? 0 : i.pId;
        return i;
      });
      let tree = this.listToTree(parseInt(this.curPartnerid, 10), zNodes, hideUser);
      if (hideUser) tree = tree.filter(this._filterUser);
      return tree;
    },
    _filterUser(i) {
      return i.id.toString().substr(0, 1) !== 'n';
    },
    listToTree(id, data, hideUser) {
      const children = [];
      data.forEach((item) => {
        if (item.pId === id) {
          item.children = this.listToTree(item.id, data, hideUser);
          let total = 0;
          let online = 0;
          item.children.forEach((i) => {
            if (i.isonline !== undefined) {
              total += 1;
              if (i.isonline) {
                online += 1;
              }
            } else if (i.total !== undefined) {
              total += i.total;
              online += i.online;
            }
          });
          item.total = total;
          item.online = online;
          if (hideUser) {
            item.children = item.children.filter(this._filterUser);
          }
          children.push(item);
        }
      });
      return children;
    },
    renderContent(h, { node, data }) {
      return (
        <span
          class={{
            'el-tree-node__label': true,
            'c-sliver': data.isonline === false,
            'c-green': data.isonline === true,
          }}
        >
          <i class={`c-blue fa fa-${data.icon}`} aria-hidden="true" />
          &nbsp;
          {node.label}
          &nbsp;
          <i>
            (<i class="c-green f-w-b">{data.online}</i>/{data.total})
          </i>
        </span>
      );
    },
  },
};
