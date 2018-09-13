export default {
  data() {
    return {
      navig: null,
      path: [],
      playerSpeed: 50,
      pathSimplifierIns: null,
      pathRenderOptions: {
        // 轨迹线的样式
        pathLineStyle: {
          strokeStyle: 'green',
          lineWidth: 6,
          dirArrowStyle: true,
        },
        pathLineHoverStyle: { strokeStyle: 'green' },
        pathLineSelectedStyle: { strokeStyle: 'green' },
        keyPointStyle: {
          fillStyle: '#409EFF',
          strokeStyle: '#fff',
          radius: 5,
          lineWidth: 0,
        },
        keyPointOnSelectedPathLineStyle: {
          fillStyle: '#409EFF',
          strokeStyle: '#fff',
          radius: 5,
          lineWidth: 0,
        },
        renderAllPointsIfNumberBelow: -1,
      },
      events: {
        init: (map) => {
          this.geocoder = new AMap.Geocoder();
          AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
            if (!PathSimplifier || !PathSimplifier.supportCanvas) {
              /* eslint-disable no-console */
              console.log('当前环境不支持 Canvas！');
            } else {
              // 创建组件实例
              const pathSimplifierIns = new PathSimplifier(
                _.defaultsDeep(
                  {
                    zIndex: 100,
                    map,
                    getPath(pathData) {
                      // 所属的地图实例
                      // 返回轨迹数据中的节点坐标信息，
                      // [AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                      return pathData.path;
                    },
                    getHoverTitle: this.getHoverTitle,
                    renderOptions: this.pathRenderOptions,
                  },
                  this.PathSimplifierOptions,
                ),
              );
              this.pathSimplifier = PathSimplifier;
              this.pathSimplifierIns = pathSimplifierIns;
            }
            this.init();
          });
        },
      },
      plugin: [
        'ToolBar',
        'RangingTool',
        {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init() {
              //
            },
          },
        },
      ],
    };
  },
  computed: {
    speed() {
      return this.playerSpeed * 50;
    },
    isPlaying() {
      if (this.navig) {
        if (this.navig.getNaviStatus() === 'moving') {
          return true;
        }
        return false;
      }
      return false;
    },
    percent() {
      if (this.navig) {
        const { idx, tail } = this.navig.getCursor();
        const path = this.path[this.navig.getPathIndex()];
        if (path.path.length <= 1) return 0;
        // eslint-disable-next-line
        const percent = Math.round((idx + tail) / (path.path.length - 1) * 100);
        return percent;
      }
      return 0;
    },
  },
  created() {
    this.MARK_BS = require('static/images/mark_bs.png');
    this.CAR_IMG = require('static/images/car_navig.png');
    this.START_IMG = require('static/images/point_start.png');
    this.END_IMG = require('static/images/point_end.png');
    this.STOP_IMG = require('static/images/stop-m.png');
  },
  methods: {
    init() {
      //
    },
    getHoverTitle(pathData, pathIndex, pointIndex) {
      // 返回鼠标悬停时显示的信息
      if (pointIndex >= 0) {
        // 鼠标悬停在某个轨迹节点上
        return `${pathData.name}，点:${pointIndex + 1}/${pathData.path.length}`;
      }
      // 鼠标悬停在节点之间的连线上
      return `${pathData.name}，点数量${pathData.path.length}`;
    },
    handlePlayOrPause() {
      if (this.isPlaying) {
        this.navig.pause();
      } else {
        this.navig.resume();
      }
    },
    handleStop() {
      this.navig.start(0);
      this.handlePlayOrPause();
      this.afterHandleStop();
    },
    afterHandleStop() {
      // TODO
    },
    destroyNavig() {
      if (this.navig) {
        this.navig.destroy();
        this.navig = null;
      }
    },
    start() {
      this.pathSimplifierIns.setData(this.path);
      // 创建一个巡航器
      this.navig = this.pathSimplifierIns.createPathNavigator(
        0, // 关联第1条轨迹
        {
          loop: false, // 循环播放
          speed: this.speed,
          pathNavigatorStyle: {
            width: 20,
            height: 40,
            content: this.pathSimplifier.Render.Canvas.getImageContent(
              '/static/images/car_navig.png',
              onload,
              onerror,
            ),
          },
        },
      );
      // eslint-disable-next-line
      this.navig.on("move", event => {
        this.onNavigatorMove(event);
      });

      const [{ path }] = this.path;
      const [sLng, sLat] = path[0];
      const [eLng, eLat] = path[path.length - 1];
      this.markers.push(
        ...[
          {
            position: [sLng, sLat],
            name: '起点',
            angle: 0,
            offset: [-16, -49],
            template: '<img src="/static/images/point_start.png"/>',
            animation: 'AMAP_ANIMATION_DROP',
          },
          {
            position: [eLng, eLat],
            name: '终点',
            angle: 0,
            offset: [-16, -49],
            template: '<img src="/static/images/point_end.png"/>',
            animation: 'AMAP_ANIMATION_DROP',
          },
        ],
      );
    },
    // eslint-disable-next-line
    onNavigatorMove(event) {
      // TODO
    },
    getAddress(position) {
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress(position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });
    },
  },
  destroyed() {
    if (this.pathSimplifierIns) this.pathSimplifierIns.clearPathNavigators();
    this.pathSimplifierIns = null;
  },
};
