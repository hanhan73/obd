const formMixin = {
  data() {
    return {
      id: null,
      preLoading: false,
      isLoading: false,
      formLoading: false,
      dialogVisible: false,
    };
  },
  created() {
    if (this.$route.meta.name) this.name = this.$route.meta.name;
    if (this.$route.meta.zh_name) this.zh_name = this.$route.meta.zh_name;
    if (this.$route.params.id && !this.clientId) this.id = this.$route.params.id;
    this.init();
  },
  methods: {
    init() {
      //
    },
    open() {
      this.beforeOpen();
      this.dialogVisible = true;
    },
    beforeOpen() {},
    close() {
      this.dialogVisible = false;
    },
    goback() {
      this.dialogVisible = false;
    },
    onBeforeClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          if (this.$refs.form) this.$refs.form.resetFields();
          done();
        })
        .catch(() => {});
    },
    getById() {
      return new Promise(async (resolve, reject) => {
        if (!this.id) return;
        try {
          const data = await this.apiPost(this.getUrl, { id: this.id });
          for (const i in this.form) {
            if (data.data[i] !== undefined) {
              this.form[i] = data.data[i];
            }
          }
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    add() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          this.isLoading = !this.isLoading;
          let form = this.form;
          if (typeof this.beforeAdd === 'function') {
            form = this.beforeAdd();
          }
          try {
            const data = await this.apiPost(this.name, form);
            _g.toastMsg('success', '添加成功');
            setTimeout(() => {
              if (typeof this.afterAdd === 'function') {
                this.afterAdd(data);
              }
              if (this.$refs.form) this.$refs.form.resetFields();
              this.isLoading = !this.isLoading;
              this.goback();
              this.$emit('init');
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    edit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          let form = _g.cloneJson(this.form);
          if (typeof this.beforeEdit === 'function') {
            form = this.beforeEdit();
          }
          if (this.rejected_form) {
            _(this.rejected_form).forEach(val => delete form[val]);
          }
          this.isLoading = !this.isLoading;
          try {
            form.id = this.id;
            await this.apiPost(this.name, form);
            _g.toastMsg('success', '编辑成功');
            setTimeout(() => {
              this.isLoading = !this.isLoading;
              this.goback();
              this.$emit('init');
              this.afterEdit();
            }, 1000);
          } catch (e) {
            this.isLoading = !this.isLoading;
          }
        }
      });
    },
    afterEdit() {
      //
    },
    checkNumberAndNagetive() {
      return (rule, value, callback) => {
        if (rule.required) {
          if (!value) {
            return callback(new Error('不能为空'));
          }
          setTimeout(() => {
            if (`${parseInt(value, 10)}` !== `${value}`) {
              callback(new Error('请输入数字值'));
            } else {
              if (parseInt(value, 10) <= 0) {
                callback(new Error('必须大于0'));
              }
              this.form[rule.field] = parseInt(value, 10);
              callback();
            }
          }, 100);
        } else {
          callback();
        }
        return null;
      };
    },
  },
};

export default formMixin;
