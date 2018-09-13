<template>
  <div class="personal-setting-wrapper">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="登录名">
        {{username}}
      </el-form-item>
      <el-form-item label="账号名称">
        {{partnername}}
      </el-form-item>
      <el-form-item label="分组">
        {{groupname}}
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input class="w-200" v-model.trim="form.mobile"></el-input>
      </el-form-item>
      <!-- <el-form-item label="旧密码" prop="oldPass">
        <el-input class="w-200" v-model.trim="form.oldPassword"></el-input>
      </el-form-item> -->
      <el-form-item label="新密码" prop="userpwd">
        <el-input class="w-200" v-model.trim="form.userpwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input class="w-200" v-model.trim="form.confirmPassword" type="password"></el-input>
      </el-form-item>
      <!-- <el-form-item label="地图刷新时间">
        <el-input class="w-200" v-model="form.mapRefreshTime"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '@/assets/js/http';

export default {
  mixins: [http],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.userpwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const username = Lockr.get('seusername');
    return {
      username,
      partnername: Lockr.get('partnername'),
      groupname: null,
      form: {
        username,
        id: Lockr.get('securId'),
        mobile: Lockr.get('mobile'),
        userpwd: '',
        confirmPassword: '',
      },
      rules: {
        // mobile: [
        //   { required: true, message: '请输入手机号' },
        // ],
        userpwd: [
          { validator: validatePass, trigger: 'blur' },
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(async (pass) => {
        if (pass) {
          try {
            await this.apiPost('/backuser/upSecurUser', this.form);
            _g.toastMsg('success', '修改成功');
            this.$router.push('/');
          } catch (e) {
            //
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus">
  .personal-setting-wrapper
    padding: 20px
    background: #fff
    border-bottom: 1px solid #ccc
</style>
