export default {
  created() {
    // 电子围栏
    window.findFence = async (sn) => {
      if (this.isLoading) {
        return;
      }
      this.showPlayer = false;

      this.isLoading = true;
      try {
        const { data } = await this.apiPost('/fence/searchFence', { sn, fenceid: '' });
        this.fenceData = data;

        this._sn = sn;
        this.isShrink = false;
      } finally {
        this.isLoading = false;
      }
    };
  },
  methods: {
    handleAddFence() {
      this.clearCirclesAndPolygons();
      if (this.isCursorCrosshair && this._mousetool) {
        this.isCursorCrosshair = false;
        this._mousetool.close(true);
        return;
      }
      const map = this.$map;
      this.isCursorCrosshair = true;
      const mousetool = new AMap.MouseTool(map);
      this._mousetool = mousetool;
      mousetool.circle({ map });
      mousetool.on('draw', ({ obj }) => {
        const { Qi: { center: { lng, lat }, radius } } = obj;
        if (radius < 100 || radius > 10000) {
          _g.toastMsg('error', '半径不能小于100米且不能大于10千米');
          this.isCursorCrosshair = false;
          mousetool.close(true);
          this.handleAddFence();
        } else {
          this.$refs.addFence.open({ lng, lat, radius, sn: this._sn });
          this.$refs.addFence.handleClose = () => {
            this.isCursorCrosshair = false;
            mousetool.close(true);
          };
          this.$refs.addFence.afterAdd = () => {
            this.isCursorCrosshair = false;
            mousetool.close(true);
            window.findFence(this._sn);
          };
        }
      });
    },
    handleFenceRowClick(row) {
      this.clearCirclesAndPolygons();
      const map = this.$map;
      if (row.fenceType === 0 || row.fenceType === 3) {
        const {
          lon,
          lat,
          radius,
        } = row;
        this.circles = [{
          center: [lon, lat],
          radius,
        }];
        this.$nextTick(() => {
          map.setFitView(map.getAllOverlays('circle'));
        });
      } else {
        const { points } = row;
        const arr = points.substr(0, points.length - 1).split('|');
        const path = arr.map(i => i.split(','));
        this.polygons = [{
          path,
        }];
        this.$nextTick(() => {
          map.setFitView(map.getAllOverlays('polygon'));
        });
      }
    },
    async handleFenceDelete(fenceId) {
      const loading = _g.toastMsg('normal', '正在删除中...');
      await this.apiPost('/fence/deleteFence', { fenceId });
      setTimeout(() => {
        loading.close();
        _g.toastMsg('success', '删除围栏成功!');
        window.findFence(this._sn);
      }, 800);
    },
  },
};
