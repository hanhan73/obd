const listMixin = {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .add(-1, 'month')
                  .startOf('month'),
                moment()
                  .add(-1, 'month')
                  .endOf('month'),
              ]);
            },
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [moment().startOf('month'), moment()]);
            },
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .add(-1, 'week')
                  .startOf('week'),
                moment()
                  .add(-1, 'week')
                  .endOf('week'),
              ]);
            },
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', [moment().startOf('week'), moment()]);
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', [
                moment()
                  .add(-1, 'day')
                  .startOf('day'),
                moment()
                  .add(-1, 'day')
                  .endOf('day'),
              ]);
            },
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [moment().startOf('day'), moment()]);
            },
          },
        ],
      },
      pagination: {
        pageNumber: 1,
        pageSize: 15,
        dataCount: 0,
      },
      schema: {
        id: 'id',
      },
      tableData: [],
      tableLoading: false,
      keywords: '',
      multipleSelection: [],
      getAllConfig: {
        paging: true,
        dataPath: ['data'],
      },
    };
  },
  created() {
    if (this.$route.meta.name) this.name = this.$route.meta.name;
    if (this.$route.meta.zh_name) this.zh_name = this.$route.meta.zh_name;
    if (this.datePicker !== undefined) this.datePicker = this._getDefaultTimeRange();
    this.init();
  },
  computed: {
    thisEdit() {
      return `${this.name}Edit`;
    },
  },
  methods: {
    init() {
      //
    },
    tableRowClassName(row) {
      if (row.status === 0) {
        return 'warning-row';
      }
      return '';
    },
    selectItem(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.getAll();
    },
    handleCurrentChange(page) {
      this.pagination.pageNumber = page;
      this.getAll();
    },
    async getAll() {
      const { paging, dataPath } = this.getAllConfig;
      this.tableLoading = true;
      let params = {};
      if (paging) {
        // _.merge 会修改第一个参数原对象, 所以这里使用空对象 {}
        params = _.merge({}, this.params, this.pagination);
      } else {
        params = this.params;
      }
      try {
        const data = await this.obdApiPost(this.name, params);
        this.tableLoading = false;
        if (paging) {
          // 是否包含报表数据
          this.tableData = R.path(dataPath)(data);
          this.pagination.dataCount = data.page.totalRow;
        } else {
          this.tableData = data.data;
        }
        if (typeof this.afterGetAll === 'function') this.afterGetAll(data);
      } catch (e) {
        this.tableLoading = false;
      }
    },
    confirmDelete(id) {
      this.$confirm(`确认删除该${this.zh_name}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        modal: true,
      })
        .then(async () => {
          const params = {};
          params[this.schema.id] = id;
          const loading = _g.toastMsg('normal', '正在删除中...');
          await this.apiPost(this.delUrl, params);
          loading.close();
          _g.toastMsg('success', '删除成功');
          this.getAll();
        })
        .catch(() => {
          // catch error
        });
    },
    _getDefaultTimeRange() {
      const end = new Date();
      const start = new Date();
      start.setTime(((((start.getTime() - 3600) * 1000) * 24) * 30));
      return [start, end];
    },
  },
};

export default listMixin;
